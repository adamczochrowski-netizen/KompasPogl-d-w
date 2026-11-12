// Zakładka „Ćwiczenia”: na razie jedno ćwiczenie - „Obrona argumentów”.
// Wybierasz swoje stanowisko (albo bierzemy je z testu), potem do 5 argumentów na jego obronę.
// Po sprawdzeniu widać: które argumenty są mocne, które podchwytliwe (błąd logiczny, nieprawda,
// argument za innym stanowiskiem), co kłóci się z Twoimi innymi odpowiedziami i co się wzajemnie wyklucza.
window.SZ = window.SZ || {};

(function () {
  const App = SZ.App, { CAMPS, FALLACIES, EXERCISES } = SZ;
  const Q = Object.fromEntries(SZ.QUESTIONS.map(q => [q.id, q]));
  const MAX = 5;
  const $ = id => document.getElementById(id);

  const TXT = {
    pl: {
      title: '🧠 Obrona argumentów',
      intro: 'Sprawdź, czy umiesz obronić swoje poglądy. Przy każdym pytaniu wybierz do 5 argumentów, którymi przekonałbyś kogoś do swojego stanowiska. Uwaga: część argumentów jest podchwytliwa - brzmią dobrze, ale zawierają błąd logiczny, nieprawdziwy fakt albo przemawiają za czymś innym.',
      done: 'Zrobione', todo: 'Do zrobienia', strong: 'mocnych',
      back: '← Lista ćwiczeń', yourPos: 'Twoje stanowisko', pickPos: 'Najpierw wybierz swoje stanowisko:',
      pickArgs: 'Wybierz do {n} argumentów, którymi go obronisz:', chosen: 'Wybrane: {k} / {n}',
      check: 'Sprawdź moją obronę', again: '🔁 Spróbuj jeszcze raz', changePos: 'zmień',
      vGood: '✅ Mocny argument', vFallacy: '⚠️ Błąd logiczny', vFalse: '❌ Nieprawda', vOther: '↔️ To argument za innym stanowiskiem',
      supportsOther: 'Pasuje raczej do: {camps}.',
      score: 'Mocnych argumentów: {g} z {k}', grade0: 'Ta obrona by nie przekonała - prawie wszystkie argumenty mają haczyk.',
      grade1: 'Niezła próba, ale część argumentów łatwo zbić.', grade2: 'Dobra obrona! Większość argumentów jest rzeczowa.', grade3: 'Świetna obrona - same mocne argumenty.',
      conflictsT: '🔁 Kłóci się z Twoimi innymi odpowiedziami', excludesT: '⛔ Te argumenty się wykluczają', missedT: '💡 Mocne argumenty za Twoim stanowiskiem, których nie wybrałeś',
      noConflicts: 'Twoje argumenty nie kłócą się z innymi Twoimi odpowiedziami.',
      inQuestion: 'Pytanie: „{q}”', yourAnswer: 'Twoja odpowiedź: {a}'
    },
    en: {
      title: '🧠 Defend your position',
      intro: 'Check whether you can defend your views. For each question pick up to 5 arguments you would use to convince someone. Careful: some arguments are tricky - they sound good but contain a logical fallacy, a false fact, or actually support something else.',
      done: 'Done', todo: 'To do', strong: 'strong',
      back: '← Exercise list', yourPos: 'Your position', pickPos: 'First choose your position:',
      pickArgs: 'Pick up to {n} arguments to defend it:', chosen: 'Chosen: {k} / {n}',
      check: 'Check my defence', again: '🔁 Try again', changePos: 'change',
      vGood: '✅ Strong argument', vFallacy: '⚠️ Logical fallacy', vFalse: '❌ False', vOther: '↔️ This argues for a different position',
      supportsOther: 'It fits better with: {camps}.',
      score: 'Strong arguments: {g} of {k}', grade0: 'This defence would not convince anyone - almost every argument has a catch.',
      grade1: 'A decent try, but some arguments are easy to knock down.', grade2: 'Good defence! Most arguments are solid.', grade3: 'Excellent defence - only strong arguments.',
      conflictsT: '🔁 Clashes with your other answers', excludesT: '⛔ These arguments contradict each other', missedT: '💡 Strong arguments for your position you did not pick',
      noConflicts: 'Your arguments do not clash with your other answers.',
      inQuestion: 'Question: "{q}"', yourAnswer: 'Your answer: {a}'
    }
  };
  const tx = (k, vars = {}) => (TXT[App.state.lang] || TXT.pl)[k].replace(/\{(\w+)\}/g, (_, v) => vars[v] != null ? vars[v] : '');
  const tr = App.tr, esc = App.esc;

  // Stan ćwiczeń zapisywany razem z resztą: { cur, picks: {qid: [ids]}, checked: {qid: true} }
  const S = () => {
    const st = App.state;
    if (!st.ex || typeof st.ex !== 'object') st.ex = { cur: null, picks: {}, checked: {} };
    return st.ex;
  };
  const campOf = qid => { const q = Q[qid], a = App.state.answers[qid]; return q && q.options[a] ? q.options[a].camp : null; };
  const supports = (arg, camp) => !!camp && (arg.supports || []).some(c => c === camp || c === CAMPS[camp].group);
  const verdict = (arg, camp) => arg.kind === 'fallacy' ? 'fallacy' : arg.kind === 'false' ? 'false' : supports(arg, camp) ? 'good' : 'other';
  // Kolejność argumentów: wymieszana, ale stała dla danego pytania (żeby podchwytliwe nie stały razem).
  const order = ex => ex.args.map((a, i) => [a, (i * 7 + ex.q.length * 3) % ex.args.length]).sort((x, y) => x[1] - y[1]).map(x => x[0]);

  function stats(ex) {
    const camp = campOf(ex.q), picks = S().picks[ex.q] || [];
    const good = picks.filter(id => verdict(ex.args.find(a => a.id === id), camp) === 'good').length;
    return { good, total: picks.length };
  }

  function listHtml() {
    return `<p class="ex-intro">${tx('intro')}</p>
      <div class="ex-list">${EXERCISES.map(ex => {
        const q = Q[ex.q], done = S().checked[ex.q], st = stats(ex);
        return `<button class="ex-card ${done ? 'done' : ''}" data-ex="${ex.q}">
          <span class="ex-q">${esc(tr(q.text))}</span>
          <span class="ex-status">${done ? `✓ ${tx('done')} · ${st.good}/${st.total} ${tx('strong')}` : tx('todo')}</span>
        </button>`;
      }).join('')}</div>`;
  }

  function exerciseHtml(ex) {
    const q = Q[ex.q], s = S(), camp = campOf(ex.q), picks = s.picks[ex.q] || [], checked = s.checked[ex.q];
    let html = `<button class="ghost ex-back" data-act="back">${tx('back')}</button>
      <h3 class="ex-title">${esc(tr(q.text))}</h3>`;
    if (!camp || s.changing === ex.q) {
      return html + `<p class="ex-sub">${tx('pickPos')}</p><div class="ex-pos-pick">${q.options.map((o, i) =>
        `<button class="pos-card" data-pos="${i}" style="--camp:${CAMPS[o.camp].color}"><span class="camp-tag">${tr(CAMPS[o.camp].name)}</span><span class="pos-text">${esc(tr(o.text))}</span></button>`).join('')}</div>`;
    }
    const o = q.options[App.state.answers[ex.q]];
    html += `<div class="ex-mypos" style="--camp:${CAMPS[camp].color}"><span class="lbl">${tx('yourPos')} · <b style="color:var(--camp)">${tr(CAMPS[camp].name)}</b></span>
      ${esc(tr(o.text))} <button class="linkish" data-act="changepos">${tx('changePos')}</button></div>`;
    if (!checked) {
      html += `<p class="ex-sub">${tx('pickArgs', { n: MAX })} <span class="ex-count">${tx('chosen', { k: picks.length, n: MAX })}</span></p>
        <div class="ex-args">${order(ex).map(a => `<button class="ex-arg ${picks.includes(a.id) ? 'sel' : ''}" data-arg="${a.id}"
          ${!picks.includes(a.id) && picks.length >= MAX ? 'disabled' : ''}>${esc(tr(a.text))}</button>`).join('')}</div>
        <button class="primary ex-check" data-act="check" ${picks.length ? '' : 'disabled'}>${tx('check')}</button>`;
      return html;
    }
    return html + resultHtml(ex, camp, picks);
  }

  function resultHtml(ex, camp, picks) {
    const args = picks.map(id => ex.args.find(a => a.id === id));
    const st = stats(ex), ratio = st.total ? st.good / st.total : 0;
    const grade = ratio >= 1 ? 'grade3' : ratio >= .6 ? 'grade2' : ratio >= .3 ? 'grade1' : 'grade0';
    const campNames = cs => cs.map(c => tr((CAMPS[c] || SZ.CAMP_GROUPS.find(g => g.id === c) || {}).name)).filter(Boolean).join(', ');
    const items = args.map(a => {
      const v = verdict(a, camp);
      let why = '';
      if (v === 'fallacy') { const f = FALLACIES[a.fallacy]; why = `<b>${tr(f)}</b> - ${tr(f.d)}`; }
      else if (v === 'false') why = tr(a.note);
      else if (v === 'good') why = tr(a.note);
      else why = `${tx('supportsOther', { camps: campNames(a.supports || []) })} ${a.note ? tr(a.note) : ''}`;
      return `<div class="ex-res v-${v}"><div class="ex-res-head">${tx('v' + v[0].toUpperCase() + v.slice(1))}</div>
        <p class="ex-res-arg">„${esc(tr(a.text))}”</p><p class="ex-res-why">${why}</p></div>`;
    }).join('');
    // Sprzeczności z innymi odpowiedziami
    const conflicts = [];
    args.forEach(a => (a.conflicts || []).forEach(c => {
      const other = campOf(c.q);
      if (other && c.camps.includes(other)) conflicts.push({ a, c, other });
    }));
    const conflictsHtml = conflicts.length ? conflicts.map(({ a, c }) => `<div class="ex-note warn">
        <p>„${esc(tr(a.text))}”</p><p>${tr(c.note)}</p>
        <p class="hint">${tx('inQuestion', { q: esc(tr(Q[c.q].text)) })} · ${tx('yourAnswer', { a: esc(App.answerLabel(Q[c.q], App.state.answers[c.q])) })}</p></div>`).join('')
      : `<p class="hint">${tx('noConflicts')}</p>`;
    // Pary wykluczające się
    const ex2 = (ex.excludes || []).filter(([x, y]) => picks.includes(x) && picks.includes(y));
    const excludesHtml = ex2.map(([x, y, note]) => `<div class="ex-note bad">
        <p>„${esc(tr(ex.args.find(a => a.id === x).text))}”<br>⇄ „${esc(tr(ex.args.find(a => a.id === y).text))}”</p><p>${tr(note)}</p></div>`).join('');
    // Mocne argumenty, których zabrakło
    const missed = ex.args.filter(a => a.kind === 'good' && supports(a, camp) && !picks.includes(a.id));
    return `<div class="ex-score"><b>${tx('score', { g: st.good, k: st.total })}</b><span>${tx(grade)}</span></div>
      <div class="ex-results">${items}</div>
      ${ex2.length ? `<h4 class="ex-h">${tx('excludesT')}</h4>${excludesHtml}` : ''}
      <h4 class="ex-h">${tx('conflictsT')}</h4>${conflictsHtml}
      ${missed.length ? `<h4 class="ex-h">${tx('missedT')}</h4><ul class="ex-missed">${missed.map(a => `<li>${esc(tr(a.text))}</li>`).join('')}</ul>` : ''}
      <button class="ghost" data-act="again">${tx('again')}</button>`;
  }

  function render() {
    const root = $('exRoot'); if (!root) return;
    $('exTitle').textContent = tx('title');
    const s = S(), ex = EXERCISES.find(e => e.q === s.cur);
    root.innerHTML = ex ? exerciseHtml(ex) : listHtml();
  }

  function onClick(e) {
    const s = S(), ex = EXERCISES.find(x => x.q === s.cur);
    const card = e.target.closest('[data-ex]');
    if (card) { s.cur = card.dataset.ex; App.save(); render(); window.scrollTo(0, 0); return; }
    const act = e.target.closest('[data-act]');
    if (act) {
      const a = act.dataset.act;
      if (a === 'back') s.cur = null;
      if (a === 'check') s.checked[s.cur] = true;
      if (a === 'again') { s.checked[s.cur] = false; s.picks[s.cur] = []; }
      if (a === 'changepos') { s.changing = s.cur; s.checked[s.cur] = false; s.picks[s.cur] = []; }
      App.save(); render();
      if (a === 'check' || a === 'back') window.scrollTo(0, 0);
      return;
    }
    const pos = e.target.closest('[data-pos]');
    if (pos && ex) {
      App.setAnswer(ex.q, Number(pos.dataset.pos));   // odpowiedź liczy się też do testu i wyniku
      s.changing = null; App.save(); render(); return;
    }
    const arg = e.target.closest('[data-arg]');
    if (arg && ex) {
      const picks = s.picks[ex.q] = s.picks[ex.q] || [], id = arg.dataset.arg;
      if (picks.includes(id)) picks.splice(picks.indexOf(id), 1);
      else if (picks.length < MAX) picks.push(id);
      App.save(); render();
    }
  }

  document.addEventListener('DOMContentLoaded', () => { const r = $('exRoot'); if (r) { r.addEventListener('click', onClick); render(); } });
  SZ.ExUI = { render };
})();
