"""Lokalny serwer Kompasu Poglądów.

Serwuje aplikację i przekazuje zapytania asystenta głosowego do ElevenLabs (głos, rozpoznawanie mowy)
oraz Claude (rozumienie swobodnych odpowiedzi). Klucze API czyta z pliku .env obok tego pliku
albo ze zmiennych środowiskowych — nigdy nie trafiają do przeglądarki.

Uruchomienie: python server.py   (albo dwuklik w start.bat)
Bez kluczy też działa — asystent używa wtedy darmowego głosu przeglądarki.
"""
import json
import os
import sys
import urllib.error
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_env():
    """Wczytuje proste pary KLUCZ=WARTOŚĆ z pliku .env (bez nadpisywania zmiennych środowiskowych)."""
    env = ROOT / ".env"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env()
PORT = int(os.environ.get("KOMPAS_PORT", "8765"))
ELEVEN_KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
ELEVEN_VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")
ELEVEN_TTS_MODEL = os.environ.get("ELEVENLABS_TTS_MODEL", "eleven_multilingual_v2")
ELEVEN_STT_MODEL = os.environ.get("ELEVENLABS_STT_MODEL", "scribe_v2")
CLAUDE_MODEL = os.environ.get("CLAUDE_MODEL", "claude-opus-5-5")

try:
    import anthropic
except ImportError:
    anthropic = None
claude = None
if anthropic is not None:
    try:
        claude = anthropic.Anthropic()
    except Exception:  # brak klucza / danych logowania
        claude = None

# Odpowiedź Claude jest wymuszona schematem JSON (structured outputs).
INTERPRET_SCHEMA = {
    "type": "object",
    "properties": {
        "action": {"type": "string", "enum": ["answer", "skip", "repeat", "explain", "back", "stop", "unclear"]},
        "value": {"type": "integer", "description": "Wybrana wartość z listy options; -99 gdy action != answer."},
        "importance": {"type": "number", "description": "0.5 = mało ważne, 1 = normalnie, 2 = bardzo ważne."},
        "reply": {"type": "string", "description": "Krótka odpowiedź do przeczytania na głos, w języku użytkownika."},
    },
    "required": ["action", "value", "importance", "reply"],
    "additionalProperties": False,
}

