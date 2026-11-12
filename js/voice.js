// Asystent głosowy: czyta pytania na głos, słucha odpowiedzi przez mikrofon i zaznacza je w apce.
// Głos: przeglądarka (darmowy) albo ElevenLabs. Słuchanie: przeglądarka (Chrome/Edge) albo ElevenLabs Scribe.
// Swobodne odpowiedzi może zinterpretować Claude. ElevenLabs i Claude działają przez lokalny server.py.
(function () {
  const App = SZ.App;
  const PREFS_KEY = 'kompas-voice-v1';
  const VALUES = [-2, -1, 0, 1, 2];
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const $ = id => document.getElementById(id);
  const t = (k, v) => App.t(k, v), tr = o => App.tr(o);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  Object.assign(SZ.I18N.pl, {
    voiceBtn: '🎙️ Asystent', voiceBtnTxt: ' Asystent',
    startTitle: 'Jak chcesz wypełnić kompas?',
    startClassic: 'Wersja tradycyjna', startClassicDesc: 'Czytasz pytania i klikasz odpowiedzi.',
    startVoice: 'Z asystentem AI', startVoiceDesc: 'Asystent czyta pytania na głos, a Ty odpowiadasz przez mikrofon.',
    startRemember: 'Zapamiętaj mój wybór (zmienisz go przyciskiem 🎙️ Asystent)',
    setupTitle: 'Ustawienia asystenta',
    setupVoice: 'Głos asystenta', optBrowserVoice: 'Przeglądarka (darmowy)', optEleven: 'ElevenLabs (naturalny)',
    setupStt: 'Rozpoznawanie mowy', optBrowserStt: 'Przeglądarka (Chrome / Edge)', optElevenStt: 'ElevenLabs Scribe', optTypeOnly: 'Bez mikrofonu — wpisuję odpowiedzi',
    setupAi: 'Rozumienie swobodnych odpowiedzi przez AI (Claude)',
    setupRate: 'Tempo mowy',
    setupNoServer: 'Głos ElevenLabs i AI wymagają uruchomienia apki przez <b>start.bat</b> (lokalny serwer z kluczami w pliku <code>.env</code>). Teraz działa darmowy głos przeglądarki.',
    setupWeb: 'W wersji internetowej asystent używa darmowego głosu i rozpoznawania mowy przeglądarki. Naturalny głos ElevenLabs i rozumienie przez AI działają w wersji uruchamianej na komputerze (start.bat).',
    setupNoEleven: 'ElevenLabs: brak klucza <code>ELEVENLABS_API_KEY</code> w pliku <code>.env</code>.',
    setupNoClaude: 'AI: niedostępne — {hint}.',
    setupNoStt: 'Ta przeglądarka nie rozpoznaje mowy. Użyj Chrome lub Edge albo wpisuj odpowiedzi.',
    setupPrivacy: 'Rozpoznawanie mowy w Chrome działa przez serwery Google, a w Edge — Microsoftu.',
    setupStart: '▶ Start',
    vIntro: 'Cześć! Jestem Twoim asystentem. Przy każdym pytaniu przeczytam kilka stanowisk: lewicy, centrum i prawicy. Wybierz to, które jest Ci najbliższe — powiedz jego numer albo nazwę obozu, na przykład: centrum. Możesz też powiedzieć: powtórz, wyjaśnij, pomiń, wstecz albo stop. Jeśli sprawa jest dla Ciebie szczególnie ważna, dodaj: bardzo ważne. Zaczynamy!',
    vIntroShort: 'Wracamy do pytań. Wybieraj stanowisko: powiedz numer albo nazwę obozu.',
    vPosOption: 'Stanowisko {n}, {camp}: {text}.',
    vSayPos: 'Które jest Ci najbliższe?',
    vHintPositions: 'Nie udało mi się zrozumieć. Powiedz numer od jednego do {n} albo nazwę obozu: lewica, centrum lub prawica.',
    vDilemma: 'Opcja A: {a}. Opcja B: {b}. Powiedz na przykład: raczej A, pośrodku albo zdecydowanie B.',
    vOption: 'Opcja {n}: {text}.', vSayNumber: 'Powiedz numer opcji.',
    vSaved: 'Zapisuję: {label}.', vSavedHigh: 'Zapisuję: {label}, jako bardzo ważne.', vSavedLow: 'Zapisuję: {label}, jako mało ważne.',
    vHintLikert: 'Nie udało mi się zrozumieć. Powiedz: zdecydowanie nie, raczej nie, nie mam zdania, raczej tak albo zdecydowanie tak.',
    vHintDilemma: 'Nie udało mi się zrozumieć. Powiedz: zdecydowanie A, raczej A, pośrodku, raczej B albo zdecydowanie B.',
    vHintScenario: 'Nie udało mi się zrozumieć. Powiedz numer opcji, od jednego do {n}.',
    vSayAgain: 'Nie słychać odpowiedzi. Spróbuj jeszcze raz.',
    vNoHear: 'Nic nie słyszę, więc robię pauzę. Kliknij Wznów, gdy zechcesz kontynuować.',
    vSkip: 'Pomijam.', vBack: 'Wracam do poprzedniego pytania.', vStop: 'Dobrze, kończymy. Do usłyszenia!',
    vExplainAsk: 'Jaka jest Twoja odpowiedź?',
    vDone: 'To wszystkie pytania. Twoje najmocniejsze kierunki to: {lean}. Najbliżej Ci do typu: {arch}. Szczegóły znajdziesz na ekranie.',
    vDoneShort: 'To wszystkie pytania. Wyniki znajdziesz na ekranie.',
    vError: 'Problem z {what}: {msg}. Przełączam na przeglądarkę.',
    vNoLangVoice: 'W systemie nie ma polskiego głosu, więc asystent może brzmieć dziwnie. Dodaj polski głos w ustawieniach Windows (Czas i język → Mowa) albo użyj ElevenLabs.',
    micDenied: 'Brak dostępu do mikrofonu. Zezwól na mikrofon w przeglądarce albo wpisuj odpowiedzi.',
    asTitle: 'Asystent', asSpeaking: 'Mówię…', asListening: 'Słucham…', asThinking: 'Myślę…', asPaused: 'Pauza', asTyping: 'Wpisz odpowiedź',
    asHeard: 'Usłyszane:', asPause: '⏸ Pauza', asResume: '▶ Wznów', asRepeat: '🔁 Powtórz', asEnd: '✕ Zakończ',
    asType: 'Albo wpisz odpowiedź…', asSend: 'Wyślij'
  });
  Object.assign(SZ.I18N.en, {
    voiceBtn: '🎙️ Assistant', voiceBtnTxt: ' Assistant',
    startTitle: 'How do you want to fill in the compass?',
    startClassic: 'Classic version', startClassicDesc: 'You read the questions and click the answers.',
    startVoice: 'With the AI assistant', startVoiceDesc: 'The assistant reads questions aloud and you answer through the microphone.',
    startRemember: 'Remember my choice (change it with the 🎙️ Assistant button)',
    setupTitle: 'Assistant settings',
    setupVoice: 'Assistant voice', optBrowserVoice: 'Browser (free)', optEleven: 'ElevenLabs (natural)',
    setupStt: 'Speech recognition', optBrowserStt: 'Browser (Chrome / Edge)', optElevenStt: 'ElevenLabs Scribe', optTypeOnly: 'No microphone — I will type',
    setupAi: 'Understand free-form answers with AI (Claude)',
    setupRate: 'Speech rate',
    setupNoServer: 'ElevenLabs voice and AI need the app started with <b>start.bat</b> (a local server with keys in the <code>.env</code> file). The free browser voice works now.',
    setupWeb: 'In the web version the assistant uses the browser\'s free voice and speech recognition. The natural ElevenLabs voice and AI understanding work in the version run on your computer (start.bat).',
    setupNoEleven: 'ElevenLabs: no <code>ELEVENLABS_API_KEY</code> in the <code>.env</code> file.',
    setupNoClaude: 'AI: unavailable — {hint}.',
    setupNoStt: 'This browser cannot recognise speech. Use Chrome or Edge, or type your answers.',
    setupPrivacy: 'Speech recognition in Chrome goes through Google servers, in Edge through Microsoft.',
    setupStart: '▶ Start',
    vIntro: 'Hi! I am your assistant. For each question I will read a few positions: left, centre and right. Pick the one closest to you — say its number or the camp, for example: centre. You can also say: repeat, explain, skip, back or stop. If an issue is especially important to you, add: very important. Let\'s begin!',
    vIntroShort: 'Back to the questions. Pick a position: say its number or the camp.',
    vPosOption: 'Position {n}, {camp}: {text}.',
    vSayPos: 'Which one is closest to you?',
    vHintPositions: 'Sorry, I did not get that. Say a number from one to {n}, or a camp: left, centre or right.',
    vDilemma: 'Option A: {a}. Option B: {b}. Say for example: rather A, in between, or strongly B.',
    vOption: 'Option {n}: {text}.', vSayNumber: 'Say the option number.',
    vSaved: 'Saved: {label}.', vSavedHigh: 'Saved: {label}, as very important.', vSavedLow: 'Saved: {label}, as not very important.',
    vHintLikert: 'Sorry, I did not get that. Say: strongly disagree, disagree, neutral, agree or strongly agree.',
    vHintDilemma: 'Sorry, I did not get that. Say: strongly A, rather A, in between, rather B or strongly B.',
    vHintScenario: 'Sorry, I did not get that. Say an option number from one to {n}.',
    vSayAgain: 'I cannot hear an answer. Please try again.',
    vNoHear: 'I cannot hear anything, so I am pausing. Click Resume when you want to continue.',
    vSkip: 'Skipping.', vBack: 'Going back to the previous question.', vStop: 'All right, we are done. See you!',
    vExplainAsk: 'What is your answer?',
    vDone: 'That is all the questions. Your strongest directions are: {lean}. You are closest to: {arch}. Details are on the screen.',
    vDoneShort: 'That is all the questions. Your results are on the screen.',
    vError: 'Problem with {what}: {msg}. Switching to the browser.',
    vNoLangVoice: 'Your system has no English voice, so the assistant may sound odd. Add a voice in your system speech settings or use ElevenLabs.',
    micDenied: 'No microphone access. Allow the microphone in your browser, or type your answers.',
    asTitle: 'Assistant', asSpeaking: 'Speaking…', asListening: 'Listening…', asThinking: 'Thinking…', asPaused: 'Paused', asTyping: 'Type your answer',
    asHeard: 'Heard:', asPause: '⏸ Pause', asResume: '▶ Resume', asRepeat: '🔁 Repeat', asEnd: '✕ End',
    asType: 'Or type your answer…', asSend: 'Send'
  });

  // ── Ustawienia ──
  function loadPrefs() { try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; } }
  function savePrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify(V.prefs)); } catch (e) { /* tryb prywatny */ } }

  const V = {
    active: false, paused: false, running: false, token: null, wake: null, holdUntil: 0,
    server: { up: false, elevenlabs: false, claude: false },
    prefs: Object.assign({ tts: 'browser', stt: SR ? 'browser' : 'type', ai: false, rate: 1, remember: null, introHeard: false }, loadPrefs())
  };
  const lang = () => App.state.lang;
  const locale = () => lang() === 'pl' ? 'pl-PL' : 'en-US';

  async function checkServer() {
    if (location.protocol === 'file:') { V.server = { up: false }; return; }
    try {
      const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 1500);
      const r = await fetch('api/status', { headers: { 'X-Kompas': '1' }, signal: ctrl.signal });
      V.server = r.ok ? Object.assign({ up: true }, await r.json()) : { up: false };
    } catch (e) { V.server = { up: false }; }
  }
  const useEleven = () => V.prefs.tts === 'eleven' && V.server.elevenlabs;
  const useElevenStt = () => V.prefs.stt === 'eleven' && V.server.elevenlabs;
  const useAi = () => V.prefs.ai && V.server.claude;

  // ── Przerywanie (pauza, ręczna zmiana pytania) ──
  function newToken() {
    return {
      cancelled: false, fns: [],
      onCancel(f) { if (this.cancelled) f(); else this.fns.push(f); },
      cancel() { if (this.cancelled) return; this.cancelled = true; this.fns.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); }
    };
  }
  const interrupt = () => { if (V.token) V.token.cancel(); };

  // ── Mówienie ──
  let voicesP = null;
  function getVoices() {
    if (!('speechSynthesis' in window)) return Promise.resolve([]);
    if (!voicesP) voicesP = new Promise(res => {
      const v = speechSynthesis.getVoices();
      if (v.length) return res(v);
      speechSynthesis.onvoiceschanged = () => res(speechSynthesis.getVoices());
      setTimeout(() => res(speechSynthesis.getVoices()), 1500);
    });
    return voicesP;
  }
  function pickVoice(voices) {
    const code = lang();
    const own = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(code));
    // Głosy „Natural” / „Online” (Edge) i Google (Chrome) brzmią najlepiej.
    return own.find(v => /natural|online/i.test(v.name)) || own.find(v => /google/i.test(v.name)) || own[0] || null;
  }

  async function browserSpeak(text, tk) {
    if (!('speechSynthesis' in window)) return;
    const voice = pickVoice(await getVoices());
    if (!voice && !V.warnedVoice) { V.warnedVoice = true; notice(t('vNoLangVoice')); }
    // Chrome potrafi uciąć długie wypowiedzi — mówimy zdanie po zdaniu.
    const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
    for (const part of parts) {
      if (tk.cancelled) return;
      await new Promise(resolve => {
        const u = new SpeechSynthesisUtterance(part.trim());
        u.lang = locale(); u.rate = V.prefs.rate || 1;
        if (voice) u.voice = voice;
        const safety = setTimeout(resolve, 4000 + part.length * 120);   // gdy onend nie przyjdzie
        u.onend = u.onerror = () => { clearTimeout(safety); resolve(); };
        tk.onCancel(() => { speechSynthesis.cancel(); clearTimeout(safety); resolve(); });
        speechSynthesis.speak(u);
      });
    }
  }

  async function elevenSpeak(text, tk) {
    const r = await fetch('api/tts', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Kompas': '1' }, body: JSON.stringify({ text })
    });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'HTTP ' + r.status);
    const url = URL.createObjectURL(await r.blob());
    await new Promise(resolve => {
      const a = new Audio(url);
      a.onended = a.onerror = resolve;
      tk.onCancel(() => { a.pause(); resolve(); });
      a.play().catch(resolve);
    });
    URL.revokeObjectURL(url);
  }

  async function speak(text, tk) {
    if (!text || tk.cancelled) return;
    setUi('speaking'); say(text);
    if (useEleven()) {
      try { return await elevenSpeak(text, tk); } catch (e) {
        V.prefs.tts = 'browser'; notice(t('vError', { what: 'ElevenLabs', msg: e.message }));
      }
    }
    await browserSpeak(text, tk);
  }

  // ── Słuchanie ──
  // Zwraca: tekst, '' (cisza), undefined (spróbuj ponownie po cichu), null (przerwano).
  function hear(tk) {
    setUi(V.prefs.stt === 'type' ? 'typing' : 'listening');
    heard('');
    return new Promise(resolve => {
      let done = false, stopRec = () => {};
      const finish = v => {
        if (done) return; done = true;
        V.typed = null; try { stopRec(); } catch (e) { /* ignore */ }
        resolve(v);
      };
      V.typed = text => finish(text);
      tk.onCancel(() => finish(null));
      if (useElevenStt()) stopRec = recordEleven(finish);
      else if (V.prefs.stt === 'browser' && SR) stopRec = recognizeBrowser(finish);
      // tryb „wpisuję” — czekamy tylko na pole tekstowe
    });
  }

  function recognizeBrowser(finish) {
    const rec = new SR();
    rec.lang = locale(); rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    let final = '';
    rec.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript; else interim += r[0].transcript;
      }
      heard(final || interim, !final);
    };
    rec.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') {
        micProblem(); finish(undefined);
      }
    };
    rec.onend = () => finish(final.trim());
    try { rec.start(); } catch (e) { finish(undefined); }
    return () => { try { rec.abort(); } catch (e) { /* ignore */ } };
  }

  // Nagrywanie z prostym wykrywaniem ciszy, potem transkrypcja w ElevenLabs.
  function recordEleven(finish) {
    let stopped = false, stream, recorder, ctx, timer;
    const cleanupMedia = () => {
      clearInterval(timer);
      if (stream) stream.getTracks().forEach(tr2 => tr2.stop());
      if (ctx && ctx.state !== 'closed') ctx.close();
    };
    (async () => {
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { micProblem(); return finish(undefined); }
      if (stopped) return cleanupMedia();
      const chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => chunks.push(e.data);
      ctx = new AudioContext();
      const an = ctx.createAnalyser(); an.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      const started = performance.now();
      let floor = 0, samples = 0, speaking = false, lastVoice = started;
      timer = setInterval(() => {
        an.getFloatTimeDomainData(buf);
        let rms = 0; for (const x of buf) rms += x * x; rms = Math.sqrt(rms / buf.length);
        const now = performance.now();
        level(rms);
        if (now - started < 300) { floor += rms; samples++; return; }   // poziom szumu tła
        const threshold = Math.max(0.02, (floor / Math.max(1, samples)) * 3);
        if (rms > threshold) { speaking = true; lastVoice = now; }
        if ((speaking && now - lastVoice > 1300) || (!speaking && now - started > 8000) || now - started > 20000) {
          clearInterval(timer); recorder.stop();
        }
      }, 50);
      recorder.onstop = async () => {
        cleanupMedia(); level(0);
        if (stopped) return;
        if (!speaking) return finish('');
        setUi('thinking');
        const fd = new FormData();
        fd.append('file', new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }), 'answer.webm');
        fd.append('model_id', V.server.sttModel || 'scribe_v2');
        fd.append('language_code', lang());
        try {
          const r = await fetch('api/stt', { method: 'POST', headers: { 'X-Kompas': '1' }, body: fd });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'HTTP ' + r.status);
          heard(d.text || '');
          finish(d.text || '');
        } catch (e) {
          V.prefs.stt = SR ? 'browser' : 'type';
          notice(t('vError', { what: 'ElevenLabs', msg: e.message }));
          finish(undefined);
        }
      };
      recorder.start();
    })();
    return () => { stopped = true; try { if (recorder && recorder.state !== 'inactive') recorder.stop(); } catch (e) { /* ignore */ } cleanupMedia(); };
  }

  function micProblem() {
    V.prefs.stt = 'type';
    notice(t('micDenied'));
  }

  // ── Rozumienie odpowiedzi (lokalnie, bez AI) ──
  const norm = s => String(s).toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

  const COMMANDS = [
    ['stop', /\b(stop|koniec|zakoncz\w*|przerwij|pauza|przerwa|end|pause|quit|finish)\b/],
    ['repeat', /(powtorz|jeszcze raz|nie uslysz|repeat|again|pardon)/],
    ['explain', /(wyjasn|wytlumacz|co to (znaczy|jest|oznacza)|nie rozumiem|przyklad|explain|what does|what is|example|dont understand)/],
    ['skip', /\b(pomin\w*|nastepne|nastepny|przeskocz|skip|next)\b/],
    ['back', /\b(wstecz|cofnij|poprzedni\w*|wroc\w*|back|previous)\b/]
  ];
  const LIKERT = [
    [-2, /(zdecydowanie (sie )?nie|absolutnie nie|stanowczo nie|kategorycznie nie|w zadnym (wypadku|razie)|zupelnie (sie )?nie|totalnie nie|strongly disagree|definitely not|absolutely not|not at all)/],
    [2, /(zdecydowanie (sie )?(tak|zgadzam)|^absolutnie$|jak najbardziej|calkowicie (sie )?zgadzam|w pelni (sie )?zgadzam|totalnie tak|oczywiscie|strongly agree|definitely|absolutely|totally agree)/],
    [0, /(nie wiem|nie mam zdania|trudno (powiedziec|stwierdzic)|po ?srodku|pomiedzy|obojetn|neutral|no opinion|dont know|not sure|in between)/],
    [-1, /(raczej (sie )?nie|chyba nie|nie bardzo|nie zgadzam|niezbyt|disagree|rather not|probably not|not really)/],
    [1, /(raczej (tak|sie zgadzam|zgadzam)|chyba tak|zgadzam sie|w sumie tak|agree|probably|rather yes|i think so)/]
  ];
  const OPT = '(opcj\\w* |wersj\\w* )?';
  const A = `${OPT}(a|pierwsz\\w*|first)\\b`, B = `${OPT}(b|be|bee|drug\\w*|second)\\b`;
  const DILEMMA = [
    [-2, new RegExp(`(zdecydowanie|stanowczo|definitely|strongly) ${A}`)],
    [2, new RegExp(`(zdecydowanie|stanowczo|definitely|strongly) ${B}`)],
    [0, /(po ?srodku|pomiedzy|nie wiem|nie mam zdania|obie|obydwie|zadna|in between|both|neither|neutral|dont know)/],
    [-1, new RegExp(`(raczej|chyba|rather|more) ${A}`)],
    [1, new RegExp(`(raczej|chyba|rather|more) ${B}`)],
    [-1, new RegExp(`^${A}$`)], [1, new RegExp(`^${B}$`)],
    [-1, /\b(opcj\w*|wersj\w*) a\b/], [1, /\b(opcj\w*|wersj\w*) (b|be)\b/]
  ];
  const NUMBERS = [
    [1, /\b(1|jeden|jedynk\w*|pierwsz\w*|one|first)\b/], [2, /\b(2|dwa|dwojk\w*|drug\w*|two|second)\b/],
    [3, /\b(3|trzy|trojk\w*|trzeci\w*|three|third)\b/], [4, /\b(4|cztery|czwork\w*|czwart\w*|four|fourth)\b/],
    [5, /\b(5|piec|piatk\w*|piat\w*|five|fifth)\b/]
  ];
  const firstNumber = s => { const m = NUMBERS.find(([, re]) => re.test(s)); return m ? m[0] : null; };
  // Wzorce muszą łapać całe słowa — inaczej „mnie bardzo” pasuje do „nie bardzo”.
  const wordBound = list => list.map(([v, re]) => [v, new RegExp(`(?:^|\\b)(?:${re.source})`)]);
  COMMANDS.splice(0, COMMANDS.length, ...wordBound(COMMANDS));
  LIKERT.splice(0, LIKERT.length, ...wordBound(LIKERT));
  DILEMMA.splice(0, DILEMMA.length, ...wordBound(DILEMMA));

  function parseLocal(text, q) {
    const s = norm(text);
    if (!s) return null;
    const cmd = COMMANDS.find(([, re]) => re.test(s));
    if (cmd) return { action: cmd[0] };
    let importance = 1;
    if (/(malo wazn|niezbyt wazn|niewazn|nieistotn|not important|not very important)/.test(s)) importance = 0.5;
    else if (/(bardzo wazn|szczegolnie wazn|kluczow|very important|really important|matters a lot)/.test(s)) importance = 2;
    const found = (list) => { const m = list.find(([, re]) => re.test(s)); return m ? m[0] : null; };
    let value = null;
    if (q.type === 'scenario' || q.type === 'positions') {
      const n = firstNumber(s);
      if (q.type === 'positions') value = campFromSpeech(s, q);
      if (value == null && n && n <= q.options.length) value = n - 1;
      if (value == null) {
        // Dopasowanie po słowach z treści opcji (np. „park i rowery”).
        const stems = w => norm(w).split(' ').filter(x => x.length > 3).map(x => x.slice(0, 5));
        const said = new Set(stems(s));
        const scores = q.options.map(o => stems(tr(o.text)).filter(x => said.has(x)).length);
        const best = Math.max(...scores);
        if (best > 0 && scores.filter(x => x === best).length === 1) value = scores.indexOf(best);
      }
    } else if (q.type === 'dilemma') {
      value = found(DILEMMA);
    } else {
      value = found(LIKERT);
      if (value == null) { const n = firstNumber(s); if (n) value = VALUES[n - 1]; }
      if (value == null && /\b(tak|yes|yeah|jasne|pewnie|sure)\b/.test(s)) value = 1;
      if (value == null && /\b(nie|no|nope)\b/.test(s)) value = -1;
    }
    return value == null ? null : { action: 'answer', value, importance };
  }

  // „Lewicowe”, „to centrowe”, „prawica wolnorynkowa” → indeks stanowiska. Samo „prawica” przy dwóch prawicach jest niejasne.
  const CAMP_WORDS = [
    ['right_free', /(wolnoryn|wolny rynek|libertar|free market|free-market)/],
    ['right_cons', /(konserwat|conservative)/],
    ['left', /\b(lew\w*|left\w*)\b/],
    ['center', /\b(centr\w*|po ?srodku|srodk\w*|cent(er|re)\w*|middle)\b/],
    ['right', /\b(praw\w*|right\w*)\b/]
  ];
  function campFromSpeech(s, q) {
    if (firstNumber(s)) return null;   // „trzecie” ma pierwszeństwo przed nazwą obozu
    for (const [camp, re] of CAMP_WORDS) {
      if (!re.test(s)) continue;
      if (camp === 'right') {
        const rights = q.options.map((o, i) => [o.camp, i]).filter(([c]) => c.startsWith('right'));
        return rights.length === 1 ? rights[0][1] : null;
      }
      const i = q.options.findIndex(o => o.camp === camp);
      if (i >= 0) return i;
    }
    return null;
  }

  function optionsFor(q) {
    if (q.type === 'positions') return q.options.map((o, i) => ({ value: i, label: App.answerLabel(q, i) }));
    if (q.type === 'scenario') return q.options.map((o, i) => ({ value: i, label: tr(o.text) }));
    return VALUES.map(v => ({ value: v, label: App.answerLabel(q, v) }));
  }

  async function interpretAI(text, q, tk) {
    setUi('thinking');
    try {
      const r = await fetch('api/interpret', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Kompas': '1' },
        body: JSON.stringify({
          lang: lang(), question: tr(q.text), type: q.type || 'likert',
          optionA: q.a ? tr(q.a) : undefined, optionB: q.b ? tr(q.b) : undefined,
          options: optionsFor(q), utterance: text
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'HTTP ' + r.status);
      if (tk.cancelled) return null;
      if (d.action === 'answer' && !optionsFor(q).some(o => o.value === d.value)) return { action: 'unclear', reply: d.reply };
      return d;
    } catch (e) {
      V.prefs.ai = false; notice(t('vError', { what: 'AI', msg: e.message }));
      return null;
    }
  }

  // ── Co asystent mówi ──
  function questionSpeech(q) {
    const text = tr(q.text);
    if (q.type === 'dilemma') return `${text} ${t('vDilemma', { a: tr(q.a), b: tr(q.b) })}`;
    if (q.type === 'positions') {
      return `${text} ${q.options.map((o, i) => t('vPosOption', { n: i + 1, camp: tr(SZ.CAMPS[o.camp].name), text: tr(o.text) })).join(' ')} ${t('vSayPos')}`;
    }
    if (q.type === 'scenario') return `${text} ${q.options.map((o, i) => t('vOption', { n: i + 1, text: tr(o.text) })).join(' ')} ${t('vSayNumber')}`;
    return text;
  }
  // „Wyjaśnij” przy stanowiskach: kontekst + dlaczego każdy obóz tak uważa.
  const explainSpeech = q => q.type === 'positions'
    ? [tr(q.what), ...q.options.map(o => `${tr(SZ.CAMPS[o.camp].name)}: ${tr(o.why)}`)].join(' ')
    : [tr(q.what), tr(q.example)].filter(Boolean).join(' ');
  function hintFor(q) {
    if (q.type === 'positions') return t('vHintPositions', { n: q.options.length });
    if (q.type === 'scenario') return t('vHintScenario', { n: q.options.length });
    if (q.type === 'dilemma') return t('vHintDilemma');
    return t('vHintLikert');
  }

  // ── Główna pętla ──
  async function loop() {
    if (V.running) return;
    V.running = true;
    try {
      while (V.active) {
        if (V.paused) { await new Promise(r => { V.wake = r; }); continue; }
        const wait = V.holdUntil - Date.now();
        if (wait > 0) await sleep(wait);
        const tk = V.token = newToken();
        await step(tk);
      }
    } finally { V.running = false; }
  }

  async function step(tk) {
    if (App.isDone()) {
      const res = App.resultText();
      await speak(res.lean.length ? t('vDone', { lean: res.lean.join(', '), arch: res.archetype }) : t('vDoneShort'), tk);
      if (!tk.cancelled) stop();
      return;
    }
    if (!V.introDone) {
      await speak(V.prefs.introHeard ? t('vIntroShort') : t('vIntro'), tk);
      if (tk.cancelled) return;
      V.introDone = true; V.prefs.introHeard = true; savePrefs();
    }
    const q = App.curQ();
    await speak(questionSpeech(q), tk);
    let misses = 0;
    while (!tk.cancelled) {
      const said = await hear(tk);
      if (said === null || tk.cancelled) return;
      if (said === undefined) continue;          // np. brak mikrofonu → teraz czekamy na wpisanie
      if (!said.trim()) {
        if (++misses >= 3) { await speak(t('vNoHear'), tk); pause(); return; }
        await speak(t('vSayAgain'), tk);
        continue;
      }
      heard(said);
      let r = parseLocal(said, q);
      if (!r && useAi()) r = await interpretAI(said, q, tk);
      if (tk.cancelled) return;
      if (!r || r.action === 'unclear') {
        if (++misses >= 4) { pause(); return; }
        await speak((r && r.reply) || hintFor(q), tk);
        continue;
      }
      if (r.action === 'answer') {
        const imp = r.importance === 2 || r.importance === 0.5 ? r.importance : 1;
        if (imp !== 1) App.setImportance(imp);
        const label = App.answerLabel(q, r.value);
        App.answer(r.value);
        await speak(t(imp === 2 ? 'vSavedHigh' : imp === 0.5 ? 'vSavedLow' : 'vSaved', { label }), tk);
        return;
      }
      if (r.action === 'skip') { await speak(t('vSkip'), tk); App.next(); return; }
      if (r.action === 'back') { await speak(t('vBack'), tk); App.prev(); return; }
      if (r.action === 'repeat') return;          // pętla przeczyta pytanie jeszcze raz
      if (r.action === 'stop') { await speak(t('vStop'), tk); stop(); return; }
      if (r.action === 'explain') {
        await speak(explainSpeech(q), tk);
        await speak(t('vExplainAsk'), tk);
      }
    }
  }

  function start() {
    V.active = true; V.paused = false; V.introDone = false;
    showPanel(true);
    loop();
  }
  function stop() {
    V.active = false; V.paused = false;
    interrupt();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (V.wake) { V.wake(); V.wake = null; }
    showPanel(false);
  }
  function pause() {
    V.paused = true; interrupt(); setUi('paused');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }
  function resume() {
    V.paused = false;
    if (V.wake) { V.wake(); V.wake = null; }
    if (!V.running) loop();
  }

  // Użytkownik kliknął odpowiedź lub zmienił pytanie ręcznie — asystent przechodzi do bieżącego pytania.
  window.addEventListener('kompas:change', e => {
    if (!V.active || V.paused || e.detail.source === 'voice') return;
    V.holdUntil = Date.now() + 450;
    interrupt();
  });

  // ── Panel asystenta ──
  function buildPanel() {
    const el = document.createElement('div');
    el.className = 'assistant'; el.id = 'assistant'; el.hidden = true;
    el.innerHTML = `
      <div class="as-head">
        <div class="orb" id="asOrb"><span></span></div>
        <div class="as-title"><b data-i18n="asTitle"></b><div class="as-status" id="asStatus"></div></div>
        <button class="ghost small" id="asEnd" data-i18n="asEnd"></button>
      </div>
      <div class="as-said" id="asSaid"></div>
      <div class="as-heard" id="asHeard"></div>
      <div class="as-level"><div id="asLevel"></div></div>
      <form class="as-type" id="asForm"><input id="asInput" autocomplete="off"><button class="primary" data-i18n="asSend"></button></form>
      <div class="as-btns">
        <button class="ghost" id="asPause"></button>
        <button class="ghost" id="asRepeat" data-i18n="asRepeat"></button>
      </div>
      <div class="as-notice" id="asNotice" hidden></div>`;
    document.body.appendChild(el);
    $('asEnd').onclick = stop;
    $('asRepeat').onclick = () => { if (V.paused) resume(); else interrupt(); };
    $('asPause').onclick = () => (V.paused ? resume() : pause());
    $('asForm').onsubmit = e => {
      e.preventDefault();
      const v = $('asInput').value.trim(); if (!v) return;
      $('asInput').value = '';
      if (V.paused) resume();
      if (V.typed) V.typed(v);
    };
    // Przycisk w górnym pasku
    const btn = document.createElement('button');
    btn.className = 'ghost'; btn.id = 'btnVoice';
    btn.innerHTML = '🎙️<span class="btn-txt" data-i18n="voiceBtnTxt"></span>';   // na telefonie sama ikona
    btn.onclick = () => (V.active ? stop() : setup());
    document.querySelector('.actions').prepend(btn);
    refreshLabels();
  }
  function refreshLabels() {
    document.querySelectorAll('#assistant [data-i18n], #btnVoice [data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
    if ($('asInput')) $('asInput').placeholder = t('asType');
    if ($('asPause')) $('asPause').textContent = V.paused ? t('asResume') : t('asPause');
  }
  function showPanel(on) {
    $('assistant').hidden = !on;
    document.body.classList.toggle('voice-on', on);
    $('asNotice').hidden = true;
    refreshLabels();
  }
  function setUi(st) {
    const orb = $('asOrb'); if (!orb) return;
    orb.className = 'orb ' + st;
    $('asStatus').textContent = { speaking: t('asSpeaking'), listening: t('asListening'), thinking: t('asThinking'), paused: t('asPaused'), typing: t('asTyping') }[st] || '';
    refreshLabels();
  }
  const say = text => { $('asSaid').textContent = text; };
  const heard = (text, interim) => {
    $('asHeard').innerHTML = text ? `<span>${t('asHeard')}</span> ${App.esc(text)}` : '';
    $('asHeard').classList.toggle('interim', !!interim);
  };
  const level = v => { $('asLevel').style.width = Math.min(100, v * 600) + '%'; };
  function notice(html) { const n = $('asNotice'); n.innerHTML = html; n.hidden = false; }

  // ── Ekran startowy i ustawienia ──
  async function showStart() {
    const choice = await App.dialog({
      html: `<h3>${t('startTitle')}</h3>
        <div class="start-cards">
          <button class="start-card" data-i="1"><span class="big">📝</span><b>${t('startClassic')}</b><span>${t('startClassicDesc')}</span></button>
          <button class="start-card" data-i="2"><span class="big">🎙️</span><b>${t('startVoice')}</b><span>${t('startVoiceDesc')}</span></button>
        </div>
        <label class="remember"><input type="checkbox" id="startRemember"> ${t('startRemember')}</label>`,
      buttons: [
        { label: t('guide'), value: 'guide', cls: 'ghost' },
        { label: '', value: 'classic', cls: 'vhidden' },
        { label: '', value: 'voice', cls: 'vhidden' }
      ]
    });
    const remember = $('startRemember') && $('startRemember').checked;
    if (choice === 'guide') { await App.showGuide(); return showStart(); }
    if (remember && choice) { V.prefs.remember = choice; savePrefs(); }
    if (choice === 'voice') return setup();
    maybeGuide();
  }

  function maybeGuide() {
    const st = App.state;
    if (!st.seenGuide && !Object.keys(st.answers).length) {
      st.seenGuide = true; App.save();
      App.showGuide();
    }
  }

  async function setup() {
    await checkServer();
    const s = V.server, p = V.prefs;
    if (!s.elevenlabs) { if (p.tts === 'eleven') p.tts = 'browser'; if (p.stt === 'eleven') p.stt = SR ? 'browser' : 'type'; }
    if (!SR && p.stt === 'browser') p.stt = 'type';
    const notes = [];
    // Na stronie w internecie (np. GitHub Pages) nie ma lokalnego serwera z kluczami — to normalne.
    const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (!s.up) notes.push(t(local ? 'setupNoServer' : 'setupWeb'));
    else {
      if (!s.elevenlabs) notes.push(t('setupNoEleven'));
      if (!s.claude) notes.push(t('setupNoClaude', { hint: App.esc(s.claudeHint || '') }));
    }
    if (!SR) notes.push(t('setupNoStt'));
    const radio = (name, value, label, enabled) =>
      `<label class="${enabled ? '' : 'off'}"><input type="radio" name="${name}" value="${value}" ${p[name] === value ? 'checked' : ''} ${enabled ? '' : 'disabled'}> ${label}</label>`;
    const ok = await App.dialog({
      html: `<h3>${t('setupTitle')}</h3>
        ${notes.length ? `<div class="setup-notes">${notes.map(n => `<p>ℹ️ ${n}</p>`).join('')}</div>` : ''}
        <fieldset class="setup"><legend>${t('setupVoice')}</legend>
          ${radio('tts', 'browser', t('optBrowserVoice'), 'speechSynthesis' in window)}
          ${radio('tts', 'eleven', t('optEleven'), s.elevenlabs)}
        </fieldset>
        <fieldset class="setup"><legend>${t('setupStt')}</legend>
          ${radio('stt', 'browser', t('optBrowserStt'), !!SR)}
          ${radio('stt', 'eleven', t('optElevenStt'), s.elevenlabs && !!navigator.mediaDevices)}
          ${radio('stt', 'type', t('optTypeOnly'), true)}
        </fieldset>
        <label class="setup-check ${s.claude ? '' : 'off'}"><input type="checkbox" id="vAi" ${p.ai && s.claude ? 'checked' : ''} ${s.claude ? '' : 'disabled'}> ${t('setupAi')}</label>
        <label class="setup-rate">${t('setupRate')} <input type="range" id="vRate" min="0.7" max="1.4" step="0.1" value="${p.rate || 1}"></label>
        ${SR ? `<p class="hint">${t('setupPrivacy')}</p>` : ''}`,
      buttons: [{ label: t('cancel'), value: false, cls: 'ghost' }, { label: t('setupStart'), value: true, cls: 'primary' }]
    });
    if (!ok) return;
    const pick = name => { const el = document.querySelector(`#modalBody input[name="${name}"]:checked`); return el ? el.value : p[name]; };
    p.tts = pick('tts'); p.stt = pick('stt');
    p.ai = !!($('vAi') && $('vAi').checked);
    p.rate = Number($('vRate').value) || 1;
    savePrefs();
    start();
  }

  function boot() {
    buildPanel();
    // Zmiana języka w apce odświeża też napisy asystenta.
    document.getElementById('lang').addEventListener('click', () => setTimeout(refreshLabels, 0));
    if (V.prefs.remember === 'voice') return setup();
    if (V.prefs.remember === 'classic') return maybeGuide();
    showStart();
  }

  // parseLocal wystawione do testów w konsoli
  SZ.Voice = { boot, setup, start, stop, pause, resume, parseLocal };
})();
