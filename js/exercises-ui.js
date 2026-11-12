// Zakładka „Ćwiczenia”: cztery rodzaje ćwiczeń, które zmuszają do myślenia o własnych poglądach.
//   defense - Obrona argumentów: do 5 argumentów za SWOIM stanowiskiem (część jest podchwytliwa)
//   devil   - Adwokat diabła: do 3 najlepszych argumentów za stanowiskiem, którego NIE podzielasz
//   mind    - Zmiana zdania: mocny fakt przeciw Twojemu stanowisku - czy coś zmienia?
//   budget  - Wybory z kosztem: dzielisz 100 mld zł i porównujesz z wynikami na osiach
window.SZ = window.SZ || {};

(function () {
  const App = SZ.App, { CAMPS, CAMP_GROUPS, FALLACIES, EXERCISES, DEVIL = [], CHALLENGES = {}, BUDGET = [] } = SZ;
  const MIND = Object.keys(CHALLENGES).map(q => ({ q }));   // Zmiana zdania ma własne pytania
  const Q = Object.fromEntries(SZ.QUESTIONS.map(q => [q.id, q]));
  const AX = Object.fromEntries(SZ.AXES.map(a => [a.id, a]));
  const $ = id => document.getElementById(id);
  const MAX = { defense: 5, devil: 3 };
  const BUDGET_TOTAL = 100, STEP = 5, BAR_MAX = 40;   // paski: pełna szerokość = 40 mld zł

  const TXT = {
    pl: {
      title: '🧠 Ćwiczenia',
      menuIntro: 'Ćwiczenia, które pomagają zrozumieć, co myślisz i dlaczego. Wybierz jedno:',
      tDefense: '🛡️ Obrona argumentów', dDefense: 'Wybierz do 5 argumentów za swoim stanowiskiem. Część jest podchwytliwa.',
      tDevil: '😈 Adwokat diabła', dDevil: 'Znajdź najlepsze argumenty za stanowiskiem, którego nie podzielasz.',
      tMind: '🔄 Zmiana zdania', dMind: 'Zobacz mocny fakt przeciw swojemu stanowisku i zdecyduj, czy coś zmienia.',
      tBudget: '💰 Wybory z kosztem', dBudget: 'Podziel 100 mld zł i sprawdź, czy budżet zgadza się z Twoimi poglądami.',
      menu: '← Wszystkie ćwiczenia', back: '← Lista pytań',
      introDefense: 'Sprawdź, czy umiesz obronić swoje poglądy. Wybierz do 5 argumentów, którymi przekonałbyś kogoś do swojego stanowiska. Uwaga: część brzmi dobrze, ale zawiera błąd logiczny, nieprawdziwy fakt albo przemawia za czymś innym.',
      introDevil: 'Prawdziwe zrozumienie sporu zaczyna się wtedy, gdy umiesz rozpoznać najmocniejsze argumenty drugiej strony. Wybierz stanowisko, którego nie podzielasz. Dostaniesz talię kart: przy każdej zdecyduj, czy to dobry argument za tą stroną, czy pułapka.',
      introMind: 'Każde stanowisko ma słabe punkty. Najpierw zaznacz, jak mocno jesteś przekonany. Potem zobaczysz najmocniejszy fakt przeciw Twojemu stanowisku i zaznaczysz to jeszcze raz.',
      introBudget: 'Masz 100 mld zł do rozdzielenia. Dodawaj i odejmuj po 5 mld. Na końcu porównamy Twój budżet z wynikami na osiach.',
      done: 'Zrobione', todo: 'Do zrobienia', strong: 'mocnych',
      yourPos: 'Twoje stanowisko', pickPos: 'Najpierw wybierz swoje stanowisko:', changePos: 'zmień',
      pickArgs: 'Wybierz do {n} argumentów:', chosen: 'Wybrane: {k} / {n}',
      check: 'Sprawdź', again: '🔁 Spróbuj jeszcze raz',
      vGood: '✅ Mocny argument', vFallacy: '⚠️ Błąd logiczny', vFalse: '❌ Nieprawda', vOther: '↔️ To argument za innym stanowiskiem',
      supportsOther: 'Pasuje raczej do: {camps}.',
      score: 'Mocnych argumentów: {g} z {k}', grade0: 'Ta obrona by nie przekonała - prawie wszystkie argumenty mają haczyk.',
      grade1: 'Niezła próba, ale część argumentów łatwo zbić.', grade2: 'Dobra robota! Większość argumentów jest rzeczowa.', grade3: 'Świetnie - same mocne argumenty.',
      conflictsT: '🔁 Kłóci się z Twoimi innymi odpowiedziami', excludesT: '⛔ Te argumenty się wykluczają', missedT: '💡 Mocne argumenty, których nie wybrałeś',
      noConflicts: 'Twoje argumenty nie kłócą się z innymi Twoimi odpowiedziami.',
      inQuestion: 'Pytanie: „{q}”', yourAnswer: 'Twoja odpowiedź: {a}',
      devilPick: 'Którego stanowiska chcesz bronić? (Twoje jest wyszarzone.)', devilTarget: 'Bronisz stanowiska',
      devilGood: 'Umiesz zrozumieć drugą stronę - wybrałeś jej najmocniejsze argumenty.', devilMid: 'Częściowo - druga strona ma mocniejsze argumenty niż te, które wybrałeś.',
      devilBad: 'Druga strona broniłaby się lepiej. Zobacz jej najmocniejsze argumenty poniżej.', devilOther: 'Inne stanowisko',
      mindFact: 'Fakt przeciw Twojemu stanowisku', mindKnew: 'Czy znałeś ten fakt?', yes: 'Tak', no: 'Nie',
      mindQ: 'Czy to coś zmienia w Twoim zdaniu?',
      mind0: 'Nie zmienia - nadal tak uważam', mind1: 'Trochę osłabia moje przekonanie', mind2: 'Zmienia - wybieram inne stanowisko',
      mindNew: 'Na które stanowisko zmieniasz zdanie?',
      mindSummary: 'Twoja otwartość', mindStats: 'Ćwiczeń: {n} · nie zmienia: {a} · osłabia: {b} · zmiana zdania: {c} · nieznanych faktów: {d}',
      mindNote0: 'Pewność to nie wada, ale warto umieć odpowiedzieć na takie fakty.', mindNote1: 'Dobrze: przyjmujesz fakty, ale nie porzucasz poglądów przy pierwszej trudności.', mindNote2: 'Jesteś bardzo otwarty na fakty - pamiętaj, że jeden fakt rzadko rozstrzyga cały spór.',
      mindChanged: 'Zmieniłeś zdanie na: {p}. Twoja odpowiedź w teście też się zmieniła.', mindKept: 'Zostajesz przy swoim stanowisku.',
      left: 'Do rozdzielenia: {n} mld zł', mld: 'mld zł', budgetCheck: 'Porównaj z moimi poglądami',
      bNeed: 'Rozdziel całe 100 mld zł, żeby porównać.', bExpect: 'Wg Twoich odpowiedzi', bMore: 'raczej więcej', bLess: 'raczej mniej', bSame: 'mniej więcej tyle',
      bNoData: 'brak danych', bOk: '✅ zgodne', bHi: '⬆️ dałeś dużo więcej, niż wynika z Twoich poglądów', bLo: '⬇️ dałeś dużo mniej, niż wynika z Twoich poglądów',
      bSummary: 'Zgodność budżetu z poglądami: {k} z {n} pozycji.', bTip: 'Rozbieżność nie jest błędem - pokazuje, gdzie Twoje priorytety są inne, niż sugerowałyby same poglądy. Warto się zastanowić, dlaczego.',
      bReset: '🔁 Zacznij od nowa', bAxes: 'Na podstawie osi: {axes}',
      dvCorrect: 'trafnych', dvCard: 'Karta {i} z {n}', dvQ: 'Czy to dobry argument za stanowiskiem: {camp}?',
      dvYes: 'Dobry argument', dvNo: 'Odrzucam', dvHit: '✓ Trafnie!', dvMiss: '✗ Pudło',
      dvWasGood: 'To był dobry argument dla tej strony.', dvWasBad: 'To nie był dobry argument dla tej strony.',
      dvNext: 'Następna karta →', dvFinish: 'Zobacz wynik', dvScore: 'Trafnych ocen: {k} z {n}', dvMistakes: 'Gdzie się pomyliłeś',
      mLow: 'wcale', mHigh: 'całkowicie', mBefore: 'Jak mocno jesteś przekonany do swojego stanowiska?', mShowFact: 'Pokaż fakt przeciw',
      mAfter: 'A teraz - jak mocno jesteś przekonany?', mSave: 'Zapisz', mLowConf: 'Twoja pewność mocno spadła. Chcesz zmienić stanowisko?',
      mStay: 'Zostaję przy swoim', mResult: 'Pewność: {a}% → {b}% ({d} pkt)', mBeforeL: 'Przed', mAfterL: 'Po',
      mWeaker: 'Zostajesz przy swoim, ale z mniejszą pewnością - to też uczciwy wynik.', mSwitched: 'zmiana zdania',
      mStats: 'Ćwiczeń: {n} · średnia zmiana pewności: {d} pkt · nieznanych faktów: {u} · zmian zdania: {c}'
    },
    en: {
      title: '🧠 Exercises',
      menuIntro: 'Exercises that help you understand what you think and why. Pick one:',
      tDefense: '🛡️ Defend your position', dDefense: 'Pick up to 5 arguments for your position. Some are tricky.',
      tDevil: '😈 Devil\'s advocate', dDevil: 'Find the best arguments for a position you do not hold.',
      tMind: '🔄 Change of mind', dMind: 'See a strong fact against your position and decide whether it changes anything.',
      tBudget: '💰 Choices with a cost', dBudget: 'Split 100 billion zł and check whether the budget matches your views.',
      menu: '← All exercises', back: '← Question list',
      introDefense: 'Check whether you can defend your views. Pick up to 5 arguments you would use to convince someone. Careful: some sound good but contain a logical fallacy, a false fact, or support something else.',
      introDevil: 'Real understanding of a debate starts when you can recognise the other side\'s strongest arguments. Choose a position you do not hold. You get a deck of cards: for each, decide whether it is a good argument for that side or a trap.',
      introMind: 'Every position has weak spots. First mark how convinced you are. Then you will see the strongest fact against your position and mark it again.',
      introBudget: 'You have 100 billion zł to split. Add and remove in steps of 5 billion. At the end we compare your budget with your results on the axes.',
      done: 'Done', todo: 'To do', strong: 'strong',
      yourPos: 'Your position', pickPos: 'First choose your position:', changePos: 'change',
      pickArgs: 'Pick up to {n} arguments:', chosen: 'Chosen: {k} / {n}',
      check: 'Check', again: '🔁 Try again',
      vGood: '✅ Strong argument', vFallacy: '⚠️ Logical fallacy', vFalse: '❌ False', vOther: '↔️ This argues for a different position',
      supportsOther: 'It fits better with: {camps}.',
      score: 'Strong arguments: {g} of {k}', grade0: 'This would not convince anyone - almost every argument has a catch.',
      grade1: 'A decent try, but some arguments are easy to knock down.', grade2: 'Good work! Most arguments are solid.', grade3: 'Excellent - only strong arguments.',
      conflictsT: '🔁 Clashes with your other answers', excludesT: '⛔ These arguments contradict each other', missedT: '💡 Strong arguments you did not pick',
      noConflicts: 'Your arguments do not clash with your other answers.',
      inQuestion: 'Question: "{q}"', yourAnswer: 'Your answer: {a}',
      devilPick: 'Which position do you want to defend? (Yours is greyed out.)', devilTarget: 'You are defending',
      devilGood: 'You can understand the other side - you picked its strongest arguments.', devilMid: 'Partly - the other side has stronger arguments than the ones you picked.',
      devilBad: 'The other side would defend itself better. See its strongest arguments below.', devilOther: 'Another position',
      mindFact: 'A fact against your position', mindKnew: 'Did you know this fact?', yes: 'Yes', no: 'No',
      mindQ: 'Does it change your view?',
      mind0: 'No - I still think the same', mind1: 'It weakens my conviction a little', mind2: 'Yes - I choose another position',
      mindNew: 'Which position are you switching to?',
      mindSummary: 'Your open-mindedness', mindStats: 'Exercises: {n} · no change: {a} · weakened: {b} · changed mind: {c} · unknown facts: {d}',
      mindNote0: 'Certainty is not a flaw, but it is worth being able to answer such facts.', mindNote1: 'Good: you accept facts without dropping your views at the first difficulty.', mindNote2: 'You are very open to facts - remember that one fact rarely settles a whole debate.',
      mindChanged: 'You changed your mind to: {p}. Your test answer has changed too.', mindKept: 'You keep your position.',
      left: 'Left to allocate: {n} bn zł', mld: 'bn zł', budgetCheck: 'Compare with my views',
      bNeed: 'Allocate the full 100 billion to compare.', bExpect: 'From your answers', bMore: 'rather more', bLess: 'rather less', bSame: 'about this much',
      bNoData: 'no data', bOk: '✅ consistent', bHi: '⬆️ you gave much more than your views suggest', bLo: '⬇️ you gave much less than your views suggest',
      bSummary: 'Budget matches your views in {k} of {n} items.', bTip: 'A mismatch is not a mistake - it shows where your priorities differ from what your views alone would suggest. Worth thinking about why.',
      bReset: '🔁 Start over', bAxes: 'Based on the axes: {axes}',
      dvCorrect: 'correct', dvCard: 'Card {i} of {n}', dvQ: 'Is this a good argument for: {camp}?',
      dvYes: 'Good argument', dvNo: 'Reject', dvHit: '✓ Correct!', dvMiss: '✗ Miss',
      dvWasGood: 'This was a good argument for this side.', dvWasBad: 'This was not a good argument for this side.',
      dvNext: 'Next card →', dvFinish: 'See result', dvScore: 'Correct judgements: {k} of {n}', dvMistakes: 'Where you went wrong',
      mLow: 'not at all', mHigh: 'completely', mBefore: 'How convinced are you of your position?', mShowFact: 'Show the counter-fact',
      mAfter: 'And now - how convinced are you?', mSave: 'Save', mLowConf: 'Your confidence dropped a lot. Do you want to change position?',
      mStay: 'I keep my position', mResult: 'Confidence: {a}% → {b}% ({d} pts)', mBeforeL: 'Before', mAfterL: 'After',
      mWeaker: 'You keep your position, but with less certainty - that is an honest result too.', mSwitched: 'changed mind',
      mStats: 'Exercises: {n} · average change in confidence: {d} pts · unknown facts: {u} · changes of mind: {c}'
    }
  };
  const tx = (k, vars = {}) => ((TXT[App.state.lang] || TXT.pl)[k] || k).replace(/\{(\w+)\}/g, (_, v) => vars[v] != null ? vars[v] : '');
  const tr = App.tr, esc = App.esc;

  // ── Stan ćwiczeń (zapisywany razem z resztą apki) ──
  const S = () => {
    const st = App.state;
    if (!st.ex || typeof st.ex !== 'object') st.ex = {};
    const e = st.ex;
    e.picks = e.picks || {}; e.checked = e.checked || {};      // obrona argumentów
    e.devil = e.devil || {}; e.mind = e.mind || {};
    e.budget = e.budget || { alloc: {}, checked: false };
    return e;
  };
  const campOf = qid => { const q = Q[qid], a = App.state.answers[qid]; return q && q.options[a] ? q.options[a].camp : null; };
  const campName = c => tr((CAMPS[c] || CAMP_GROUPS.find(g => g.id === c) || {}).name);
  const supports = (arg, camp) => !!camp && (arg.supports || []).some(c => c === camp || c === CAMPS[camp].group);
  const verdict = (arg, camp) => arg.kind === 'fallacy' ? 'fallacy' : arg.kind === 'false' ? 'false' : supports(arg, camp) ? 'good' : 'other';
  // Kolejność argumentów: wymieszana, ale stała dla danego pytania (podchwytliwe nie stoją razem).
  const order = ex => ex.args.map((a, i) => [a, (i * 7 + ex.q.length * 3) % ex.args.length + i / 100]).sort((x, y) => x[1] - y[1]).map(x => x[0]);

  // ── Wspólne kawałki ──
  const posCard = (o, i, attrs = '', extra = '') => `<button class="pos-card ${extra}" ${attrs} style="--camp:${CAMPS[o.camp].color}">
      <span class="camp-tag">${campName(o.camp)}</span><span class="pos-text">${esc(tr(o.text))}</span></button>`;
  const pickOwnPos = q => `<p class="ex-sub">${tx('pickPos')}</p><div class="ex-pos-pick">${q.options.map((o, i) => posCard(o, i, `data-pos="${i}"`)).join('')}</div>`;
  const myPos = (q, camp) => `<div class="ex-mypos" style="--camp:${CAMPS[camp].color}"><span class="lbl">${tx('yourPos')} · <b style="color:var(--camp)">${campName(camp)}</b></span>
      ${esc(tr(q.options[App.state.answers[q.id]].text))} <button class="linkish" data-act="changepos">${tx('changePos')}</button></div>`;
  const header = (backKey = 'back') => `<button class="ghost ex-back" data-act="${backKey === 'menu' ? 'menu' : 'back'}">${tx(backKey)}</button>`;
  const argButtons = (ex, picks, max) => `<p class="ex-sub">${tx('pickArgs', { n: max })} <span class="ex-count">${tx('chosen', { k: picks.length, n: max })}</span></p>
      <div class="ex-args">${order(ex).map(a => `<button class="ex-arg ${picks.includes(a.id) ? 'sel' : ''}" data-arg="${a.id}"
        ${!picks.includes(a.id) && picks.length >= max ? 'disabled' : ''}>${esc(tr(a.text))}</button>`).join('')}</div>
      <button class="primary ex-check" data-act="check" ${picks.length ? '' : 'disabled'}>${tx('check')}</button>`;
  function argResults(ex, camp, picks) {
    return picks.map(id => {
      const a = ex.args.find(x => x.id === id), v = verdict(a, camp);
      let why = '';
      if (v === 'fallacy') { const f = FALLACIES[a.fallacy]; why = `<b>${tr(f)}</b> - ${tr(f.d)}`; }
      else if (v === 'other') why = `${tx('supportsOther', { camps: (a.supports || []).map(campName).join(', ') })} ${a.note ? tr(a.note) : ''}`;
      else why = a.note ? tr(a.note) : '';
      return `<div class="ex-res v-${v}"><div class="ex-res-head">${tx('v' + v[0].toUpperCase() + v.slice(1))}</div>
        <p class="ex-res-arg">„${esc(tr(a.text))}”</p><p class="ex-res-why">${why}</p></div>`;
    }).join('');
  }
  const gradeOf = (good, total) => { const r = total ? good / total : 0; return r >= 1 ? 'grade3' : r >= .6 ? 'grade2' : r >= .3 ? 'grade1' : 'grade0'; };
  const qList = (list, statusFn) => `<div class="ex-list">${list.map(ex => {
      const st = statusFn(ex);
      return `<button class="ex-card ${st.done ? 'done' : ''}" data-ex="${ex.q}"><span class="ex-q">${esc(tr(Q[ex.q].text))}</span>
        <span class="ex-status">${st.done ? '✓ ' + st.text : tx('todo')}</span></button>`;
    }).join('')}</div>`;

  // ═══════════ 1. Obrona argumentów ═══════════
  const defStats = ex => {
    const camp = campOf(ex.q), picks = S().picks[ex.q] || [];
    return { good: picks.filter(id => verdict(ex.args.find(a => a.id === id), camp) === 'good').length, total: picks.length };
  };
  const defense = {
    list: () => `<p class="ex-intro">${tx('introDefense')}</p>` + qList(EXERCISES, ex => {
      const st = defStats(ex); return { done: S().checked[ex.q], text: `${tx('done')} · ${st.good}/${st.total} ${tx('strong')}` };
    }),
    view(ex) {
      const q = Q[ex.q], s = S(), camp = campOf(ex.q), picks = s.picks[ex.q] || [];
      let html = header() + `<h3 class="ex-title">${esc(tr(q.text))}</h3>`;
      if (!camp || s.changing === ex.q) return html + pickOwnPos(q);
      html += myPos(q, camp);
      if (!s.checked[ex.q]) return html + argButtons(ex, picks, MAX.defense);
      const st = defStats(ex);
      const conflicts = [];
      picks.map(id => ex.args.find(a => a.id === id)).forEach(a => (a.conflicts || []).forEach(c => {
        const other = campOf(c.q); if (other && c.camps.includes(other)) conflicts.push({ a, c });
      }));
      const excl = (ex.excludes || []).filter(([x, y]) => picks.includes(x) && picks.includes(y));
      const missed = ex.args.filter(a => a.kind === 'good' && supports(a, camp) && !picks.includes(a.id));
      return html + `<div class="ex-score"><b>${tx('score', { g: st.good, k: st.total })}</b><span>${tx(gradeOf(st.good, st.total))}</span></div>
        <div class="ex-results">${argResults(ex, camp, picks)}</div>
        ${excl.length ? `<h4 class="ex-h">${tx('excludesT')}</h4>` + excl.map(([x, y, note]) => `<div class="ex-note bad">
          <p>„${esc(tr(ex.args.find(a => a.id === x).text))}”<br>⇄ „${esc(tr(ex.args.find(a => a.id === y).text))}”</p><p>${tr(note)}</p></div>`).join('') : ''}
        <h4 class="ex-h">${tx('conflictsT')}</h4>${conflicts.length ? conflicts.map(({ a, c }) => `<div class="ex-note warn">
          <p>„${esc(tr(a.text))}”</p><p>${tr(c.note)}</p>
          <p class="hint">${tx('inQuestion', { q: esc(tr(Q[c.q].text)) })} · ${tx('yourAnswer', { a: esc(App.answerLabel(Q[c.q], App.state.answers[c.q])) })}</p></div>`).join('') : `<p class="hint">${tx('noConflicts')}</p>`}
        ${missed.length ? `<h4 class="ex-h">${tx('missedT')}</h4><ul class="ex-missed">${missed.map(a => `<li>${esc(tr(a.text))}</li>`).join('')}</ul>` : ''}
        <button class="ghost" data-act="again">${tx('again')}</button>`;
    },
    act(a, ex) {
      const s = S();
      if (a === 'check') s.checked[ex.q] = true;
      if (a === 'again') { s.checked[ex.q] = false; s.picks[ex.q] = []; }
      if (a === 'changepos') { s.changing = ex.q; s.checked[ex.q] = false; s.picks[ex.q] = []; }
    },
    toggle(ex, id) { const s = S(), p = s.picks[ex.q] = s.picks[ex.q] || []; toggleIn(p, id, MAX.defense); }
  };
  function toggleIn(list, id, max) { if (list.includes(id)) list.splice(list.indexOf(id), 1); else if (list.length < max) list.push(id); }

  // ═══════════ 2. Adwokat diabła - talia kart: 👍 dobry argument dla tej strony / 👎 odrzuć ═══════════
  const devilState = q => { const s = S(); return s.devil[q] = s.devil[q] || { target: null, idx: 0, ans: {}, reveal: false }; };
  const devilCorrect = (a, target) => a.kind === 'good' && supports(a, target);
  const devilStats = ex => {
    const d = devilState(ex.q), ids = Object.keys(d.ans);
    return { ok: ids.filter(id => d.ans[id] === devilCorrect(ex.args.find(a => a.id === id), d.target)).length, total: ex.args.length, done: ids.length === ex.args.length };
  };
  const devil = {
    list: () => `<p class="ex-intro">${tx('introDevil')}</p>` + qList(DEVIL, ex => {
      const st = devilStats(ex), d = devilState(ex.q);
      return { done: st.done, text: `${campName(d.target)} · ${st.ok}/${st.total} ${tx('dvCorrect')}` };
    }),
    view(ex) {
      const q = Q[ex.q], d = devilState(ex.q), mine = campOf(ex.q);
      let html = header() + `<h3 class="ex-title">${esc(tr(q.text))}</h3>`;
      if (!d.target) {
        return html + `<p class="ex-sub">${tx('devilPick')}</p><div class="ex-pos-pick">${q.options.map((o, i) =>
          posCard(o, i, o.camp === mine ? 'disabled' : `data-target="${o.camp}"`, o.camp === mine ? 'mine' : '')).join('')}</div>`;
      }
      const o = q.options.find(x => x.camp === d.target), deck = order(ex);
      html += `<div class="ex-mypos devil" style="--camp:${CAMPS[d.target].color}"><span class="lbl">😈 ${tx('devilTarget')} · <b style="color:var(--camp)">${campName(d.target)}</b></span>
        ${esc(tr(o.text))} <button class="linkish" data-act="retarget">${tx('changePos')}</button></div>`;
      const st = devilStats(ex);
      if (!st.done || d.reveal) {
        const a = deck[d.idx], mineAns = d.ans[a.id], right = devilCorrect(a, d.target);
        let card = `<div class="dv-progress">${tx('dvCard', { i: d.idx + 1, n: deck.length })}</div>
          <div class="dv-card ${d.reveal ? (mineAns === right ? 'hit' : 'miss') : ''}"><p>„${esc(tr(a.text))}”</p></div>`;
        if (!d.reveal) {
          card += `<p class="ex-sub center">${tx('dvQ', { camp: campName(d.target) })}</p>
            <div class="dv-btns"><button class="dv-no" data-dv="0">👎 ${tx('dvNo')}</button><button class="dv-yes" data-dv="1">👍 ${tx('dvYes')}</button></div>`;
        } else {
          const v = verdict(a, d.target);
          let why = v === 'fallacy' ? `<b>${tr(FALLACIES[a.fallacy])}</b> - ${tr(FALLACIES[a.fallacy].d)}`
            : v === 'other' ? `${tx('supportsOther', { camps: (a.supports || []).map(campName).join(', ') })} ${a.note ? tr(a.note) : ''}` : (a.note ? tr(a.note) : '');
          card += `<div class="dv-feedback ${mineAns === right ? 'hit' : 'miss'}"><b>${mineAns === right ? tx('dvHit') : tx('dvMiss')}</b>
              <span>${right ? tx('dvWasGood') : tx('dvWasBad')}</span><p>${why}</p></div>
            <button class="primary ex-check" data-act="dvnext">${d.idx + 1 < deck.length ? tx('dvNext') : tx('dvFinish')}</button>`;
        }
        return html + card;
      }
      const wrong = deck.filter(a => d.ans[a.id] !== devilCorrect(a, d.target));
      const r = st.ok / st.total;
      return html + `<div class="ex-score"><b>${tx('dvScore', { k: st.ok, n: st.total })}</b><span>${tx(r >= .85 ? 'devilGood' : r >= .6 ? 'devilMid' : 'devilBad')}</span></div>
        ${wrong.length ? `<h4 class="ex-h">${tx('dvMistakes')}</h4><div class="ex-results">${wrong.map(a => {
          const right = devilCorrect(a, d.target);
          return `<div class="ex-res ${right ? 'v-good' : 'v-false'}"><div class="ex-res-head">${right ? tx('dvWasGood') : tx('dvWasBad')}</div>
            <p class="ex-res-arg">„${esc(tr(a.text))}”</p></div>`;
        }).join('')}</div>` : ''}
        <button class="ghost" data-act="again">${tx('again')}</button>`;
    },
    act(a, ex) {
      const d = devilState(ex.q);
      if (a === 'again') Object.assign(d, { idx: 0, ans: {}, reveal: false });
      if (a === 'retarget') Object.assign(d, { target: null, idx: 0, ans: {}, reveal: false });
      if (a === 'dvnext') { d.reveal = false; if (d.idx + 1 < ex.args.length) d.idx++; }
    }
  };

  // ═══════════ 3. Zmiana zdania - suwak pewności przed faktem i po nim ═══════════
  const mindState = q => { const s = S(); return s.mind[q] = s.mind[q] || { before: null, knew: null, after: null, from: null, to: null, done: false }; };
  const slider = (id, val) => `<div class="mind-slider"><input type="range" min="0" max="100" step="5" value="${val}" data-slider="${id}">
      <div class="mind-scale"><span>${tx('mLow')}</span><b data-out="${id}">${val}%</b><span>${tx('mHigh')}</span></div></div>`;
  const mind = {
    list() {
      const done = MIND.map(ex => mindState(ex.q)).filter(m => m.done);
      const avg = done.length ? Math.round(done.reduce((s, m) => s + (m.after - m.before), 0) / done.length) : 0;
      const summary = done.length ? `<div class="ex-score"><b>${tx('mindSummary')}</b>
          <span>${tx('mStats', { n: done.length, d: (avg > 0 ? '+' : '') + avg, u: done.filter(m => m.knew === false).length, c: done.filter(m => m.to).length })}</span>
          <span>${tx(avg <= -25 ? 'mindNote2' : avg > -5 ? 'mindNote0' : 'mindNote1')}</span></div>` : '';
      return `<p class="ex-intro">${tx('introMind')}</p>` + summary + qList(MIND, ex => {
        const m = mindState(ex.q); return { done: m.done, text: `${m.before}% → ${m.after}%${m.to ? ' · ' + tx('mSwitched') : ''}` };
      });
    },
    view(ex) {
      const q = Q[ex.q], m = mindState(ex.q), s = S(), camp = campOf(ex.q);
      let html = header() + `<h3 class="ex-title">${esc(tr(q.text))}</h3>`;
      if ((!camp || s.changing === ex.q) && !m.done) return html + pickOwnPos(q);
      const from = m.from || camp;
      html += `<div class="ex-mypos" style="--camp:${CAMPS[from].color}"><span class="lbl">${tx('yourPos')} · <b style="color:var(--camp)">${campName(from)}</b></span>
        ${esc(tr(q.options.find(o => o.camp === from).text))}</div>`;
      // Krok 1: pewność przed faktem
      if (m.before == null) return html + `<p class="ex-sub">${tx('mBefore')}</p>${slider('before', 70)}
        <button class="primary ex-check" data-act="mbefore">${tx('mShowFact')}</button>`;
      const fact = (CHALLENGES[ex.q] || {})[from];
      html += `<div class="ex-fact"><span class="lbl">⚡ ${tx('mindFact')}</span><p>${esc(tr(fact))}</p></div>`;
      // Krok 2: czy znałeś fakt
      if (m.knew == null) return html + `<p class="ex-sub">${tx('mindKnew')}</p><div class="ex-choices">
          <button class="ghost" data-knew="1">${tx('yes')}</button><button class="ghost" data-knew="0">${tx('no')}</button></div>`;
      // Krok 3: pewność po fakcie
      if (m.after == null) return html + `<p class="ex-sub">${tx('mAfter')}</p>${slider('after', m.before)}
        <button class="primary ex-check" data-act="mafter">${tx('mSave')}</button>`;
      // Krok 4: przy niskiej pewności - propozycja zmiany stanowiska
      if (!m.done) return html + `<p class="ex-sub">${tx('mLowConf')}</p><div class="ex-pos-pick">${q.options.filter(o => o.camp !== from)
          .map(o => posCard(o, 0, `data-to="${o.camp}"`)).join('')}</div>
        <button class="ghost" data-act="mstay">${tx('mStay')}</button>`;
      const delta = m.after - m.before;
      return html + `<div class="ex-score"><b>${tx('mResult', { a: m.before, b: m.after, d: (delta > 0 ? '+' : '') + delta })}</b>
          <div class="mind-bars"><div><span>${tx('mBeforeL')}</span><i style="width:${m.before}%"></i></div><div><span>${tx('mAfterL')}</span><i style="width:${m.after}%"></i></div></div>
          <span>${m.to ? tx('mindChanged', { p: campName(m.to) }) : delta < 0 ? tx('mWeaker') : tx('mindKept')}</span></div>
        <button class="ghost" data-act="again">${tx('again')}</button>`;
    },
    act(a, ex) {
      const m = mindState(ex.q), root = $('exRoot');
      const val = id => Number((root.querySelector(`[data-slider="${id}"]`) || {}).value);
      if (a === 'mbefore') { m.before = val('before'); m.from = campOf(ex.q); }
      if (a === 'mafter') { m.after = val('after'); if (m.after > 40) m.done = true; }
      if (a === 'mstay') m.done = true;
      if (a === 'again') S().mind[ex.q] = { before: null, knew: null, after: null, from: null, to: null, done: false };
    }
  };

  // ═══════════ 4. Wybory z kosztem ═══════════
  // Oczekiwany podział z Twoich osi: waga = 1 + 0,9 × (suma sygnałów), potem skalowanie do 100 mld.
  function budgetExpect() {
    const { scores, count } = App.scores();
    const w = BUDGET.map(b => {
      let sig = 0, known = false;
      Object.entries(b.signal).forEach(([ax, k]) => { if (count[ax]) { sig += k * scores[ax]; known = true; } });
      return { b, w: Math.max(0.15, 1 + 0.9 * sig), known };
    });
    const sum = w.reduce((s, x) => s + x.w, 0);
    return w.map(x => ({ ...x, exp: x.w / sum * BUDGET_TOTAL }));
  }
  const budget = {
    view() {
      const bs = S().budget, alloc = bs.alloc, used = BUDGET.reduce((s, b) => s + (alloc[b.id] || 0), 0), left = BUDGET_TOTAL - used;
      let html = header('menu') + `<h3 class="ex-title">${tx('tBudget')}</h3><p class="ex-intro">${tx('introBudget')}</p>`;
      if (!bs.checked) {
        return html + `<div class="ex-left ${left === 0 ? 'ok' : ''}">${tx('left', { n: left })}</div>
          <div class="ex-budget">${BUDGET.map(b => `<div class="ex-brow">
            <span class="ex-bname">${b.icon} ${esc(tr(b.name))}</span>
            <button class="ghost ex-step" data-b="${b.id}" data-d="-1" ${!(alloc[b.id] > 0) ? 'disabled' : ''}>−</button>
            <span class="ex-bval">${alloc[b.id] || 0} ${tx('mld')}</span>
            <button class="ghost ex-step" data-b="${b.id}" data-d="1" ${left <= 0 ? 'disabled' : ''}>+</button>
            <div class="ex-bbar"><div style="width:${Math.min(100, (alloc[b.id] || 0) / BAR_MAX * 100)}%"></div></div></div>`).join('')}</div>
          <button class="primary ex-check" data-act="bcheck" ${left === 0 ? '' : 'disabled'}>${tx('budgetCheck')}</button>
          ${left !== 0 ? `<p class="hint">${tx('bNeed')}</p>` : ''}`;
      }
      const ex = budgetExpect();
      let ok = 0, n = 0;
      const rows = ex.map(({ b, exp, known }) => {
        const mine = alloc[b.id] || 0, diff = mine - exp;
        let v = tx('bNoData'), cls = 'na';
        if (known) { n++; if (Math.abs(diff) < 6) { v = tx('bOk'); cls = 'ok'; ok++; } else if (diff > 0) { v = tx('bHi'); cls = 'hi'; } else { v = tx('bLo'); cls = 'lo'; } }
        const expWord = !known ? '' : exp > 15 ? tx('bMore') : exp < 10 ? tx('bLess') : tx('bSame');
        const axes = Object.keys(b.signal).map(a => tr(AX[a].name)).join(', ');
        return `<div class="ex-bres ${cls}">
          <div class="ex-bres-top"><b>${b.icon} ${esc(tr(b.name))}</b><span>${mine} ${tx('mld')} · ${tx('bExpect')}: ~${Math.round(exp)} (${expWord})</span></div>
          <div class="ex-bcmp"><div class="mine" style="width:${Math.min(100, mine / BAR_MAX * 100)}%"></div><div class="exp" style="left:${Math.min(99, exp / BAR_MAX * 100)}%"></div></div>
          <p class="ex-bverdict">${v}</p><p class="hint">${tx('bAxes', { axes })}</p></div>`;
      }).join('');
      return html + `<div class="ex-score"><b>${tx('bSummary', { k: ok, n })}</b><span>${tx('bTip')}</span></div>
        <div class="ex-bresults">${rows}</div><button class="ghost" data-act="breset">${tx('bReset')}</button>`;
    }
  };

  // ── Menu i nawigacja ──
  const TYPES = [['defense', 'tDefense', 'dDefense'], ['devil', 'tDevil', 'dDevil'], ['mind', 'tMind', 'dMind'], ['budget', 'tBudget', 'dBudget']];
  const H = { defense, devil, mind };
  const SETS = { defense: EXERCISES, devil: DEVIL, mind: MIND };
  function typeDone(type) {
    const s = S();
    if (type === 'budget') return s.budget.checked ? 1 : 0;
    if (type === 'defense') return EXERCISES.filter(ex => s.checked[ex.q]).length;
    if (type === 'devil') return DEVIL.filter(ex => devilStats(ex).done).length;
    return MIND.filter(ex => s.mind[ex.q] && s.mind[ex.q].done).length;
  }
  function menuHtml() {
    return `<p class="ex-intro">${tx('menuIntro')}</p><div class="ex-types">${TYPES.map(([id, t, d]) => {
      const n = typeDone(id), total = id === 'budget' ? 1 : SETS[id].length;
      return `<button class="ex-type ex-theme-${id}" data-type="${id}"><span class="ex-type-t">${tx(t)}</span><span class="ex-type-d">${tx(d)}</span>
        <span class="ex-status">${n ? `✓ ${n}/${total}` : tx('todo')}</span></button>`;
    }).join('')}${(SZ.EX2_TYPES || []).map(([id, t, d]) => {
      const m = SZ.EX2[id], n = m.done();
      return `<button class="ex-type ex-theme-${id}" data-type="${id}"><span class="ex-type-t">${SZ.EX2_TX(t)}</span><span class="ex-type-d">${SZ.EX2_TX(d)}</span>
        <span class="ex-status">${n ? `✓ ${n}/${m.total}` : tx('todo')}</span></button>`;
    }).join('')}</div>`;
  }

  function render() {
    const root = $('exRoot'); if (!root) return;
    $('exTitle').textContent = tx('title');
    const s = S();
    root.className = s.type ? `ex-theme-${s.type}` : '';
    if (!s.type) { root.innerHTML = menuHtml(); return; }
    if (s.type === 'budget') { root.innerHTML = budget.view(); return; }
    // Ćwiczenia z części 2 (js/exercises-ui-2.js)
    const m2 = SZ.EX2 && SZ.EX2[s.type];
    if (m2) {
      const title = SZ.EX2_TYPES.find(t => t[0] === s.type)[1];
      const inner = m2.view();
      root.innerHTML = (s.type === 'why' && s.whyCur ? '' : header('menu') + `<h3 class="ex-title">${SZ.EX2_TX(title)}</h3>`) + inner;
      return;
    }
    const h = H[s.type] || defense, ex = (SETS[s.type] || []).find(e => e.q === s.cur);
    root.innerHTML = ex ? h.view(ex) : header('menu') + `<h3 class="ex-title">${tx(TYPES.find(t => t[0] === s.type)[1])}</h3>` + h.list();
  }

  function onClick(e) {
    const s = S(), h = H[s.type], ex = (SETS[s.type] || []).find(x => x.q === s.cur);
    const el = sel => e.target.closest(sel);
    let scroll = false;
    if (el('[data-type]')) { s.type = el('[data-type]').dataset.type; s.cur = null; s.whyCur = null; scroll = true; }
    else if (SZ.EX2 && SZ.EX2[s.type] && !(el('[data-act]') && el('[data-act]').dataset.act === 'menu')) {
      const r = SZ.EX2[s.type].click(el, s);
      if (!r) return;
      scroll = r === 'scroll';
    }
    else if (el('[data-ex]')) { s.cur = el('[data-ex]').dataset.ex; scroll = true; }
    else if (el('[data-act]')) {
      const a = el('[data-act]').dataset.act;
      if (a === 'menu') { s.type = null; s.cur = null; scroll = true; }
      else if (a === 'back') { s.cur = null; s.changing = null; scroll = true; }
      else if (a === 'bcheck') { s.budget.checked = true; scroll = true; }
      else if (a === 'breset') { s.budget = { alloc: {}, checked: false }; }
      else if (h && ex) { h.act(a, ex); if (a === 'check') scroll = true; }
    }
    else if (el('[data-pos]') && ex) { App.setAnswer(ex.q, Number(el('[data-pos]').dataset.pos)); s.changing = null; }
    else if (el('[data-arg]') && ex && h.toggle) h.toggle(ex, el('[data-arg]').dataset.arg);
    else if (el('[data-target]') && ex) { Object.assign(devilState(ex.q), { target: el('[data-target]').dataset.target, idx: 0, ans: {}, reveal: false }); }
    else if (el('[data-dv]') && ex) {
      const d = devilState(ex.q), card = order(ex)[d.idx];
      d.ans[card.id] = el('[data-dv]').dataset.dv === '1'; d.reveal = true;
    }
    else if (el('[data-knew]') && ex) { mindState(ex.q).knew = el('[data-knew]').dataset.knew === '1'; }
    else if (el('[data-to]') && ex) {
      const m = mindState(ex.q), to = el('[data-to]').dataset.to, q = Q[ex.q];
      m.to = to; m.done = true;
      App.setAnswer(ex.q, q.options.findIndex(o => o.camp === to));   // zmiana zdania zmienia też odpowiedź w teście
    }
    else if (el('[data-b]')) {
      const b = el('[data-b]').dataset.b, d = Number(el('[data-b]').dataset.d) * STEP, al = s.budget.alloc;
      const used = BUDGET.reduce((sum, x) => sum + (al[x.id] || 0), 0);
      if (d > 0 && used + d > BUDGET_TOTAL) return;
      al[b] = Math.max(0, (al[b] || 0) + d);
    }
    else return;
    App.save(); render();
    if (scroll) window.scrollTo(0, 0);
  }
  // Suwaki: pokazuj wartość na bieżąco, bez przerysowywania (żeby nie przerywać przeciągania).
  function onInput(e) {
    const sl = e.target.closest('[data-slider]'); if (!sl) return;
    const out = $('exRoot').querySelector(`[data-out="${sl.dataset.slider}"]`);
    if (out) out.textContent = sl.value + '%';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const r = $('exRoot');
    if (r) { r.addEventListener('click', onClick); r.addEventListener('input', onInput); render(); }
  });
  SZ.ExUI = { render };
})();