INTERPRET_SYSTEM = """Jesteś asystentem głosowym w ankiecie o poglądach politycznych i społecznych.
Dostajesz pytanie, listę dozwolonych odpowiedzi (options: value + label) i to, co użytkownik powiedział
(transkrypcja mowy, może zawierać błędy rozpoznawania).
Twoje zadanie: ustalić, którą z dozwolonych odpowiedzi użytkownik wybrał, albo jakie polecenie wydał.
- action "answer": użytkownik wyraził stanowisko — value MUSI być jedną z wartości z options.
  Przy swobodnej wypowiedzi wybierz najbliższą opcję (np. "no generalnie tak, ale z wyjątkami" → raczej tak).
- "skip" (pominąć), "repeat" (powtórzyć pytanie), "explain" (wyjaśnić pytanie), "back" (poprzednie pytanie),
  "stop" (zakończyć lub przerwać), "unclear" (nie da się ustalić).
- importance: 2, jeśli podkreśla, że sprawa jest dla niego bardzo ważna; 0.5, jeśli mówi, że mało ważna; inaczej 1.
- reply: jedno krótkie zdanie w języku użytkownika (lang). Przy "answer" potwierdź wybór słowami etykiety.
  Przy "unclear" grzecznie poproś o odpowiedź jedną z opcji. Nie oceniaj poglądów użytkownika."""


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".webmanifest": "application/manifest+json", ".js": "text/javascript"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    # ── Pomocnicze ──
    def log_message(self, fmt, *args):
        if "/api/" in self.path or (len(args) > 1 and str(args[1])[:1] in "45"):
            super().log_message(fmt, *args)

    def send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body(self):
        length = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(length) if length else b""

    def api_allowed(self):
        # Własny nagłówek wymusza preflight CORS, na który nie odpowiadamy — obce strony
        # nie mogą więc wywołać API (i zużyć Twoich kluczy) z przeglądarki.
        if self.headers.get("X-Kompas") != "1":
            self.send_json(403, {"error": "forbidden"})
            return False
        return True

    # ── GET: pliki aplikacji + status ──
    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/api/status":
            if not self.api_allowed():
                return
            return self.send_json(200, {
                "elevenlabs": bool(ELEVEN_KEY),
                "claude": claude is not None,
                "sttModel": ELEVEN_STT_MODEL,
                "claudeHint": None if claude else ("pip install anthropic" if anthropic is None else "ANTHROPIC_API_KEY"),
            })
        # Nie serwuj plików ukrytych (.env) ani samego serwera.
        name = path.rsplit("/", 1)[-1]
        if name.startswith(".") or "/." in path or name in ("server.py", "start.bat"):
            self.send_error(404)
            return
        super().do_GET()

    # ── POST: API ──
    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if not self.api_allowed():
            return
        try:
            if path == "/api/tts":
                return self.tts()
            if path == "/api/stt":
                return self.stt()
            if path == "/api/interpret":
                return self.interpret()
            self.send_json(404, {"error": "not found"})
        except Exception as e:  # nie wysypuj serwera — zwróć błąd do przeglądarki
            self.send_json(500, {"error": str(e)})

    def eleven_request(self, url, body, content_type):
        req = urllib.request.Request(url, data=body, method="POST", headers={
            "xi-api-key": ELEVEN_KEY, "Content-Type": content_type,
        })
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.headers.get("Content-Type", ""), r.read()
        except urllib.error.HTTPError as e:
            return e.code, "application/json", e.read()

    def tts(self):
        if not ELEVEN_KEY:
            return self.send_json(400, {"error": "Brak ELEVENLABS_API_KEY w pliku .env"})
        data = json.loads(self.read_body() or b"{}")
        text = str(data.get("text", ""))[:2500]
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE}?output_format=mp3_44100_128"
        status, ctype, audio = self.eleven_request(
            url, json.dumps({"text": text, "model_id": ELEVEN_TTS_MODEL}).encode("utf-8"), "application/json")
        if status != 200:
            return self.send_json(502, {"error": "ElevenLabs TTS", "status": status, "detail": audio.decode("utf-8", "replace")[:500]})
        self.send_response(200)
        self.send_header("Content-Type", ctype or "audio/mpeg")
        self.send_header("Content-Length", str(len(audio)))
        self.end_headers()
        self.wfile.write(audio)

    def stt(self):
        if not ELEVEN_KEY:
            return self.send_json(400, {"error": "Brak ELEVENLABS_API_KEY w pliku .env"})
        # Przeglądarka wysyła gotowy multipart (file, model_id, language_code) — przekazujemy go dalej bez zmian.
        status, _, body = self.eleven_request(
            "https://api.elevenlabs.io/v1/speech-to-text", self.read_body(), self.headers.get("Content-Type", ""))
        if status != 200:
            return self.send_json(502, {"error": "ElevenLabs STT", "status": status, "detail": body.decode("utf-8", "replace")[:500]})
        data = json.loads(body)
        text = data.get("text") or " ".join(t.get("text", "") for t in data.get("transcripts", []))
        self.send_json(200, {"text": text.strip()})

    def interpret(self):
        if claude is None:
            return self.send_json(400, {"error": "Claude niedostępny — zainstaluj pakiet: pip install anthropic i ustaw ANTHROPIC_API_KEY"})
        payload = json.loads(self.read_body() or b"{}")
        params = dict(
            model=CLAUDE_MODEL,
            max_tokens=1024,
            output_config={"effort": "low", "format": {"type": "json_schema", "schema": INTERPRET_SCHEMA}},
            system=INTERPRET_SYSTEM,
            messages=[{"role": "user", "content": json.dumps(payload, ensure_ascii=False)}],
        )
        try:
            try:
                # Gdy model odmówi, API samo spróbuje modelu zapasowego (server-side fallback).
                resp = claude.beta.messages.create(betas=["server-side-fallback-2026-07-01"], fallbacks="default", **params)
            except TypeError:  # starsza wersja SDK bez parametru fallbacks
                resp = claude.messages.create(**params)
        except anthropic.APIStatusError as e:
            return self.send_json(502, {"error": "Claude API", "status": e.status_code, "detail": str(e)[:500]})
        except anthropic.APIConnectionError as e:
            return self.send_json(502, {"error": "Claude: brak połączenia", "detail": str(e)[:300]})
        if resp.stop_reason == "refusal":
            return self.send_json(200, {"action": "unclear", "value": -99, "importance": 1, "reply": ""})
        text = next((b.text for b in resp.content if b.type == "text"), "{}")
        self.send_json(200, json.loads(text))


def main():
    # python server.py [port] [--no-browser]
    port = next((int(a) for a in sys.argv[1:] if a.isdigit()), PORT)
    if "--no-browser" in sys.argv:
        os.environ["KOMPAS_NO_BROWSER"] = "1"
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    url = f"http://localhost:{port}/"
    print(f"Kompas Poglądów działa: {url}")
    print(f"  ElevenLabs: {'tak' if ELEVEN_KEY else 'nie (brak ELEVENLABS_API_KEY w .env)'}")
    print(f"  Claude:     {'tak' if claude else 'nie (pip install anthropic + ANTHROPIC_API_KEY w .env)'}")
    print("Zamknij to okno (albo Ctrl+C), aby zatrzymać serwer.")
    if os.environ.get("KOMPAS_NO_BROWSER") != "1":
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
