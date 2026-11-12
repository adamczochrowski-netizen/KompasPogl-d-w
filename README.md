# Kompas Poglądów

Apka do określania swojego światopoglądu na 10 osiach:
Gospodarka, Władza (demokracja ↔ totalitaryzm), Obyczaje, Świat, Ekologia, Religia,
Bezpieczeństwo, Sprawiedliwość, Technologia, Ustrój terytorialny.

Działa na komputerze i na telefonie. Na telefonie można ją zainstalować jak zwykłą aplikację i używać bez internetu.

## Uruchomienie
- **Na komputerze, najprościej:** dwuklik w `index.html`.
- **Z asystentem ElevenLabs / AI:** dwuklik w `start.bat` (szczegóły niżej).
- **Na telefonie:** po publikacji na GitHub Pages otwórz adres strony i wybierz „Dodaj do ekranu głównego” (Android: menu ⋮, iPhone: przycisk Udostępnij).

Odpowiedzi zapisują się w przeglądarce, na danym urządzeniu.

## Co jest w środku
- **Pytania w formie stanowisk:** przy każdym pytaniu wybierasz stanowisko najbliższe Tobie, typowe dla lewicy, centrum albo prawicy. Prawica dzieli się na konserwatywną i wolnorynkową tam, gdzie się różnią.
- **Dymek „i”:** dlaczego dany obóz tak uważa, przykład z prawdziwego świata i link do Wikipedii.
- **Ważność** każdej odpowiedzi: mało / normalnie / bardzo (waga ×0,5 / ×1 / ×2).
- **Wyniki:**
  - paski 10 osi, kompas 2D, radar i ewolucja;
  - **Twój rozkład**: ile razy wybierasz lewicę, centrum i prawicę, ogółem i w każdej dziedzinie, plus Twoje wyjątki;
  - pewność wyniku.
- **Dopasowanie:** typy poglądów, partie (Polska, Europa, Ameryki, Azja, Afryka) i 3 postacie (z Polski, ze świata i z fikcji). Pozycje to przybliżone szacunki.
- **Migawki** w czasie i **porównanie ze znajomym** (wczytujesz jego plik z Eksportu).
- **Raport** (drukuj albo zapisz jako PDF) i **obrazek PNG** do udostępnienia.
- **Na telefonie:** dolny pasek z zakładkami Pytania / Wynik / Dopasowanie / Więcej.

Stare pytania ze skalą zgody (`js/questions-*.js`) czekają na przerobienie na stanowiska. Apka używa ich tylko do zapisania starego wyniku jako migawki.

## Asystent głosowy 🎙️
Na starcie wybierasz **wersję tradycyjną** albo **z asystentem AI**. Wybór zmienisz przyciskiem 🎙️ Asystent.

Asystent czyta pytanie i stanowiska. Odpowiadasz numerem („drugie”) albo nazwą obozu („centrum”, „prawica wolnorynkowa”).
Dostępne polecenia: „powtórz”, „wyjaśnij”, „pomiń”, „wstecz”, „stop”. Możesz dodać „bardzo ważne” albo „mało ważne”.

- **Za darmo, bez kluczy** (też na GitHub Pages i telefonie): głos i rozpoznawanie mowy z przeglądarki. Najlepiej w Edge lub Chrome.
- **ElevenLabs** (naturalny głos) i **Claude** (rozumienie swobodnych odpowiedzi). Działają tylko na komputerze, przez lokalny serwer:
  1. Skopiuj `.env.example` jako `.env` i wpisz klucze.
  2. Dla Claude doinstaluj pakiet: `pip install anthropic`.
  3. Uruchom **`start.bat`**.

  Klucze zostają na Twoim komputerze. Plik `.env` jest w `.gitignore`, więc nie trafi na GitHub.

## Publikacja na GitHub Pages
1. Wrzuć zawartość folderu `KompasPogladow` do repozytorium na GitHubie (np. przez GitHub Desktop). Pliku `.env` nie wrzucaj: `.gitignore` sam go pominie.
2. W repozytorium: **Settings → Pages → Build and deployment → Deploy from a branch**, gałąź `main`, folder `/ (root)`.
3. Po minucie strona będzie pod adresem `https://<twoja-nazwa>.github.io/<nazwa-repozytorium>/`.

Przy kolejnych zmianach podbij numer `CACHE` w `sw.js` (np. `kompas-v2`), żeby telefony szybciej pobrały nową wersję.

## Pliki
- `index.html`, `css/style.css`: wygląd
- `js/positions.js`, `js/positions-2.js`: 40 pytań w formie stanowisk (aktualne)
- `js/questions-1.js`, `js/questions-2.js`, `js/questions-3.js`: stare pytania ze skalą (do przerobienia)
- `js/data.js`: osie, obozy, archetypy
- `js/references.js`: partie i postacie (wektor 10 wartości od -1 do 1, w kolejności osi)
- `js/i18n.js`: teksty interfejsu (PL / EN)
- `js/charts.js`: wykresy
- `js/app.js`: logika
- `js/voice.js`: asystent głosowy
- `manifest.webmanifest`, `sw.js`, `icons/`: instalacja na telefonie i działanie offline
- `server.py`, `start.bat`, `.env.example`: lokalny serwer z kluczami API (ElevenLabs, Claude)

## Dodanie pytania (stanowiska)
```js
{ id: 'x_nazwa', type: 'positions',
  text: { pl: 'Pytanie?', en: 'Question?' },
  what: { pl: 'O co chodzi', en: '…' },
  options: [
    { camp: 'left', effects: { econ: -0.9 },
      text: { pl: 'Stanowisko', en: '…' }, why: { pl: 'Dlaczego', en: '…' },
      example: { pl: 'Przykład', en: '…' }, wiki: { pl: 'Hasło Wikipedii', en: 'Wikipedia title' } },
    { camp: 'center', … }, { camp: 'right', … }   // albo right_cons + right_free
  ] }
```
`effects` to „adres” stanowiska na osiach, od -1 do 1. Centrum nie musi leżeć w 0: o adresie decyduje treść stanowiska.
