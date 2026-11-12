// Ćwiczenia, część 2 - interfejs: 5 razy dlaczego, Ślepa próba, Lustro zasad, Zasłona niewiedzy, Kalibracja.
// Moduły są podpinane do zakładki „Ćwiczenia” (js/exercises-ui.js) przez SZ.EX2[typ] = { view, click, done, total }.
window.SZ = window.SZ || {};

(function () {
  const App = SZ.App, { CAMPS, CAMP_GROUPS, VALUES, WHY_FIRST, WHY_LADDER, WHY_QUESTIONS, BLIND, MIRROR, VEIL_RULES, VEIL_PEOPLE, CALIB } = SZ;
  const Q = Object.fromEntries(SZ.QUESTIONS.map(q => [q.id, q]));
  const tr = App.tr, esc = App.esc;
  const TXT = {
    pl: {
      tWhy: '❓ 5 razy dlaczego', dWhy: 'Dopytuj samego siebie „dlaczego?”, aż dojdziesz do wartości, na której opierasz poglądy.',
      tBlind: '🙈 Ślepa próba', dBlind: 'Oceń stanowiska bez podpisu, a potem z podpisem obozu. Czy etykieta zmienia Twoją ocenę?',
      tMirror: '🪞 Lustro zasad', dMirror: 'Pary podobnych sytuacji, które różnią się tylko tym, kogo dotyczą. Czy stosujesz te same zasady?',
      tVeil: '🎲 Zasłona niewiedzy', dVeil: 'Ustal zasady dla społeczeństwa, a potem wylosuj, kim w nim jesteś.',
      tCalib: '🎯 Kalibracja', dCalib: 'Odpowiedz na pytania o fakty i zaznacz, jak bardzo jesteś pewny. Czy pewność idzie w parze z wiedzą?',
      back: '← Lista pytań', again: '🔁 Jeszcze raz', start: 'Zaczynamy', next: 'Dalej →', todo: 'Do zrobienia',
      yourPos: 'Twoje stanowisko', pickPos: 'Najpierw wybierz swoje stanowisko:',
      // dlaczego
      whyIntro: 'Wybierz pytanie z testu. Przy każdym kroku odpowiedz sobie „dlaczego?”. Możesz zejść do 5 poziomów albo zatrzymać się, gdy dojdziesz do czegoś, co jest dla Ciebie ważne samo w sobie.',
      whyFirst: 'Dlaczego tak uważasz?', whyStop: '🛑 To dla mnie wartość sama w sobie', whyStep: 'Krok {i} z 5',
      whyRoot: 'U podstaw tej odpowiedzi leży: {v}', whySummary: 'Twoje wartości u podstaw', whySumHint: 'Im częściej dochodzisz do tej samej wartości, tym mocniej kształtuje ona Twoje poglądy.',
      // ślepa
      blindIntro: 'Najpierw ocenisz 8 stanowisk bez informacji, czyje są. Potem zobaczysz je jeszcze raz - tym razem z podpisem obozu. Na koniec sprawdzimy, czy podpis wpłynął na Twoją ocenę. (Uwaga: część podpisów może być nieprawdziwa - wyjaśnimy to na końcu.)',
      blindR1: 'Runda 1: bez podpisów', blindR2: 'Runda 2: z podpisami', blindMid: 'Teraz te same stanowiska, ale z podpisem obozu. Oceniaj tak, jak naprawdę myślisz.',
      blindQ: 'Na ile się zgadzasz?', r1: 'Zdecydowanie nie', r2: 'Raczej nie', r3: 'Trudno powiedzieć', r4: 'Raczej tak', r5: 'Zdecydowanie tak',
      blindRes: 'Wpływ etykiety: {d} pkt', blindNone: 'Oceniasz treść, a nie etykiety - podpis obozu prawie nie zmieniał Twoich ocen.',
      blindPos: 'Podpis wpływał na ocenę: stanowiska podpisane jako Twój obóz oceniałeś lepiej, a obcy - gorzej.',
      blindNeg: 'Ciekawostka: stanowiska podpisane jako Twój obóz oceniałeś surowiej. Może jesteś krytyczny wobec „swoich”?',
      blindFake: '🎭 podpis był fałszywy - naprawdę to stanowisko: {c}', blindTrue: 'prawdziwy podpis', blindMy: 'Twój obóz wg testu: {g}',
      blindMemo: 'Pamiętaj, że w drugiej rundzie mogłeś pamiętać swoje oceny - to ćwiczenie pokazuje tendencję, a nie wyrok.',
      // lustro
      mirrorIntro: 'Zobaczysz 12 krótkich sytuacji. Odpowiadaj szybko, tak jak czujesz. Na końcu pokażemy, które z nich były swoimi lustrzanymi odbiciami.',
      yes: 'TAK', no: 'NIE', mirrorCard: 'Sytuacja {i} z {n}',
      mirrorRes: 'Te same zasady w {k} z {n} par', mirrorAll: 'Bardzo spójnie - te same zasady stosujesz niezależnie od tego, kogo sprawa dotyczy.',
      mirrorSome: 'W części par odpowiedziałeś różnie. Zastanów się: czy umiesz wskazać różnicę, która naprawdę ma znaczenie - czy decydowała sympatia?',
      mirrorDiff: '🔀 Różne odpowiedzi', mirrorSame: '✓ Te same zasady',
      // zasłona
      veilIntro: 'Wyobraź sobie, że projektujesz zasady dla nowego kraju, ale nie wiesz, kim w nim będziesz. Ustal zasady, a potem wylosuj swoje życie.',
      veilDraw: '🎲 Losuj, kim jesteś', veilYou: 'Wylosowałeś:', veilLife: 'Twoje życie w tym świecie', veilGood: 'dobre', veilMid: 'takie sobie', veilBad: 'trudne',
      veilWorst: 'Najgorzej w Twoim świecie ma: {p}', veilBest: 'Najlepiej: {p}', veilRedraw: '🎲 Losuj jeszcze raz', veilRules: '✏️ Zmień zasady',
      veilNote: 'To duże uproszczenie: nie liczymy np. tego, jak podatki i przepisy wpływają na wzrost gospodarczy i liczbę miejsc pracy.',
      veilPick: 'Wybierz zasady we wszystkich {n} dziedzinach.',
      // kalibracja
      calibIntro: 'Odpowiedz na 10 pytań o fakty z polskiej polityki i gospodarki. Przy każdej odpowiedzi zaznacz, na ile jesteś pewny. Nie chodzi o to, ile wiesz, tylko czy Twoja pewność pasuje do Twojej wiedzy.',
      calibQ: 'Pytanie {i} z {n}', calibConf: 'Na ile jesteś pewny?', calibRes: 'Trafione: {k} z {n} · średnia pewność: {c}%',
      calibOver: 'Jesteś zbyt pewny siebie: Twoja pewność była o {d} pkt wyższa niż trafność.', calibUnder: 'Jesteś zbyt ostrożny: wiesz więcej, niż Ci się wydaje (trafność o {d} pkt wyższa niż pewność).',
      calibGood: 'Świetna kalibracja - Twoja pewność dobrze pasuje do tego, ile wiesz.',
      calibBucket: 'Gdy byłeś pewny na {b}: trafiłeś {p}% ({n} odp.)', calibCorrect: 'Prawidłowa odpowiedź: {a}', calibGuess: '(zgaduję)'
    },
    en: {
      tWhy: '❓ Five whys', dWhy: 'Keep asking yourself "why?" until you reach the value your views rest on.',
      tBlind: '🙈 Blind test', dBlind: 'Rate positions without labels, then with camp labels. Does the label change your rating?',
      tMirror: '🪞 Mirror of principles', dMirror: 'Pairs of similar situations that differ only in who is involved. Do you apply the same rules?',
      tVeil: '🎲 Veil of ignorance', dVeil: 'Set the rules for a society, then draw who you are in it.',
      tCalib: '🎯 Calibration', dCalib: 'Answer factual questions and mark how sure you are. Does your confidence match your knowledge?',
      back: '← Question list', again: '🔁 Again', start: 'Let\'s start', next: 'Next →', todo: 'To do',
      yourPos: 'Your position', pickPos: 'First choose your position:',
      whyIntro: 'Choose a question from the test. At each step ask yourself "why?". You can go down up to 5 levels or stop when you reach something that matters to you in itself.',
      whyFirst: 'Why do you think so?', whyStop: '🛑 This is a value in itself for me', whyStep: 'Step {i} of 5',
      whyRoot: 'At the root of this answer lies: {v}', whySummary: 'Your root values', whySumHint: 'The more often you reach the same value, the more it shapes your views.',
      blindIntro: 'First you will rate 8 positions without knowing whose they are. Then you will see them again - this time with a camp label. Finally we check whether the label affected your rating. (Note: some labels may be false - we explain at the end.)',
      blindR1: 'Round 1: no labels', blindR2: 'Round 2: with labels', blindMid: 'Now the same positions, but with a camp label. Rate them as you really think.',
      blindQ: 'How much do you agree?', r1: 'Strongly no', r2: 'Rather no', r3: 'Hard to say', r4: 'Rather yes', r5: 'Strongly yes',
      blindRes: 'Label effect: {d} pts', blindNone: 'You judge content, not labels - the camp label barely changed your ratings.',
      blindPos: 'The label affected your rating: positions labelled as your camp got better ratings, others worse.',
      blindNeg: 'Interesting: you rated positions labelled as your camp more harshly. Maybe you are critical of "your own"?',
      blindFake: '🎭 the label was false - this position is really: {c}', blindTrue: 'true label', blindMy: 'Your camp according to the test: {g}',
      blindMemo: 'In round two you may have remembered your ratings - this exercise shows a tendency, not a verdict.',
      mirrorIntro: 'You will see 12 short situations. Answer quickly, as you feel. At the end we show which ones were mirror images of each other.',
      yes: 'YES', no: 'NO', mirrorCard: 'Situation {i} of {n}',
      mirrorRes: 'Same principles in {k} of {n} pairs', mirrorAll: 'Very consistent - you apply the same rules whoever is involved.',
      mirrorSome: 'In some pairs you answered differently. Think: can you point to a difference that really matters - or did sympathy decide?',
      mirrorDiff: '🔀 Different answers', mirrorSame: '✓ Same principles',
      veilIntro: 'Imagine you are designing the rules of a new country, but you do not know who you will be in it. Set the rules, then draw your life.',
      veilDraw: '🎲 Draw who you are', veilYou: 'You drew:', veilLife: 'Your life in this world', veilGood: 'good', veilMid: 'so-so', veilBad: 'hard',
      veilWorst: 'Worst off in your world: {p}', veilBest: 'Best off: {p}', veilRedraw: '🎲 Draw again', veilRules: '✏️ Change the rules',
      veilNote: 'This is a big simplification: it ignores, for example, how taxes and rules affect economic growth and jobs.',
      veilPick: 'Choose rules in all {n} areas.',
      calibIntro: 'Answer 10 questions about facts from Polish politics and the economy. For each answer, mark how sure you are. It is not about how much you know, but whether your confidence matches your knowledge.',
      calibQ: 'Question {i} of {n}', calibConf: 'How sure are you?', calibRes: 'Correct: {k} of {n} · average confidence: {c}%',
      calibOver: 'You are overconfident: your confidence was {d} points higher than your accuracy.', calibUnder: 'You are too cautious: you know more than you think (accuracy {d} points above confidence).',
      calibGood: 'Great calibration - your confidence matches what you know.',
      calibBucket: 'When you were {b} sure: {p}% correct ({n} answers)', calibCorrect: 'Correct answer: {a}', calibGuess: '(guessing)'
    }
  };
  const tx = (k, v = {}) => ((TXT[App.state.lang] || TXT.pl)[k] || k).replace(/\{(\w+)\}/g, (_, x) => v[x] != null ? v[x] : '');
  const S = () => { const st = App.state; st.ex = st.ex || {}; return st.ex; };
  const campOf = qid => { const q = Q[qid], a = App.state.answers[qid]; return q && q.options[a] ? q.options[a].camp : null; };
  const campName = c => tr((CAMPS[c] || CAMP_GROUPS.find(g => g.id === c) || {}).name);
  const backBtn = act => `<button class="ghost ex-back" data-act="${act}">${tx('back')}</button>`;
  const vName = v => `${VALUES[v].icon} ${tr(VALUES[v].name)}`;
  const optText = o => typeof o === 'string' ? o : tr(o);

  // ═══ 1. 5 razy dlaczego ═══
  const whyState = q => { const s = S(); s.why = s.why || {}; return s.why[q] = s.why[q] || { path: [], done: false }; };
  const whyStepText = (path, k) => k === 0 ? tr(WHY_FIRST[path[0].i][1]) : tr(WHY_LADDER[path[k - 1].v].opts[path[k].i].text);
  const why = {
    total: WHY_QUESTIONS.length,
    done: () => WHY_QUESTIONS.filter(q => whyState(q).done).length,
    view() {
      const s = S(), qid = s.whyCur;
      if (!qid) {
        const done = WHY_QUESTIONS.map(q => whyState(q)).filter(w => w.done);
        const counts = {};
        done.forEach(w => w.path.forEach((p, k) => { counts[p.v] = (counts[p.v] || 0) + (k === w.path.length - 1 ? 2 : 1); }));
        const max = Math.max(1, ...Object.values(counts));
        const summary = done.length ? `<div class="ex-score"><b>${tx('whySummary')}</b><div class="why-bars">${Object.entries(counts).sort((a, b) => b[1] - a[1])
          .map(([v, n]) => `<div><span>${vName(v)}</span><i style="width:${n / max * 100}%"></i></div>`).join('')}</div><span class="hint">${tx('whySumHint')}</span></div>` : '';
        return `<p class="ex-intro">${tx('whyIntro')}</p>${summary}<div class="ex-list">${WHY_QUESTIONS.map(q => {
          const w = whyState(q), last = w.done && w.path[w.path.length - 1];
          return `<button class="ex-card ${w.done ? 'done' : ''}" data-why="${q}"><span class="ex-q">${esc(tr(Q[q].text))}</span>
            <span class="ex-status">${last ? '✓ ' + vName(last.v) : tx('todo')}</span></button>`;
        }).join('')}</div>`;
      }
      const q = Q[qid], camp = campOf(qid), w = whyState(qid);
      let html = backBtn('whyback') + `<h3 class="ex-title">${esc(tr(q.text))}</h3>`;
      if (!camp) return html + `<p class="ex-sub">${tx('pickPos')}</p><div class="ex-pos-pick">${q.options.map((o, i) => `<button class="pos-card" data-whypos="${i}" style="--camp:${CAMPS[o.camp].color}">
        <span class="camp-tag">${campName(o.camp)}</span><span class="pos-text">${esc(tr(o.text))}</span></button>`).join('')}</div>`;
      const o = q.options[App.state.answers[qid]];
      // Łańcuch „dlaczego”
      const chain = `<div class="why-chain"><div class="why-node pos" style="--camp:${CAMPS[camp].color}"><b>${campName(camp)}</b> ${esc(tr(o.text))}</div>
        ${w.path.map((p, k) => `<div class="why-arrow">↓ ${k === 0 ? tx('whyFirst') : esc(tr(WHY_LADDER[w.path[k - 1].v].q))}</div>
          <div class="why-node ${w.done && k === w.path.length - 1 ? 'root' : ''}">„${esc(whyStepText(w.path, k))}”<span>${vName(p.v)}</span></div>`).join('')}</div>`;
      if (w.done) {
        const root = w.path[w.path.length - 1].v;
        return html + chain + `<div class="ex-score"><b>${tx('whyRoot', { v: vName(root) })}</b></div><button class="ghost" data-act="whyagain">${tx('again')}</button>`;
      }
      const step = w.path.length;
      let opts;
      if (step === 0) opts = WHY_FIRST.map(([v, t], i) => `<button class="why-opt" data-whyopt="${i}">${esc(tr(t))}</button>`).join('');
      else {
        const node = WHY_LADDER[w.path[step - 1].v];
        opts = node.opts.map((op, i) => `<button class="why-opt" data-whyopt="${i}">${esc(tr(op.text))}</button>`).join('') +
          `<button class="why-opt stop" data-act="whystop">${tx('whyStop')}</button>`;
      }
      const qText = step === 0 ? tx('whyFirst') : tr(WHY_LADDER[w.path[step - 1].v].q);
      return html + chain + `<div class="why-ask"><span class="why-step">${tx('whyStep', { i: step + 1 })}</span><h4>${esc(qText)}</h4><div class="why-opts">${opts}</div></div>`;
    },
    click(el, s) {
      const qid = s.whyCur, w = qid && whyState(qid);
      if (el('[data-why]')) { s.whyCur = el('[data-why]').dataset.why; return 'scroll'; }
      if (el('[data-whypos]')) { App.setAnswer(qid, Number(el('[data-whypos]').dataset.whypos)); return true; }
      const act = el('[data-act]') && el('[data-act]').dataset.act;
      if (act === 'whyback') { s.whyCur = null; return 'scroll'; }
      if (act === 'whyagain') { s.why[qid] = { path: [], done: false }; return true; }
      if (act === 'whystop') { w.done = true; return true; }
      if (el('[data-whyopt]')) {
        const i = Number(el('[data-whyopt]').dataset.whyopt), step = w.path.length;
        const v = step === 0 ? WHY_FIRST[i][0] : WHY_LADDER[w.path[step - 1].v].opts[i].to;
        w.path.push({ v, i });
        if (w.path.length >= 5) w.done = true;
        return true;
      }
      return false;
    }
  };

  // ═══ 2. Ślepa próba ═══
  const blindItems = () => BLIND.map(([qid, i, fake], k) => {
    const o = Q[qid].options[i], g = CAMPS[o.camp].group;
    const shown = fake ? (g === 'left' ? 'right' : g === 'right' ? 'left' : g) : g;
    return { k, qid, o, g, shown, fake: fake && shown !== g };
  });
  const myGroup = () => {
    const c = { left: 0, center: 0, right: 0 };
    Object.keys(App.state.answers).forEach(id => { const q = Q[id], o = q && q.options && q.options[App.state.answers[id]]; if (o && CAMPS[o.camp]) c[CAMPS[o.camp].group]++; });
    return Object.entries(c).sort((a, b) => b[1] - a[1])[0][1] ? Object.entries(c).sort((a, b) => b[1] - a[1])[0][0] : 'center';
  };
  const rateBtns = () => `<div class="blind-rate">${[1, 2, 3, 4, 5].map(n => `<button data-rate="${n}"><b>${['😠', '🙁', '😐', '🙂', '😀'][n - 1]}</b><span>${tx('r' + n)}</span></button>`).join('')}</div>`;
  const blind = {
    total: 1,
    done: () => (S().blind && S().blind.phase === 'done') ? 1 : 0,
    view() {
      const s = S(), b = s.blind = s.blind || { phase: 'intro', idx: 0, r1: {}, r2: {} }, items = blindItems();
      if (b.phase === 'intro') return `<p class="ex-intro">${tx('blindIntro')}</p><button class="primary ex-check" data-act="blindstart">${tx('start')}</button>`;
      if (b.phase === 'mid') return `<div class="ex-score"><b>${tx('blindR2')}</b><span>${tx('blindMid')}</span></div><button class="primary ex-check" data-act="blindr2">${tx('next')}</button>`;
      if (b.phase === 'r1' || b.phase === 'r2') {
        const order = b.phase === 'r1' ? items : items.slice().reverse(), it = order[b.idx];
        const label = b.phase === 'r2' ? `<span class="blind-label" style="--c:${CAMP_GROUPS.find(g => g.id === it.shown).color}">${campName(it.shown)}</span>` : `<span class="blind-label hidden">?</span>`;
        return `<div class="dv-progress">${tx(b.phase === 'r1' ? 'blindR1' : 'blindR2')} · ${b.idx + 1} / ${items.length}</div>
          <div class="blind-card">${label}<p>${esc(tr(it.o.text))}</p><span class="hint">${esc(tr(Q[it.qid].text))}</span></div>
          <p class="ex-sub center">${tx('blindQ')}</p>${rateBtns()}`;
      }
      // Wynik
      const mine = myGroup();
      let sum = 0, n = 0;
      const rows = items.map(it => {
        const d = (b.r2[it.k] || 0) - (b.r1[it.k] || 0);
        const sign = it.shown === mine ? 1 : (it.shown === 'center' || mine === 'center') ? (it.shown === mine ? 1 : 0) : -1;
        if (sign) { sum += d * sign; n++; }
        return `<div class="blind-row ${it.fake ? 'fake' : ''}"><p>„${esc(tr(it.o.text))}”</p>
          <span>${campName(it.shown)} · ${it.fake ? tx('blindFake', { c: campName(it.g) }) : tx('blindTrue')}</span>
          <b>${b.r1[it.k]} → ${b.r2[it.k]} ${d > 0 ? '⬆️' : d < 0 ? '⬇️' : '='}</b></div>`;
      }).join('');
      const eff = n ? sum / n : 0;
      const msg = Math.abs(eff) < 0.3 ? 'blindNone' : eff > 0 ? 'blindPos' : 'blindNeg';
      return `<div class="ex-score"><b>${tx('blindRes', { d: (eff > 0 ? '+' : '') + eff.toFixed(1) })}</b><span>${tx(msg)}</span>
          <span class="hint">${tx('blindMy', { g: campName(mine) })} · ${tx('blindMemo')}</span></div>
        <div class="blind-rows">${rows}</div><button class="ghost" data-act="blindagain">${tx('again')}</button>`;
    },
    click(el, s) {
      const b = s.blind, act = el('[data-act]') && el('[data-act]').dataset.act;
      if (act === 'blindstart') { Object.assign(b, { phase: 'r1', idx: 0, r1: {}, r2: {} }); return true; }
      if (act === 'blindr2') { Object.assign(b, { phase: 'r2', idx: 0 }); return true; }
      if (act === 'blindagain') { s.blind = { phase: 'intro', idx: 0, r1: {}, r2: {} }; return true; }
      if (el('[data-rate]')) {
        const items = blindItems(), order = b.phase === 'r1' ? items : items.slice().reverse();
        b[b.phase][order[b.idx].k] = Number(el('[data-rate]').dataset.rate);
        if (b.idx + 1 < items.length) b.idx++; else b.phase = b.phase === 'r1' ? 'mid' : 'done';
        return true;
      }
      return false;
    }
  };

  // ═══ 3. Lustro zasad ═══
  // Kolejność: połówki par są rozdzielone, żeby nie stały obok siebie.
  const mirrorOrder = () => MIRROR.map((m, i) => [m.id, i % 2 ? 'b' : 'a']).concat(MIRROR.map((m, i) => [m.id, i % 2 ? 'a' : 'b']));
  const mirror = {
    total: 1,
    done: () => (S().mirror && S().mirror.done) ? 1 : 0,
    view() {
      const s = S(), m = s.mirror = s.mirror || { started: false, idx: 0, ans: {}, done: false }, order = mirrorOrder();
      if (!m.started) return `<p class="ex-intro">${tx('mirrorIntro')}</p><button class="primary ex-check" data-act="mirstart">${tx('start')}</button>`;
      if (!m.done) {
        const [id, side] = order[m.idx], it = MIRROR.find(x => x.id === id);
        return `<div class="dv-progress">${tx('mirrorCard', { i: m.idx + 1, n: order.length })}</div>
          <div class="mir-card"><p class="mir-sit">${esc(tr(it[side]))}</p><p class="mir-q">${esc(tr(it.q))}</p></div>
          <div class="mir-btns"><button class="mir-no" data-mir="0">${tx('no')}</button><button class="mir-yes" data-mir="1">${tx('yes')}</button></div>`;
      }
      let same = 0;
      const rows = MIRROR.map(it => {
        const a = m.ans[it.id + 'a'], b = m.ans[it.id + 'b'], ok = a === b;
        if (ok) same++;
        const yn = v => v ? tx('yes') : tx('no');
        return `<div class="mir-pair ${ok ? 'ok' : 'diff'}"><div class="mir-pair-h">${ok ? tx('mirrorSame') : tx('mirrorDiff')} · ${esc(tr(it.q))}</div>
          <div class="mir-sides"><div><p>${esc(tr(it.a))}</p><b>${yn(a)}</b></div><div><p>${esc(tr(it.b))}</p><b>${yn(b)}</b></div></div>
          <p class="hint">${esc(tr(it.note))}</p></div>`;
      }).join('');
      return `<div class="ex-score"><b>${tx('mirrorRes', { k: same, n: MIRROR.length })}</b><span>${tx(same === MIRROR.length ? 'mirrorAll' : 'mirrorSome')}</span></div>
        <div class="mir-pairs">${rows}</div><button class="ghost" data-act="miragain">${tx('again')}</button>`;
    },
    click(el, s) {
      const m = s.mirror, act = el('[data-act]') && el('[data-act]').dataset.act;
      if (act === 'mirstart') { m.started = true; return true; }
      if (act === 'miragain') { s.mirror = { started: true, idx: 0, ans: {}, done: false }; return true; }
      if (el('[data-mir]')) {
        const order = mirrorOrder(), [id, side] = order[m.idx];
        m.ans[id + side] = el('[data-mir]').dataset.mir === '1';
        if (m.idx + 1 < order.length) m.idx++; else m.done = true;
        return true;
      }
      return false;
    }
  };

  // ═══ 4. Zasłona niewiedzy ═══
  const veilScore = (rules, pid) => VEIL_RULES.reduce((sum, r) => sum + (rules[r.id] != null ? r.impact[pid][rules[r.id]] : 0), 0);
  const veil = {
    total: 1,
    done: () => (S().veil && S().veil.person) ? 1 : 0,
    view() {
      const s = S(), v = s.veil = s.veil || { rules: {}, person: null };
      const all = VEIL_RULES.every(r => v.rules[r.id] != null);
      if (!v.person) {
        return `<p class="ex-intro">${tx('veilIntro')}</p><div class="veil-rules">${VEIL_RULES.map(r => `<div class="veil-rule"><b>${r.icon} ${esc(tr(r.name))}</b>
          <div class="veil-opts">${r.opts.map((o, i) => `<button class="${v.rules[r.id] === i ? 'sel' : ''}" data-vr="${r.id}" data-vi="${i}">${esc(tr(o))}</button>`).join('')}</div></div>`).join('')}</div>
          <button class="primary ex-check veil-draw" data-act="veildraw" ${all ? '' : 'disabled'}>${tx('veilDraw')}</button>
          ${all ? '' : `<p class="hint">${tx('veilPick', { n: VEIL_RULES.length })}</p>`}`;
      }
      const p = VEIL_PEOPLE.find(x => x.id === v.person), score = veilScore(v.rules, p.id);
      const life = score >= 4 ? 'veilGood' : score >= -2 ? 'veilMid' : 'veilBad';
      const totals = VEIL_PEOPLE.map(x => ({ x, s: veilScore(v.rules, x.id) })).sort((a, b) => a.s - b.s);
      const pname = x => `${x.icon} ${tr(x.name)}`;
      return `<div class="veil-person"><span>${tx('veilYou')}</span><div class="veil-avatar">${p.icon}</div><b>${esc(tr(p.name))}</b></div>
        <div class="ex-score"><b>${tx('veilLife')}: <span class="veil-life ${life}">${tx(life)}</span> (${score > 0 ? '+' : ''}${score})</b></div>
        <div class="veil-impacts">${VEIL_RULES.map(r => { const d = r.impact[p.id][v.rules[r.id]];
          return `<div class="veil-imp"><span>${r.icon} ${esc(tr(r.name))}: ${esc(tr(r.opts[v.rules[r.id]]))}</span><b class="d${d}">${d > 0 ? '+' : ''}${d}</b></div>`; }).join('')}</div>
        <div class="ex-note"><p>${tx('veilWorst', { p: pname(totals[0].x) })} (${totals[0].s})</p><p>${tx('veilBest', { p: pname(totals[totals.length - 1].x) })} (+${totals[totals.length - 1].s})</p></div>
        <p class="hint">${tx('veilNote')}</p>
        <div class="ex-choices"><button class="ghost" data-act="veildraw">${tx('veilRedraw')}</button><button class="ghost" data-act="veilrules">${tx('veilRules')}</button></div>`;
    },
    click(el, s) {
      const v = s.veil, act = el('[data-act]') && el('[data-act]').dataset.act;
      if (el('[data-vr]')) { v.rules[el('[data-vr]').dataset.vr] = Number(el('[data-vr]').dataset.vi); return true; }
      if (act === 'veildraw') {
        const others = VEIL_PEOPLE.filter(x => x.id !== v.person);
        v.person = others[Math.floor(Math.random() * others.length)].id;
        return 'scroll';
      }
      if (act === 'veilrules') { v.person = null; return true; }
      return false;
    }
  };

  // ═══ 5. Kalibracja ═══
  const CONFS = [50, 60, 70, 80, 90, 100];
  const calib = {
    total: 1,
    done: () => (S().calib && S().calib.done) ? 1 : 0,
    view() {
      const s = S(), c = s.calib = s.calib || { started: false, idx: 0, ans: {}, done: false };
      if (!c.started) return `<p class="ex-intro">${tx('calibIntro')}</p><button class="primary ex-check" data-act="calstart">${tx('start')}</button>`;
      if (!c.done) {
        const it = CALIB[c.idx], a = c.ans[it.id] || {};
        return `<div class="dv-progress">${tx('calibQ', { i: c.idx + 1, n: CALIB.length })}</div>
          <div class="cal-card"><h4>${esc(tr(it.q))}</h4><div class="cal-opts">${it.opts.map((o, i) =>
            `<button class="${a.choice === i ? 'sel' : ''}" data-calopt="${i}">${esc(optText(o))}</button>`).join('')}</div>
          <p class="ex-sub">${tx('calibConf')}</p><div class="cal-conf">${CONFS.map(p =>
            `<button class="${a.conf === p ? 'sel' : ''}" data-calconf="${p}">${p}%${p === 50 ? ' ' + tx('calibGuess') : ''}</button>`).join('')}</div></div>
          <button class="primary ex-check" data-act="calnext" ${a.choice != null && a.conf ? '' : 'disabled'}>${tx('next')}</button>`;
      }
      const res = CALIB.map(it => ({ it, a: c.ans[it.id], ok: c.ans[it.id].choice === it.ok }));
      const k = res.filter(r => r.ok).length, avgConf = Math.round(res.reduce((s2, r) => s2 + r.a.conf, 0) / res.length), acc = Math.round(k / res.length * 100);
      const gap = avgConf - acc;
      const msg = Math.abs(gap) <= 10 ? tx('calibGood') : gap > 0 ? tx('calibOver', { d: gap }) : tx('calibUnder', { d: -gap });
      const buckets = [[50, 60, '50-60%'], [70, 80, '70-80%'], [90, 100, '90-100%']].map(([lo, hi, label]) => {
        const rs = res.filter(r => r.a.conf >= lo && r.a.conf <= hi);
        return rs.length ? `<li>${tx('calibBucket', { b: label, p: Math.round(rs.filter(r => r.ok).length / rs.length * 100), n: rs.length })}</li>` : '';
      }).join('');
      return `<div class="ex-score"><b>${tx('calibRes', { k, n: res.length, c: avgConf })}</b><span>${msg}</span><ul class="cal-buckets">${buckets}</ul></div>
        <div class="ex-results">${res.map(r => `<div class="ex-res ${r.ok ? 'v-good' : 'v-false'}"><div class="ex-res-head">${r.ok ? '✓' : '✗'} ${esc(tr(r.it.q))} · ${r.a.conf}%</div>
          <p class="ex-res-why">${tx('calibCorrect', { a: esc(optText(r.it.opts[r.it.ok])) })}. ${esc(tr(r.it.note))}</p></div>`).join('')}</div>
        <button class="ghost" data-act="calagain">${tx('again')}</button>`;
    },
    click(el, s) {
      const c = s.calib, act = el('[data-act]') && el('[data-act]').dataset.act, it = CALIB[c.idx];
      if (act === 'calstart') { c.started = true; return true; }
      if (act === 'calagain') { s.calib = { started: true, idx: 0, ans: {}, done: false }; return true; }
      if (el('[data-calopt]')) { c.ans[it.id] = Object.assign(c.ans[it.id] || {}, { choice: Number(el('[data-calopt]').dataset.calopt) }); return true; }
      if (el('[data-calconf]')) { c.ans[it.id] = Object.assign(c.ans[it.id] || {}, { conf: Number(el('[data-calconf]').dataset.calconf) }); return true; }
      if (act === 'calnext') { if (c.idx + 1 < CALIB.length) c.idx++; else c.done = true; return 'scroll'; }
      return false;
    }
  };

  SZ.EX2 = { why, blind, mirror, veil, calib };
  SZ.EX2_TYPES = [['why', 'tWhy', 'dWhy'], ['blind', 'tBlind', 'dBlind'], ['mirror', 'tMirror', 'dMirror'], ['veil', 'tVeil', 'dVeil'], ['calib', 'tCalib', 'dCalib']];
  SZ.EX2_TX = tx;
})();
