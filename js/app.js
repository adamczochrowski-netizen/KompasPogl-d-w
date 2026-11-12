(function () {
  const { AXES, QUESTIONS, TOPICS = [], IDEOLOGIES = [], PARTIES, PEOPLE, FICTION, REGIONS, POLE_INFO, CAMPS, CAMP_GROUPS, I18N, Charts } = SZ;
  const STORE_KEY = 'kompas-pogladow-v1';
  const DATA_VERSION = 2;   // 2 = pytania w formie stanowisk (1 = skala zgody)
  // Wersje list stanowisk: { pytanie: numer, pod który wstawiono nowe stanowisko } (patrz migrateOptions).
  const OPTION_INSERTS = {
    2: { x_coal: 0, x_nuclear: 0, x_migration: 0, x_cars: 0, x_cash: 0, x_stateco: 1 }   // podział lewicy
  };
  const OPTIONS_VERSION = 2;
  const VALUES = [-2, -1, 0, 1, 2];
  const LIKERT = { '-2': 'a_m2', '-1': 'a_m1', '0': 'a_0', '1': 'a_p1', '2': 'a_p2' };
  const DILEMMA = { '-2': 'd_m2', '-1': 'd_m1', '0': 'd_0', '1': 'd_p1', '2': 'd_p2' };
  const IMPORTANCE = [[0.5, 'imp_low'], [1, 'imp_mid'], [2, 'imp_high']];
  const ANSWER_COLORS = ['#f87171', '#fca5a5', '#a1a1aa', '#86efac', '#4ade80'];
  const MIN_FOR_MATCH = Math.min(10, Math.ceil(SZ.QUESTIONS.length * 0.6));   // tyle odpowiedzi, zanim pokażemy partie i ludzi
  const PARTY_THRESHOLD = 65;   // % podobieństwa, od którego partia "pasuje"
  const $ = id => document.getElementById(id);
  const Q = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  // Główny test = pytania bez flagi pool. Pytania z pool: true są tylko w Tematach.
  const TEST = QUESTIONS.filter(q => !q.pool);
  const TOPIC_DRAW = 10;   // tyle pytań losujemy przy jednym podejściu do tematu
  const LQ = Object.fromEntries((SZ.LEGACY || []).map(q => [q.id, q]));   // stare pytania ze skalą
  const isChoice = q => q.type === 'scenario' || q.type === 'positions';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ── Stan ──
  const defaults = {
    lang: 'pl', answers: {}, importance: {}, order: [], deck: null, pos: 0, mode: 'full', topic: null,
    bubble: true, cx: 'econ', cy: 'power', snapshots: [], compare: null,
    collapsed: { history: true, snap: true, table: true }, seenGuide: false, tab: 'quiz'
  };
  let state = Object.assign({}, defaults, load());
  if (!state.collapsed || typeof state.collapsed !== 'object') state.collapsed = Object.assign({}, defaults.collapsed);
  ['answers', 'importance'].forEach(k => { if (!state[k] || typeof state[k] !== 'object') state[k] = {}; });
  if (!Array.isArray(state.snapshots)) state.snapshots = [];
  if (!Array.isArray(state.order)) state.order = [];
  migrateLegacy();
  migrateOptions();
  Object.keys(state.answers).forEach(id => { if (!Q[id]) delete state.answers[id]; });
  state.order = state.order.filter(id => state.answers[id] != null);
  // Tryby: 'full' = Test (wszystkie pytania), 'topic' = pytania z jednego tematu. Dawny tryb 'quick' → Test.
  if (state.mode !== 'topic') state.mode = 'full';
  const TOPIC = Object.fromEntries(TOPICS.map(x => [x.id, x]));
  if (state.topic && !TOPIC[state.topic]) state.topic = null;
  const topicIds = id => TOPIC[id] ? TOPIC[id].ids.filter(q => Q[q]) : [];
  if (!AXES.some(a => a.id === state.cx)) state.cx = 'econ';
  if (!AXES.some(a => a.id === state.cy)) state.cy = 'power';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }

  // Odpowiedzi ze starej wersji (skala zgody) zapisujemy jako migawkę do porównania i zaczynamy od nowa.
  function migrateLegacy() {
    if (state.version === DATA_VERSION) return;
    const oldIds = Object.keys(state.answers).filter(id => LQ[id]);
    if (oldIds.length) {
      const res = computeScores(oldIds, state.answers, state.importance, LQ);
      const id = 'legacy' + Date.now();
      state.snapshots.push({
        id, kind: 'self', date: new Date().toISOString(), scores: res.scores, count: res.count,
        name: state.lang === 'en' ? 'Scale version (old)' : 'Wersja ze skalą (stara)'
      });
      state.compare = id;
    }
    state.answers = {}; state.importance = {}; state.order = []; state.deck = null; state.pos = 0;
    state.version = DATA_VERSION;
    save();
  }
  // Odpowiedź to numer stanowiska. Gdy dopisujemy nowe stanowisko w środku listy,
  // przesuwamy zapisane numery, żeby wskazywały to samo stanowisko co wcześniej.
  // Klucz: wersja opcji → { pytanie: numer, pod który wstawiono nowe stanowisko }.
  function migrateOptions() {
    const from = state.optVersion || 1;
    if (from >= OPTIONS_VERSION) return;
    for (let v = from + 1; v <= OPTIONS_VERSION; v++) {
      Object.entries(OPTION_INSERTS[v] || {}).forEach(([id, at]) => {
        if (typeof state.answers[id] === 'number' && state.answers[id] >= at) state.answers[id]++;
      });
    }
    state.optVersion = OPTIONS_VERSION;
    save();
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* tryb prywatny itp. */ }
  }

  function t(key, vars) {
    let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.pl[key] || key;
    if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.split('{' + k + '}').join(v); });
    return s;
  }
  const tr = obj => obj == null ? '' : typeof obj === 'string' ? obj : (obj[state.lang] || obj.pl || '');
  const axisById = id => AXES.find(a => a.id === id);

  // ── Okienko w stronie ──
  // Zastępuje confirm/prompt/alert - wbudowane przeglądarki (np. podgląd w aplikacji) potrafią je blokować.
  function dialog({ html, input, buttons }) {
    return new Promise(resolve => {
      const modal = $('modal'), inp = $('modalInput');
      $('modalBody').innerHTML = html;
      inp.hidden = input == null;
      if (input != null) inp.value = input;
      $('modalActions').innerHTML = buttons.map((b, i) => `<button data-i="${i}" class="${b.cls || ''}">${b.label}</button>`).join('');
      const close = val => {
        modal.hidden = true;
        modal.onclick = null; document.removeEventListener('keydown', onKey, true);
        resolve(val);
      };
      const onKey = e => {
        if (e.key === 'Escape') { e.stopPropagation(); close(null); }
        else if (e.key === 'Enter' && input != null) { e.stopPropagation(); close(inp.value); }
        else e.stopPropagation();
      };
      modal.onclick = e => {
        if (e.target === modal) return close(null);
        const b = e.target.closest('button[data-i]');
        if (b) { const def = buttons[b.dataset.i]; close(def.value === 'input' ? inp.value : def.value); }
        // klik w treści okienka (np. pytanie na liście) obsługuje wołający przez onBody
      };
      document.addEventListener('keydown', onKey, true);
      modal.hidden = false;
      if (input != null) { inp.focus(); inp.select(); } else $('modalActions').lastElementChild.focus();
    });
  }
  const confirmBox = (text, okLabel, danger) => dialog({
    html: `<p>${text}</p>`,
    buttons: [{ label: t('cancel'), value: false, cls: 'ghost' }, { label: okLabel || t('ok'), value: true, cls: danger ? 'danger-btn' : 'primary' }]
  });
  const promptBox = (text, def) => dialog({
    html: `<p>${text}</p>`, input: def,
    buttons: [{ label: t('cancel'), value: null, cls: 'ghost' }, { label: t('ok'), value: 'input', cls: 'primary' }]
  });
  const infoBox = (html, label) => dialog({ html, buttons: [{ label: label || t('close'), value: true, cls: 'primary' }] });

  // ── Punktacja ──
  // Maksymalna |waga| każdej osi, której dotyczy pytanie.
  function axisWeights(q) {
    const m = {};
    const list = isChoice(q) ? q.options.map(o => o.effects) : [q.effects];
    list.forEach(eff => Object.entries(eff).forEach(([a, w]) => { m[a] = Math.max(m[a] || 0, Math.abs(w)); }));
    return m;
  }
  function primaryAxis(q) {
    const m = axisWeights(q);
    return Object.keys(m).sort((a, b) => m[b] - m[a])[0];
  }
  // Wkład odpowiedzi w każdą oś: c = przesunięcie, m = maksymalne możliwe przesunięcie.
  function contributions(q, ans, imp) {
    if (ans == null) return [];
    imp = imp || 1;
    if (isChoice(q)) {
      const opt = q.options[ans];
      if (!opt) return [];
      // Stanowiska mają bezwzględny „adres” (-1..1), scenariusze są skalowane do najmocniejszej opcji.
      return Object.entries(axisWeights(q)).map(([ax, mw]) =>
        ({ ax, c: 2 * (opt.effects[ax] || 0) * imp, m: 2 * (q.type === 'positions' ? 1 : mw) * imp }));
    }
    return Object.entries(q.effects).map(([ax, w]) => ({ ax, c: ans * w * imp, m: 2 * Math.abs(w) * imp }));
  }
  // score osi = suma wkładów / suma maksimów → -1..1; spójność = |suma| / suma |wkładów|
  function computeScores(ids, answers = state.answers, importance = state.importance, qmap = Q) {
    const sum = {}, max = {}, abs = {}, count = {};
    AXES.forEach(a => { sum[a.id] = 0; max[a.id] = 0; abs[a.id] = 0; count[a.id] = 0; });
    ids.forEach(id => {
      const q = qmap[id]; if (!q) return;
      contributions(q, answers[id], importance[id]).forEach(({ ax, c, m }) => {
        if (!(ax in sum)) return;
        sum[ax] += c; max[ax] += m; abs[ax] += Math.abs(c); count[ax]++;
      });
    });
    const scores = {}, consistency = {};
    AXES.forEach(a => {
      scores[a.id] = max[a.id] ? sum[a.id] / max[a.id] : 0;
      consistency[a.id] = abs[a.id] ? Math.abs(sum[a.id]) / abs[a.id] : null;
    });
    return { scores, count, consistency };
  }
  const current = () => computeScores(Object.keys(state.answers));

  function historySeries() {
    const series = [{}];
    state.order.forEach((_, i) => {
      const { scores, count } = computeScores(state.order.slice(0, i + 1));
      const s = {};
      AXES.forEach(a => { s[a.id] = count[a.id] ? scores[a.id] : null; });
      series.push(s);
    });
    return series;
  }

  // Podobieństwo do profilu (archetyp, partia, osoba) - tylko na osiach z odpowiedziami.
  function similarity(scores, count, v) {
    const used = AXES.filter(a => count[a.id]);
    if (!used.length) return 0;
    const rms = Math.sqrt(used.reduce((s, a) => s + Math.pow(scores[a.id] - (v[a.id] || 0), 2), 0) / used.length);
    return Math.max(0, Math.round((1 - rms / 1.2) * 100));
  }
  const rank = (list, scores, count) => list.map(x => ({ x, pct: similarity(scores, count, x.v) })).sort((a, b) => b.pct - a.pct);

  function intensity(v) {
    const a = Math.abs(v);
    if (a < .12) return null;
    if (a < .3) return t('mild');
    if (a < .55) return t('moderate');
    if (a < .8) return t('strong');
    return t('extreme');
  }

  function answerLabel(q, v) {
    if (v == null) return t('noAnswer');
    if (q.type === 'positions') { const o = q.options[v]; return o ? `${tr(CAMPS[o.camp].name)}: ${tr(o.text)}` : ''; }
    if (q.type === 'scenario') return tr(q.options[v] && q.options[v].text);
    return t((q.type === 'dilemma' ? DILEMMA : LIKERT)[v]);
  }
  const impLabel = v => t((IMPORTANCE.find(([x]) => x === (v || 1)) || IMPORTANCE[1])[1]);
  // Hasło Wikipedii w języku apki, a gdy go brak - po polsku.
  const wikiLang = w => (w[state.lang] ? state.lang : 'pl');
  const wikiTitle = w => w[wikiLang(w)];
  const wikiUrl = w => `https://${wikiLang(w)}.wikipedia.org/wiki/${encodeURIComponent(wikiTitle(w).replace(/ /g, '_'))}`;

  // ── Talia pytań (tryb + losowa kolejność) ──
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const inTopic = () => state.mode === 'topic' && state.topic;
  function wantIds() {
    return inTopic() ? topicIds(state.topic) : TEST.map(q => q.id);
  }
  function buildDeck() {
    const ids = wantIds();
    // W temacie losujemy TOPIC_DRAW pytań: najpierw te, na które jeszcze nie ma odpowiedzi.
    state.deck = inTopic()
      ? shuffle(ids.filter(id => state.answers[id] == null)).concat(shuffle(ids.filter(id => state.answers[id] != null))).slice(0, TOPIC_DRAW)
      : shuffle(ids);
    const i = state.deck.findIndex(id => state.answers[id] == null);
    state.pos = i < 0 ? 0 : i;
    state.justFinished = false;
  }
  const deckOk = Array.isArray(state.deck) && state.deck.every(id => Q[id]) && (inTopic()
    ? state.deck.length === Math.min(TOPIC_DRAW, wantIds().length) && state.deck.every(id => wantIds().includes(id))
    : state.deck.length === wantIds().length && wantIds().every(id => state.deck.includes(id)));
  if (!deckOk) buildDeck();
  if (!(state.pos >= 0 && state.pos < state.deck.length)) state.pos = 0;
  const curQ = () => Q[state.deck[state.pos]];
  // Kolejność kart stanowisk: stała, jak w danych (lewica → centrum → prawica; odłamy obozu obok siebie).
  // (Losowe tasowanie było testowane i wycofane - rozdzielało odłamy tego samego obozu.)
  const cardOrder = q => q.options.map((_, i) => i);
  const compareProfile = () => state.snapshots.find(s => s.id === state.compare) || null;

  // ── Statyczne napisy ──
  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.title = t('appTitle');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('#lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === state.lang));
    document.querySelector('#mode [data-mode="full"]').textContent = `${t('modeTest')} (${TEST.length})`;
    document.querySelector('#mode [data-mode="topic"]').textContent = `${t('modeTopics')} (${TOPICS.length})`;
    ['selX', 'selY'].forEach(id => {
      $(id).innerHTML = AXES.map(a => `<option value="${a.id}">${tr(a.name)}</option>`).join('');
    });
    $('selX').value = state.cx; $('selY').value = state.cy;
    $('impSeg').innerHTML = IMPORTANCE.map(([v, k]) => `<button data-imp="${v}">${t(k)}</button>`).join('');
    document.querySelectorAll('.collapse-btn').forEach(b => { b.title = t('collapse'); });
    buildAxes();
  }

  // ── Zakładki na telefonie: każda sekcja ma data-view z listą zakładek, w których jest widoczna ──
  const isPhone = () => window.matchMedia('(max-width: 760px)').matches;
  function applyTab() {
    document.body.dataset.tab = state.tab;
    document.querySelectorAll('[data-view]').forEach(el =>
      el.classList.toggle('tab-hidden', !el.dataset.view.split(' ').includes(state.tab)));
    document.querySelectorAll('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab));
  }
  function setTab(tab) {
    if (state.tab === tab) return;
    state.tab = tab; save(); applyTab();
    window.scrollTo(0, 0);
    renderAll();   // wykresy trzeba narysować, gdy ich zakładka stanie się widoczna
  }

  // ── Zwijane sekcje ──
  function setupCollapse() {
    document.querySelectorAll('[data-sec]').forEach(sec => {
      const head = sec.querySelector('.card-head');
      const btn = document.createElement('button');
      btn.className = 'collapse-btn'; btn.textContent = '▾';
      head.appendChild(btn);
      const toggle = () => {
        state.collapsed[sec.dataset.sec] = !state.collapsed[sec.dataset.sec];
        save(); applyCollapse();
        if (!state.collapsed[sec.dataset.sec]) renderAll();   // wykresy trzeba przerysować po rozwinięciu
      };
      btn.onclick = toggle;
      head.querySelector('h2').onclick = toggle;
    });
    applyCollapse();
  }
  function applyCollapse() {
    document.querySelectorAll('[data-sec]').forEach(sec => sec.classList.toggle('collapsed', !!state.collapsed[sec.dataset.sec]));
  }

  // ── Okno osi: co oznacza i skąd wynik ──
  function showAxis(id) {
    const a = axisById(id), { scores, count } = current(), v = scores[id];
    const info = POLE_INFO[id] || {};
    const items = Object.keys(state.answers).map(qid => {
      const q = Q[qid], c = contributions(q, state.answers[qid], state.importance[qid]).find(x => x.ax === id);
      return c && c.c !== 0 ? { q, c: c.c } : null;
    }).filter(Boolean).sort((x, y) => Math.abs(y.c) - Math.abs(x.c)).slice(0, 8);
    const pct = (v + 1) / 2 * 100;
    const html = `
      <h3 style="color:${a.color}">${tr(a.name)}</h3>
      <p>${tr(a.desc)}</p>
      <div class="poles">
        <div style="border-color:${a.negColor}"><b style="color:${a.negColor}">← ${tr(a.neg)}</b>${tr(info.neg)}</div>
        <div style="border-color:${a.posColor}"><b style="color:${a.posColor}">${tr(a.pos)} →</b>${tr(info.pos)}</div>
      </div>
      <h3>${t('axisWhy')}</h3>
      ${count[id] ? `
        <div class="track modal-track"><div class="center"></div>
          <div class="fill" style="left:${Math.min(50, pct)}%;width:${Math.abs(pct - 50)}%;background:${v < 0 ? a.negColor : a.posColor}"></div>
          <div class="marker" style="left:${pct}%"></div></div>
        <p class="hint">${t('axisScore')}: <b>${v > 0 ? '+' : ''}${Math.round(v * 100)}</b> · ${count[id]} ${t('answers')}</p>
        <div class="why-list">${items.map(({ q, c }) => {
          const pole = c > 0 ? a.pos : a.neg, col = c > 0 ? a.posColor : a.negColor;
          return `<div class="why-item" data-id="${q.id}">
            <div>${esc(tr(q.text))}<div class="ans">${esc(answerLabel(q, state.answers[q.id]))}</div></div>
            <span class="push" style="color:${col}">${c > 0 ? '→' : '←'} ${tr(pole)} ${Math.abs(c) >= 1.5 ? '••' : '•'}</span>
          </div>`;
        }).join('')}</div>` : `<p class="hint">${t('axisNoData')}</p>`}`;
    const p = infoBox(html);
    // Klik w pytanie na liście przenosi do niego.
    $('modalBody').querySelectorAll('.why-item').forEach(el => {
      el.onclick = () => { $('modalActions').querySelector('button').click(); goToId(el.dataset.id); };
    });
    return p;
  }

  // ── Dwutorowe paski ──
  function buildAxes() {
    $('axes').innerHTML = AXES.map(a => `
      <div class="axis-row" id="ax-${a.id}" title="${esc(tr(a.desc))}">
        <div class="axis-name"></div>
        <div class="pole neg" style="color:${a.negColor}">${tr(a.neg)}</div>
        <div class="track"><div class="center"></div><div class="fill"></div><div class="ghost-marker" hidden></div><div class="marker"></div></div>
        <div class="pole pos" style="color:${a.posColor}">${tr(a.pos)}</div>
      </div>`).join('');
  }

  function renderAxes(scores, count, consistency = {}) {
    const cmp = compareProfile();
    AXES.forEach(a => {
      const row = $('ax-' + a.id), v = scores[a.id], pct = (v + 1) / 2 * 100;
      const track = row.querySelector('.track'), fill = row.querySelector('.fill'), mk = row.querySelector('.marker');
      track.classList.toggle('empty', !count[a.id]);
      fill.style.left = Math.min(50, pct) + '%';
      fill.style.width = Math.abs(pct - 50) + '%';
      fill.style.background = v < 0 ? `linear-gradient(90deg, ${a.negColor}, transparent)` : `linear-gradient(90deg, transparent, ${a.posColor})`;
      mk.style.left = pct + '%';
      mk.style.color = v < 0 ? a.negColor : v > 0 ? a.posColor : '#fff';
      const gm = row.querySelector('.ghost-marker');
      gm.hidden = !cmp;
      if (cmp) gm.style.left = (((cmp.scores[a.id] || 0) + 1) / 2 * 100) + '%';
      row.querySelector('.pole.neg').style.opacity = v < -.05 ? 1 : .45;
      row.querySelector('.pole.pos').style.opacity = v > .05 ? 1 : .45;
      const strength = count[a.id] ? `${v > 0 ? '+' : ''}${Math.round(v * 100)} · ${count[a.id]} ${t('answers')}` : '';
      row.querySelector('.axis-name').textContent = tr(a.name) + (strength ? '  ·  ' + strength : '');
      row.classList.toggle('unsure', count[a.id] >= 2 && consistency[a.id] != null && consistency[a.id] < .4);
    });
  }

  function summaryHtml(scores, count, consistency) {
    const parts = AXES.filter(a => count[a.id]).map(a => {
      const v = scores[a.id], lvl = intensity(v);
      if (!lvl) {
        const undecided = count[a.id] >= 2 && consistency[a.id] != null && consistency[a.id] < .4;
        return `${tr(a.name)}: <b>${undecided ? t('undecided') : t('center')}</b>`;
      }
      const pole = v < 0 ? a.neg : a.pos, col = v < 0 ? a.negColor : a.posColor;
      return `${tr(a.name)}: ${lvl} <b style="color:${col}">${tr(pole)}</b>`;
    });
    return parts.length ? parts.join(' &nbsp;·&nbsp; ') : '';
  }

  function renderSummary(scores, count, consistency) {
    $('summary').innerHTML = summaryHtml(scores, count, consistency) || `<span class="hint">${t('summaryEmpty')}</span>`;
    const n = state.deck.filter(id => state.answers[id] != null).length;
    $('progressFill').style.width = (n / state.deck.length * 100) + '%';
    $('progressTxt').textContent = `${n} / ${state.deck.length}`;
  }

  // ── Pytanie + dymek ──
  // ── Tematy: kafelki z postępem i rozkładem obozów w danym temacie ──
  function topicStats(id) {
    const ids = topicIds(id), counts = { left: 0, center: 0, right: 0 };
    let n = 0;
    ids.forEach(qid => {
      const q = Q[qid], o = q.options && q.options[state.answers[qid]];
      if (!o) return;
      n++; counts[CAMPS[o.camp].group]++;
    });
    const dominant = n ? CAMP_GROUPS.slice().sort((a, b) => counts[b.id] - counts[a.id])[0] : null;
    return { ids, counts, n, dominant };
  }
  const pickingTopic = () => state.mode === 'topic' && !state.topic;
  function renderTopics() {
    const picking = pickingTopic();
    $('topics').hidden = !picking;
    $('qcard').hidden = picking;
    $('bubble').style.display = picking ? 'none' : '';
    const crumb = $('topicCrumb'), tp = state.mode === 'topic' && TOPIC[state.topic];
    crumb.hidden = !tp;
    if (tp) crumb.innerHTML = `<button class="ghost" id="btnTopics">${t('topicChange')}</button> <b>${tp.icon} ${esc(tr(tp.name))}</b>`;
    document.querySelectorAll('#mode button').forEach(b => b.classList.toggle('on', b.dataset.mode === state.mode));
    if (!picking) return;
    $('topicGrid').innerHTML = TOPICS.map(x => {
      const st = topicStats(x.id);
      return `<button class="topic-tile" data-topic="${x.id}">
        <span class="topic-icon">${x.icon}</span>
        <span class="topic-name">${esc(tr(x.name))}</span>
        <span class="topic-count">${st.n} / ${st.ids.length} ${t('topicQuestions')}</span>
        ${st.n ? stackBar(st.counts, st.n) : `<span class="topic-none">${t('topicNone')}</span>`}
      </button>`;
    }).join('');
  }
  function topicDoneHtml() {
    const tp = TOPIC[state.topic], st = topicStats(state.topic);
    if (!tp || !st.n) return '';
    return `<div class="topic-done">
      <p><b>${t('topicDone', { name: esc(tr(tp.name)) })}</b></p>
      <p>${t('topicMost')} <b style="color:${st.dominant.color}">${tr(st.dominant.name)}</b> (${pct(st.counts[st.dominant.id], st.n)}%)</p>
      ${stackBar(st.counts, st.n, true)}
      <div class="topic-done-actions">
        ${st.ids.some(id => state.answers[id] == null) ? `<button class="ghost" data-topic-act="more">${t('topicMore')}</button>` : ''}
        <button class="ghost" data-topic-act="pick">${t('topicPick')}</button>
        <button class="ghost" data-topic-act="results">${t('topicSeeResults')}</button>
      </div></div>`;
  }
  function setMode(mode) {
    if (mode === state.mode && mode === 'full') return;
    state.mode = mode;
    if (mode === 'topic') state.topic = null;
    buildDeck(); save(); renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function pickTopic(id) {
    state.mode = 'topic'; state.topic = id;
    buildDeck(); save(); renderAll();
    $('qcard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderQuestion() {
    renderTopics();
    const q = curQ(), cur = state.answers[q.id], type = q.type || 'likert';
    const card = $('qcard');
    card.classList.toggle('done', !!state.justFinished);
    const badge = type === 'dilemma' ? `<span class="qtype">${t('typeDilemma')}</span> ` : type === 'scenario' ? `<span class="qtype">${t('typeScenario')}</span> ` : '';
    $('qnum').innerHTML = state.justFinished ? t('done') : `${badge}${t('question')} ${state.pos + 1} ${t('of')} ${state.deck.length}`;

    if (isChoice(q)) {
      $('qchips').innerHTML = Object.keys(axisWeights(q)).map(id => {
        const a = axisById(id);
        return `<span class="chip" style="color:${a.color};border-color:${a.color}55">${tr(a.name)}</span>`;
      }).join('');
    } else {
      $('qchips').innerHTML = Object.entries(q.effects).map(([id, wgt]) => {
        const a = axisById(id), pole = wgt > 0 ? a.pos : a.neg, col = wgt > 0 ? a.posColor : a.negColor;
        const prefix = type === 'dilemma' ? 'B → ' : '';
        return `<span class="chip" style="color:${col};border-color:${col}55">${prefix}${tr(a.name)} → ${tr(pole)}</span>`;
      }).join('');
    }
    $('qtext').textContent = tr(q.text);
    $('dilemma').innerHTML = type === 'dilemma'
      ? `<div class="opt a"><b>${t('optA')}</b>${tr(q.a)}</div><div class="opt b"><b>${t('optB')}</b>${tr(q.b)}</div>` : '';

    const scale = $('scale');
    if (type === 'positions') {
      // Karty stanowisk w stałej kolejności: lewica → centrum → prawica.
      scale.className = 'scale positions';
      scale.innerHTML = cardOrder(q).map(i => { const o = q.options[i];
        const c = CAMPS[o.camp];
        return `<button data-o="${i}" class="pos-card ${cur === i ? 'sel' : ''}" style="--camp:${c.color}">
          <span class="camp-tag">${tr(c.name)}</span><span class="pos-text">${tr(o.text)}</span></button>`;
      }).join('');
    } else if (type === 'scenario') {
      scale.className = 'scale opts';
      scale.innerHTML = q.options.map((o, i) =>
        `<button data-o="${i}" class="${cur === i ? 'sel' : ''}"><span class="dot"></span><span class="lbl">${tr(o.text)}</span></button>`).join('');
    } else {
      const keys = type === 'dilemma' ? DILEMMA : LIKERT;
      scale.className = 'scale' + (type === 'dilemma' ? ' dil' : '');
      scale.innerHTML = VALUES.map(v =>
        `<button data-v="${v}" class="${cur === v ? 'sel' : ''}"><span class="dot"></span><span class="lbl">${t(keys[v])}</span></button>`).join('');
    }
    const imp = state.importance[q.id] || 1;
    document.querySelectorAll('#impSeg button').forEach(b => b.classList.toggle('on', Number(b.dataset.imp) === imp));

    $('bWhat').textContent = tr(q.what);
    $('bExample').textContent = tr(q.example);
    $('bExample').parentElement.hidden = !tr(q.example);
    // Przy stanowiskach dymek pokazuje, dlaczego każdy obóz tak uważa, przykład i hasło w Wikipedii.
    $('bPositions').innerHTML = q.type !== 'positions' ? '' : q.options.map((o, i) => {
      const c = CAMPS[o.camp];
      return `<div class="bpos ${cur === i ? 'sel' : ''}" style="--camp:${c.color}">
        <h4>${tr(c.name)}</h4>
        <p><b>${t('posWhy')}</b> ${esc(tr(o.why))}</p>
        <p><b>${t('posExample')}</b> ${esc(tr(o.example))}</p>
        ${o.wiki ? `<a href="${wikiUrl(o.wiki)}" target="_blank" rel="noopener">🔗 ${esc(wikiTitle(o.wiki))}</a>` : ''}
      </div>`;
    }).join('');
    $('bPositions').hidden = q.type !== 'positions';
    $('bubble').classList.toggle('hidden', !state.bubble);
    $('btnBubble').classList.toggle('on', state.bubble);
    $('btnBubble').title = state.bubble ? t('bubbleHide') : t('bubbleShow');
    $('btnPrev').disabled = state.pos === 0;

    // Nie pokazujemy, w którą stronę przesuwa odpowiedź - żeby nie sugerować wyboru.
    // W trybie „Tematy” po ostatnim pytaniu pokazujemy podsumowanie tematu.
    $('fxLine').innerHTML = state.justFinished && state.mode === 'topic' ? topicDoneHtml() : '';
  }

  // Informacja zwrotna: w którą stronę przesuwa Cię dana odpowiedź.
  function fxHtml(q, v, imp) {
    const fx = contributions(q, v, imp).filter(x => x.c !== 0);
    return fx.length
      ? `${t('fxTitle')} ` + fx.map(({ ax, c }) => {
          const a = axisById(ax), pole = c > 0 ? a.pos : a.neg, col = c > 0 ? a.posColor : a.negColor;
          return `<span class="fx" style="color:${col}">${tr(a.name)}: ${c > 0 ? '→' : '←'} ${tr(pole)} ${Math.abs(c) >= 1.5 ? '••' : '•'}</span>`;
        }).join('')
      : t('fxNeutral');
  }
  function toast(html) {
    const el = $('toast');
    el.innerHTML = html; el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // ── Wykresy ──
  function renderCharts(scores) {
    const ax = axisById(state.cx), ay = axisById(state.cy), cmp = compareProfile();
    Charts.compass($('compass'), {
      ax, ay,
      point: [scores[ax.id], scores[ay.id]],
      trail: [],
      compare: cmp ? [cmp.scores[ax.id] || 0, cmp.scores[ay.id] || 0] : null,
      compareLabel: cmp ? cmp.name : '',
      labels: { xNeg: tr(ax.neg), xPos: tr(ax.pos), yNeg: tr(ay.neg), yPos: tr(ay.pos) }
    });
  }

  function barList(items) {
    return items.map(r => `
      <div class="match">
        <div class="row"><b>${esc(r.name)}</b><span>${r.pct}%</span></div>
        <div class="bar"><div style="width:${r.pct}%"></div></div>
      </div>`).join('');
  }

  // ── Pewność wyniku ──
  function confidenceLabel(a, count, consistency) {
    if (!count[a.id]) return t('confNone');
    const c = consistency[a.id];
    if (c == null) return t('confNeutral');
    if (c >= .75) return t('confHigh');
    if (c >= .4) return t('confMid');
    return t('confLow');
  }
  // ── Twój rozkład: ile razy wybierasz stanowiska lewicy, centrum i prawicy ──
  function campStats() {
    const groups = { left: 0, center: 0, right: 0 }, sub = {}, byAxis = {}, picks = [];
    Object.keys(state.answers).forEach(id => {
      const q = Q[id]; if (q.type !== 'positions') return;
      const o = q.options[state.answers[id]]; if (!o) return;
      const g = CAMPS[o.camp].group, ax = primaryAxis(q);
      groups[g]++; sub[o.camp] = (sub[o.camp] || 0) + 1;
      (byAxis[ax] = byAxis[ax] || { left: 0, center: 0, right: 0 })[g]++;
      picks.push({ q, camp: o.camp, group: g });
    });
    const total = groups.left + groups.center + groups.right;
    const dominant = total ? CAMP_GROUPS.slice().sort((a, b) => groups[b.id] - groups[a.id])[0] : null;
    return { groups, sub, byAxis, picks, total, dominant };
  }
  const pct = (n, total) => total ? Math.round(n / total * 100) : 0;
  function stackBar(counts, total, big) {
    return `<div class="stack ${big ? 'big' : ''}">${CAMP_GROUPS.map(g => counts[g.id]
      ? `<div style="width:${counts[g.id] / total * 100}%;background:${g.color}" title="${tr(g.name)} ${pct(counts[g.id], total)}%">${big ? pct(counts[g.id], total) + '%' : ''}</div>` : '').join('')}</div>`;
  }
  function renderContra() {
    const s = campStats();
    if (!s.total) { $('contra').innerHTML = `<p class="hint">${t('summaryEmpty')}</p>`; return; }
    const subList = ids => ids.filter(c => s.sub[c]).map(c => `${tr(CAMPS[c].name).toLowerCase()} ${s.sub[c]}`).join(', ');
    const leftSub = subList(['left_soc', 'left_lib']), rightSub = subList(['right_cons', 'right_free']);
    const exceptions = s.picks.filter(p => p.group !== s.dominant.id).slice(0, 8);
    $('contra').innerHTML = `
      <p class="camp-main">${t('campsMost')} <b style="color:${s.dominant.color}">${tr(s.dominant.name)}</b> (${pct(s.groups[s.dominant.id], s.total)}%)</p>
      ${stackBar(s.groups, s.total, true)}
      <div class="camp-legend">${CAMP_GROUPS.map(g => `<span><i style="background:${g.color}"></i>${tr(g.name)} ${s.groups[g.id]}</span>`).join('')}</div>
      ${leftSub ? `<p class="hint">${t('campsLeftSplit')}: ${leftSub}</p>` : ''}
      ${rightSub ? `<p class="hint">${t('campsRightSplit')}: ${rightSub}</p>` : ''}
      <h4 class="camp-sub">${t('campsByDomain')}</h4>
      ${AXES.filter(a => s.byAxis[a.id]).map(a => {
        const c = s.byAxis[a.id], n = c.left + c.center + c.right;
        return `<div class="camp-row"><span style="color:${a.color}">${tr(a.name)}</span>${stackBar(c, n)}</div>`;
      }).join('')}
      ${exceptions.length ? `<h4 class="camp-sub">${t('campsExceptions', { camp: tr(s.dominant.name).toLowerCase() })}</h4>
        ${exceptions.map(p => `<div class="contra-item" data-id="${p.q.id}" style="border-left-color:${CAMPS[p.camp].color}">
          <q>${esc(tr(p.q.text))}</q><p style="color:${CAMPS[p.camp].color}">→ ${tr(CAMPS[p.camp].name)}</p></div>`).join('')}` : ''}`;
  }

  // ── Partie i ludzie ──
  function partyResults(scores, count) {
    return REGIONS.map(r => {
      const ranked = rank(PARTIES.filter(p => p.region === r.id), scores, count);
      return { region: r, best: ranked[0], second: ranked[1] };
    });
  }
  const enoughAnswers = () => Object.keys(state.answers).length >= MIN_FOR_MATCH;

  function renderParties(scores, count) {
    if (!enoughAnswers()) { $('parties').innerHTML = `<p class="hint">${t('partyNeedMore', { n: MIN_FOR_MATCH })}</p>`; return; }
    $('parties').innerHTML = partyResults(scores, count).map(({ region, best, second }) => {
      const ok = best.pct >= PARTY_THRESHOLD;
      const runner = ok
        ? (second && second.pct >= PARTY_THRESHOLD ? `${esc(second.x.name)} · ${second.pct}%` : '')
        : `${esc(best.x.name)} · ${best.pct}%`;
      return `<div class="party ${ok ? '' : 'none'}">
        <span class="region">${tr(region.name)}</span>
        <span class="pname">${ok ? esc(best.x.name) : t('partyNone')}</span>
        ${ok ? `<span class="pcountry">${tr(best.x.country)}</span>` : ''}
        ${runner ? `<span class="runner">${ok ? '+ ' : '≈ '}${runner}</span>` : ''}
        ${ok ? `<span class="pct">${best.pct}%</span><div class="bar"><div style="width:${best.pct}%"></div></div>` : ''}
      </div>`;
    }).join('');
  }

  function avatarColor(name) {
    let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return `hsl(${h} 70% 72%)`;
  }
  // Trzy postacie: najbliższa z Polski, ze świata i z fikcji.
  function peoplePicks(scores, count) {
    return [
      { kind: 'peoplePl', ...rank(PEOPLE.filter(p => p.region === 'pl'), scores, count)[0] },
      { kind: 'peopleWorld', ...rank(PEOPLE.filter(p => p.region === 'world'), scores, count)[0] },
      { kind: 'peopleFiction', ...rank(FICTION, scores, count)[0] }
    ];
  }
  function renderPeople(scores, count) {
    if (!enoughAnswers()) { $('people').innerHTML = `<p class="hint">${t('partyNeedMore', { n: MIN_FOR_MATCH })}</p>`; return; }
    $('people').innerHTML = peoplePicks(scores, count).map(({ kind, x, pct }) => {
      const words = x.name.split(' ');
      const initials = (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
      return `<div class="person">
        <div class="avatar" style="background:${avatarColor(x.name)}">${initials}</div>
        <div>
          <div class="kind">${t(kind)}</div>
          <div class="pname">${esc(x.name)}</div>
          <div class="pdesc">${tr(x.desc || x.from)}</div>
          ${x.quip ? `<div class="quip">${tr(x.quip)}</div>` : ''}
        </div>
        <div class="pct">${pct}%</div>
      </div>`;
    }).join('');
  }

  // ── Migawki i porównanie ──
  function renderSnapshots(scores) {
    $('snapList').innerHTML = state.snapshots.length ? state.snapshots.map(s => `
      <div class="snap ${s.id === state.compare ? 'on' : ''}">
        <div class="grow"><b>${esc(s.name)}</b><div class="meta">${new Date(s.date).toLocaleDateString(state.lang)} · ${s.kind === 'friend' ? t('snapFriendKind') : t('snapSelf')}</div></div>
        <button data-act="cmp" data-id="${s.id}">${s.id === state.compare ? t('hide') : t('compare')}</button>
        <button data-act="del" data-id="${s.id}" title="${t('del')}">✕</button>
      </div>`).join('') : `<p class="hint">${t('snapEmpty')}</p>`;

    const cmp = compareProfile();
    if (!cmp) { $('diff').innerHTML = ''; return; }
    $('diff').innerHTML = `<h3>${t('diffTitle', { name: esc(cmp.name) })}</h3>
      <div class="legend-mini"><i style="background:#fff"></i>${t('you')}<i style="border:2px solid #fbbf24"></i>${esc(cmp.name)}</div>` +
      AXES.map(a => {
        const v = scores[a.id], c = cmp.scores[a.id] || 0, d = Math.round(Math.abs(v - c) * 50);
        return `<div class="diff-row">
          <span style="color:${a.color}">${tr(a.name)}</span>
          <div class="track"><div class="center"></div>
            <div class="ghost-marker" style="left:${(c + 1) * 50}%"></div>
            <div class="marker" style="left:${(v + 1) * 50}%;width:12px;height:12px;border-width:2px"></div></div>
          <span class="num">Δ ${d}</span>
        </div>`;
      }).join('');
  }

  async function saveSnapshot() {
    const date = new Date();
    const name = await promptBox(t('snapName'), `${t('snapDefault')} ${date.toLocaleDateString(state.lang)}`);
    if (name == null) return;
    const { scores, count } = current();
    state.snapshots.push({ id: 's' + Date.now(), name: name.trim() || t('snapDefault'), date: date.toISOString(), kind: 'self', scores, count });
    save(); renderAll();
  }

  function importFriend(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        let res;
        if (d.answers && typeof d.answers === 'object') {
          res = computeScores(Object.keys(d.answers).filter(id => Q[id]), d.answers, d.importance || {});
        } else if (d.scores) {
          res = { scores: d.scores, count: Object.fromEntries(AXES.map(a => [a.id, 1])) };
        } else throw new Error('no data');
        const id = 'f' + Date.now();
        state.snapshots.push({ id, name: String(d.name || file.name.replace(/\.json$/i, '')).slice(0, 60), date: d.date || new Date().toISOString(), kind: 'friend', scores: res.scores, count: res.count });
        state.compare = id;
        save(); renderAll();
      } catch (e) { infoBox(`<p>${t('invalidFile')}</p>`); }
    };
    reader.readAsText(file);
  }

  // ── Tabela ──
  function renderTable() {
    const extra = Object.keys(state.answers).filter(id => !state.deck.includes(id));
    const ids = state.deck.concat(extra);
    $('tableCount').textContent = `${TEST.filter(q => state.answers[q.id] != null).length} / ${TEST.length}`;
    $('table').querySelector('tbody').innerHTML = ids.map((id, i) => {
      const q = Q[id], v = state.answers[id];
      const ansColor = v == null ? '' : q.type === 'positions' ? CAMPS[q.options[v].camp].color
        : q.type === 'scenario' ? '#c4b5fd' : ANSWER_COLORS[v + 2];
      const fx = contributions(q, v, 1).filter(x => x.c !== 0).map(({ ax, c }) => {
        const a = axisById(ax), pole = c > 0 ? a.pos : a.neg, col = c > 0 ? a.posColor : a.negColor;
        return `<span class="fx" style="color:${col}">${c > 0 ? '→' : '←'} ${tr(pole)} ${Math.abs(c) >= 1.5 ? '••' : '•'}</span>`;
      }).join('');
      const cur = state.deck[state.pos] === id;
      return `<tr data-id="${id}" class="${cur ? 'cur' : ''} ${v == null ? 'unanswered' : ''}">
        <td class="num">${i + 1}</td><td>${esc(tr(q.text))}</td>
        <td class="ans" style="color:${ansColor}">${esc(answerLabel(q, v))}</td>
        <td class="imp">${v == null ? '' : impLabel(state.importance[id])}</td><td>${fx}</td></tr>`;
    }).join('');
  }

  // ── Mapa ideologii: pola wg najbliższej ideologii na osiach Gospodarka × Władza ──
  const IDEO_GRID = 24;   // liczba kratek na bok (jak w klasycznych mapach ideologii)
  let ideoCache = null;   // { key, canvas, labels }
  function ideoBackground(size) {
    const key = `${size}|${state.lang}`;
    if (ideoCache && ideoCache.key === key) return ideoCache;
    const off = document.createElement('canvas');
    off.width = off.height = size;
    const g = off.getContext('2d'), cell = size / IDEO_GRID;
    const sites = IDEOLOGIES.map(x => ({ x, ex: x.v.econ, py: x.v.power, sx: 0, sy: 0, n: 0 }));
    for (let r = 0; r < IDEO_GRID; r++) for (let c = 0; c < IDEO_GRID; c++) {
      const ex = -1 + (c + 0.5) * 2 / IDEO_GRID, py = 1 - (r + 0.5) * 2 / IDEO_GRID;
      let best = sites[0], bd = Infinity;
      sites.forEach(st => { const d = (st.ex - ex) ** 2 + (st.py - py) ** 2; if (d < bd) { bd = d; best = st; } });
      best.sx += c; best.sy += r; best.n++;
      g.fillStyle = best.x.color;
      g.fillRect(Math.floor(c * cell), Math.floor(r * cell), Math.ceil(cell), Math.ceil(cell));
    }
    // Delikatna siatka i osie środka
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1;
    for (let i = 1; i < IDEO_GRID; i++) {
      const q = Math.round(i * cell) + .5;
      g.beginPath(); g.moveTo(q, 0); g.lineTo(q, size); g.moveTo(0, q); g.lineTo(size, q); g.stroke();
    }
    g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(size / 2, 0); g.lineTo(size / 2, size); g.moveTo(0, size / 2); g.lineTo(size, size / 2); g.stroke();
    const labels = sites.filter(st => st.n).map(st => ({ x: st.x, cx: (st.sx / st.n + 0.5) * cell, cy: (st.sy / st.n + 0.5) * cell, n: st.n }));
    ideoCache = { key, canvas: off, labels };
    return ideoCache;
  }
  // Rysuje mapę na podanym kontekście; zwraca środek kropki „Ty” (w pikselach kontekstu) albo null.
  function paintIdeo(g, size, k, scores, count, top, small) {
    const pad = Math.round(26 * k), inner = size - pad * 2;
    g.fillStyle = '#0d1017'; g.fillRect(0, 0, size, size);
    const bg = ideoBackground(inner);
    g.drawImage(bg.canvas, pad, pad);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    bg.labels.filter(l => !small || l.n >= 14 || (top && top.x.id === l.x.id)).forEach(l => {
      const fs = Math.round((small ? 8.5 : l.n > 20 ? 11.5 : 10) * k);
      g.font = `700 ${fs}px "Segoe UI", system-ui, sans-serif`;
      const name = tr(l.x.name), words = name.split(' ');
      const lines = words.length > 1 && name.length > 12 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [name];
      lines.forEach((ln, i) => {
        const y = pad + l.cy + (i - (lines.length - 1) / 2) * fs * 1.1;
        g.lineWidth = 3 * k; g.strokeStyle = 'rgba(0,0,0,.75)'; g.strokeText(ln, pad + l.cx, y);
        g.fillStyle = top && top.x.id === l.x.id ? '#fff59d' : '#fff'; g.fillText(ln, pad + l.cx, y);
      });
    });
    const ea = axisById('econ'), pa = axisById('power');
    g.font = `600 ${Math.round(11 * k)}px "Segoe UI", system-ui, sans-serif`; g.fillStyle = '#8a94a8';
    g.fillText(`▲ ${tr(pa.pos)}`, size / 2, pad / 2);
    g.fillText(`▼ ${tr(pa.neg)}`, size / 2, size - pad / 2);
    g.save(); g.translate(pad / 2, size / 2); g.rotate(-Math.PI / 2); g.fillText(`◀ ${tr(ea.neg)}`, 0, 0); g.restore();
    g.save(); g.translate(size - pad / 2, size / 2); g.rotate(Math.PI / 2); g.fillText(`${tr(ea.pos)} ▶`, 0, 0); g.restore();
    if (!(count.econ || count.power)) return null;
    const x = pad + (scores.econ + 1) / 2 * inner, y = pad + (1 - (scores.power + 1) / 2) * inner;
    g.beginPath(); g.arc(x, y, 11 * k, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.25)'; g.fill();
    g.beginPath(); g.arc(x, y, 6.5 * k, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill();
    g.lineWidth = 2.5 * k; g.strokeStyle = '#0d1017'; g.stroke();
    g.font = `800 ${Math.round(12 * k)}px "Segoe UI", system-ui, sans-serif`;
    g.lineWidth = 3 * k; g.strokeStyle = 'rgba(0,0,0,.8)'; g.strokeText(t('ideoYou'), x, y - 18 * k);
    g.fillStyle = '#fff'; g.fillText(t('ideoYou'), x, y - 18 * k);
    return { x, y };
  }
  const ideoTop = (scores, count) => Object.keys(state.answers).length >= MIN_FOR_MATCH ? rank(IDEOLOGIES, scores, count)[0] : null;
  // Osobny obrazek mapy (do PNG i raportu) - działa też, gdy sekcja na ekranie jest ukryta.
  function ideoImage(scores, count, size) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    paintIdeo(c.getContext('2d'), size, 1, scores, count, ideoTop(scores, count), false);
    return c;
  }
  function renderIdeo(scores, count) {
    const canvas = $('ideoMap'), rect = canvas.getBoundingClientRect();
    if (rect.width < 120) return;   // ukryta zakładka / zwinięta sekcja
    const dpr = window.devicePixelRatio || 1, size = Math.round(rect.width * dpr);
    canvas.width = canvas.height = size;
    const ranked = Object.keys(state.answers).length ? rank(IDEOLOGIES, scores, count) : [];
    const top = ideoTop(scores, count);
    const dot = paintIdeo(canvas.getContext('2d'), size, dpr, scores, count, top, rect.width < 480);
    const pulse = $('ideoPulse');
    pulse.hidden = !dot;
    if (dot) { pulse.style.left = (dot.x / dpr) + 'px'; pulse.style.top = (dot.y / dpr) + 'px'; }
    // Lista dopasowań
    if (!top) { $('ideoList').innerHTML = `<p class="hint">${t('ideoEmpty', { n: MIN_FOR_MATCH })}</p>`; return; }
    $('ideoList').innerHTML = `
      <div class="ideo-best" style="--c:${top.x.color}">
        <div class="lbl">${t('ideoBest')} · ${top.pct}%</div>
        <h3>${esc(tr(top.x.name))}</h3>
        <p>${esc(tr(top.x.desc))}</p>
      </div>
      <div class="ideo-also"><h4>${t('ideoAlso')}</h4>
        ${ranked.slice(1, 4).map(r => `<div class="ideo-item" style="--c:${r.x.color}"><i></i>
          <div><b>${esc(tr(r.x.name))}</b><span>${esc(tr(r.x.desc))}</span></div><em>${r.pct}%</em></div>`).join('')}
      </div>`;
  }

  function renderAll() {
    const { scores, count, consistency } = current();
    renderAxes(scores, count, consistency);
    renderSummary(scores, count, consistency);
    renderQuestion();
    // Błąd w rysowaniu wykresu nie może zatrzymać reszty apki.
    try { renderCharts(scores); } catch (e) { console.error(e); }
    try { renderIdeo(scores, count); } catch (e) { console.error(e); }
    renderContra();
    renderParties(scores, count);
    renderPeople(scores, count);
    renderSnapshots(scores);
    renderTable();
  }

  // ── Raport (druk / PDF) ──
  function printReport() {
    const { scores, count, consistency } = current();
    const date = new Date().toLocaleDateString(state.lang);
    const answered = Object.keys(state.answers);
    const li = items => `<ul>${items.map(x => `<li>${x}</li>`).join('')}</ul>`;
    const parties = enoughAnswers()
      ? li(partyResults(scores, count).map(({ region, best }) => `<b>${tr(region.name)}:</b> ${best.pct >= PARTY_THRESHOLD ? `${esc(best.x.name)} (${tr(best.x.country)}) - ${best.pct}%` : t('partyNone')}`))
      : `<p>${t('partyNeedMore', { n: MIN_FOR_MATCH })}</p>`;
    const people = enoughAnswers()
      ? li(peoplePicks(scores, count).map(r => `<b>${t(r.kind)}:</b> ${esc(r.x.name)} - ${r.pct}%`)) : '';
    const cs = campStats();
    const camps = cs.total
      ? li(CAMP_GROUPS.map(g => `${tr(g.name)}: ${cs.groups[g.id]} (${pct(cs.groups[g.id], cs.total)}%)`))
      : `<p>${t('summaryEmpty')}</p>`;
    $('report').innerHTML = `
      <h1>${t('appTitle')}</h1>
      <p class="rep-sub">${t('repSub', { date })} · ${t('repAnswered', { n: answered.length, total: TEST.length })}</p>
      <h2>${t('axesTitle')}</h2><p>${summaryHtml(scores, count, consistency) || t('summaryEmpty')}</p>
      <div class="rep-imgs"><div><img src="${ideoImage(scores, count, 520).toDataURL()}"></div></div>
      <div class="rep-cols">
        <div><h2>${t('ideoTitle')}</h2>${li(rank(IDEOLOGIES, scores, count).slice(0, 5).map(r => `${tr(r.x.name)} - ${r.pct}%`))}</div>
        <div><h2>${t('peopleTitle')}</h2>${people}</div>
      </div>
      <h2>${t('partyTitle')}</h2>${parties}<p class="rep-note">${t('partyHint')}</p>
      <h2>${t('confTitle')}</h2>
      <table><tbody>${AXES.map(a => `<tr><td>${tr(a.name)}</td><td>${count[a.id]} ${t('answers')}</td><td>${confidenceLabel(a, count, consistency)}</td></tr>`).join('')}</tbody></table>
      <h2>${t('campsTitle')}</h2>${camps}
      <h2>${t('tableTitle')}</h2>
      <table><thead><tr><th>${t('thQ')}</th><th>${t('thA')}</th><th>${t('thImp')}</th></tr></thead><tbody>
        ${state.order.map(id => `<tr><td>${esc(tr(Q[id].text))}</td><td>${esc(answerLabel(Q[id], state.answers[id]))}</td><td>${impLabel(state.importance[id])}</td></tr>`).join('')}
      </tbody></table>`;
    window.print();
  }

  // ── Obrazek do udostępnienia ──
  function shareImage() {
    const { scores, count, consistency } = current();
    const W = 1200, H = 675, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d'), F = 'Segoe UI, system-ui, sans-serif';
    g.fillStyle = '#0d1017'; g.fillRect(0, 0, W, H);
    const grad = g.createLinearGradient(40, 0, 460, 0);
    grad.addColorStop(0, '#7c9cff'); grad.addColorStop(.5, '#c084fc'); grad.addColorStop(1, '#f472b6');
    g.textBaseline = 'top';
    g.fillStyle = grad; g.font = `700 34px ${F}`; g.fillText(t('appTitle'), 40, 30);
    g.fillStyle = '#8a94a8'; g.font = `15px ${F}`; g.fillText(new Date().toLocaleDateString(state.lang), 40, 74);
    const panel = (x, y, w, h) => {
      g.fillStyle = '#151a24'; g.beginPath();
      if (g.roundRect) g.roundRect(x, y, w, h, 14); else g.rect(x, y, w, h);
      g.fill();
    };
    panel(40, 110, 520, 525); g.drawImage(ideoImage(scores, count, 500), 50, 122, 500, 500);
    panel(580, 110, 580, 290);
    const top = ideoTop(scores, count), ranked = rank(IDEOLOGIES, scores, count);
    const wrap = (text, x, y, maxW, lh) => {
      let line = '', yy = y;
      text.split(' ').forEach(w => {
        const test = line ? line + ' ' + w : w;
        if (g.measureText(test).width > maxW && line) { g.fillText(line, x, yy); line = w; yy += lh; } else line = test;
      });
      if (line) g.fillText(line, x, yy);
      return yy + lh;
    };
    if (top) {
      g.fillStyle = '#8a94a8'; g.font = `600 14px ${F}`; g.fillText(`${t('ideoBest').toUpperCase()} · ${top.pct}%`, 604, 130);
      g.fillStyle = top.x.color; g.font = `800 34px ${F}`; g.fillText(tr(top.x.name), 604, 152);
      g.fillStyle = '#cbd5e1'; g.font = `15px ${F}`;
      let y = wrap(tr(top.x.desc), 604, 200, 530, 21) + 8;
      g.fillStyle = '#8a94a8'; g.font = `600 13px ${F}`; g.fillText(t('ideoAlso'), 604, y);
      ranked.slice(1, 4).forEach((r, i) => {
        g.fillStyle = r.x.color; g.fillRect(604, y + 26 + i * 24, 10, 10);
        g.fillStyle = '#e7ebf3'; g.font = `600 14px ${F}`; g.fillText(tr(r.x.name), 622, y + 22 + i * 24);
        g.fillStyle = '#8a94a8'; g.textAlign = 'right'; g.fillText(r.pct + '%', 1140, y + 22 + i * 24); g.textAlign = 'left';
      });
    } else {
      g.fillStyle = '#8a94a8'; g.font = `15px ${F}`; wrap(t('ideoEmpty', { n: MIN_FOR_MATCH }), 604, 130, 530, 21);
    }
    AXES.forEach((a, i) => {
      const x = 580 + (i % 2) * 300, y = 422 + Math.floor(i / 2) * 43, v = scores[a.id], lvl = intensity(v);
      g.fillStyle = '#8a94a8'; g.font = `12px ${F}`; g.fillText(tr(a.name).toUpperCase(), x, y);
      g.font = `700 15px ${F}`;
      if (!count[a.id]) { g.fillStyle = '#4b5563'; g.fillText('-', x, y + 16); return; }
      g.fillStyle = !lvl ? '#e7ebf3' : v < 0 ? a.negColor : a.posColor;
      g.fillText(!lvl ? t('center') : `${lvl} ${tr(v < 0 ? a.neg : a.pos)}`, x, y + 16);
    });
    c.toBlob(b => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `kompas-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  // ── Akcje ──
  function answer(v) {
    const q = curQ();
    state.answers[q.id] = v;
    state.order = state.order.filter(id => id !== q.id).concat(q.id);
    save(); renderAll();
    notify('answer');
    clearTimeout(answer.timer);
    const src = fromVoice;
    answer.timer = setTimeout(() => { fromVoice = src; try { goNextUnanswered(); } finally { fromVoice = false; } }, 280);
  }

  // Zdarzenie dla asystenta głosowego: coś zmieniło się z ręki użytkownika (albo z asystenta).
  let fromVoice = false;
  function notify(kind) {
    window.dispatchEvent(new CustomEvent('kompas:change', { detail: { kind, source: fromVoice ? 'voice' : 'user' } }));
  }

  function goNextUnanswered() {
    const n = state.deck.length;
    for (let k = 1; k <= n; k++) {
      const i = (state.pos + k) % n;
      if (state.answers[state.deck[i]] == null) { go(i); return; }
    }
    state.justFinished = true; renderQuestion();
    if (state.mode !== 'topic') toast(t('doneSeeResults'));
  }

  function go(i) {
    state.pos = Math.max(0, Math.min(state.deck.length - 1, i));
    state.justFinished = false;
    save(); renderQuestion(); renderTable();
    notify('go');
  }

  function goToId(id) {
    if (!state.deck.includes(id)) state.deck.push(id);
    setTab('quiz');
    go(state.deck.indexOf(id));
    $('qcard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearAnswer() {
    const q = curQ();
    delete state.answers[q.id];
    delete state.importance[q.id];
    state.order = state.order.filter(id => id !== q.id);
    save(); renderAll();
  }

  function toggleBubble() { state.bubble = !state.bubble; save(); renderQuestion(); }

  function exportJson() {
    const { scores } = current();
    const data = { app: 'kompas-pogladow', version: 2, date: new Date().toISOString(), scores,
      answers: state.answers, importance: state.importance, order: state.order, snapshots: state.snapshots,
      optVersion: OPTIONS_VERSION };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kompas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        state.answers = {};
        Object.entries(d.answers || {}).forEach(([id, v]) => { if (Q[id]) state.answers[id] = v; });
        state.optVersion = d.optVersion || 1; migrateOptions();   // starszy plik: przesuń numery stanowisk
        state.importance = d.importance || {};
        state.order = (d.order || Object.keys(state.answers)).filter(id => state.answers[id] != null);
        if (Array.isArray(d.snapshots)) {
          d.snapshots.forEach(s => { if (s && s.id && s.scores && !state.snapshots.some(x => x.id === s.id)) state.snapshots.push(s); });
        }
        buildDeck(); save(); renderAll();
      } catch (e) { infoBox(`<p>${t('invalidFile')}</p>`); }
    };
    reader.readAsText(file);
  }

  // ── Zdarzenia ──
  $('scale').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    answer(Number(b.dataset.o != null ? b.dataset.o : b.dataset.v));
  });
  $('impSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const q = curQ(), v = Number(b.dataset.imp);
    if (v === 1) delete state.importance[q.id]; else state.importance[q.id] = v;
    save(); renderAll();
  });
  $('btnPrev').onclick = () => go(state.pos - 1);
  $('btnNext').onclick = () => go(state.pos + 1);
  $('btnSkip').onclick = () => go((state.pos + 1) % state.deck.length);
  $('btnBubble').onclick = toggleBubble;
  $('btnExport').onclick = exportJson;
  $('btnReport').onclick = printReport;
  $('btnImage').onclick = shareImage;
  $('btnSnap').onclick = saveSnapshot;
  $('fileImport').onchange = e => { if (e.target.files[0]) importJson(e.target.files[0]); e.target.value = ''; };
  $('fileFriend').onchange = e => { if (e.target.files[0]) importFriend(e.target.files[0]); e.target.value = ''; };
  $('btnReset2').onclick = () => $('btnReset').click();
  $('btnReset').onclick = async () => {
    if (!await confirmBox(t('resetConfirm'), t('reset'), true)) return;
    state.answers = {}; state.importance = {}; state.order = [];
    state.mode = 'full'; state.topic = null;
    buildDeck(); save(); setTab('quiz'); renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Menu „Więcej”: otwieranie, zamykanie po kliknięciu poza nim lub w pozycję.
  $('btnMenu').onclick = e => { e.stopPropagation(); $('menuPop').hidden = !$('menuPop').hidden; };
  $('menuPop').addEventListener('click', e => { if (e.target.closest('button')) $('menuPop').hidden = true; });
  $('fileImport').addEventListener('change', () => { $('menuPop').hidden = true; });
  document.addEventListener('click', e => { if (!e.target.closest('.menu')) $('menuPop').hidden = true; });
  $('btnGuide').onclick = () => infoBox(t('guideHtml'));
  $('axes').addEventListener('click', e => {
    const row = e.target.closest('.axis-row'); if (row) showAxis(row.id.slice(3));
  });
  $('lang').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    state.lang = b.dataset.lang; save(); applyI18n(); renderAll();
  });
  $('mode').addEventListener('click', e => {
    const b = e.target.closest('button[data-mode]'); if (b) setMode(b.dataset.mode);
  });
  $('topicGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-topic]'); if (b) pickTopic(b.dataset.topic);
  });
  $('topicCrumb').addEventListener('click', e => { if (e.target.closest('#btnTopics')) setMode('topic'); });
  $('fxLine').addEventListener('click', e => {
    const b = e.target.closest('[data-topic-act]'); if (!b) return;
    if (b.dataset.topicAct === 'more') { buildDeck(); save(); renderAll(); $('qcard').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (b.dataset.topicAct === 'pick') setMode('topic'); else setTab('results');
  });
  $('tabbar').addEventListener('click', e => {
    const b = e.target.closest('button[data-tab]'); if (b) setTab(b.dataset.tab);
  });
  $('mShuffle').onclick = () => { buildDeck(); save(); renderAll(); };
  $('selX').onchange = e => { state.cx = e.target.value; save(); renderAll(); };
  $('selY').onchange = e => { state.cy = e.target.value; save(); renderAll(); };
  $('table').addEventListener('click', e => {
    const row = e.target.closest('tr[data-id]'); if (row) goToId(row.dataset.id);
  });
  $('contra').addEventListener('click', e => {
    const it = e.target.closest('.contra-item'); if (it) goToId(it.dataset.id);
  });
  $('snapList').addEventListener('click', async e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const s = state.snapshots.find(x => x.id === b.dataset.id); if (!s) return;
    if (b.dataset.act === 'cmp') state.compare = state.compare === s.id ? null : s.id;
    if (b.dataset.act === 'del') {
      if (!await confirmBox(t('delConfirm', { name: esc(s.name) }), t('del'), true)) return;
      state.snapshots = state.snapshots.filter(x => x.id !== s.id);
      if (state.compare === s.id) state.compare = null;
    }
    save(); renderAll();
  });
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, select, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    const q = curQ(), n = Number(e.key);
    if (n >= 1 && n <= 5) {
      if (q.type === 'positions') { if (n <= q.options.length) answer(cardOrder(q)[n - 1]); }
      else if (isChoice(q)) { if (n <= q.options.length) answer(n - 1); }
      else answer(VALUES[n - 1]);
    }
    else if (e.key === 'ArrowLeft') go(state.pos - 1);
    else if (e.key === 'ArrowRight') go(state.pos + 1);
    else if (e.key.toLowerCase() === 'i') toggleBubble();
  });
  // (Dawniej panel zmniejszał się po przewinięciu i strona przeskakiwała - teraz ma stałą wysokość.)
  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { const c = current(); renderCharts(c.scores); renderIdeo(c.scores, c.count); }, 120);
  });

  // ── Interfejs dla asystenta głosowego (js/voice.js) ──
  const asVoice = fn => (...args) => { fromVoice = true; try { return fn(...args); } finally { fromVoice = false; } };
  SZ.App = {
    t, tr, esc, dialog, infoBox, toast,
    get state() { return state; },
    save, curQ, answerLabel, fxHtml,
    answer: asVoice(answer),
    next: asVoice(() => go(state.pos + 1)),
    prev: asVoice(() => go(state.pos - 1)),
    setImportance: asVoice(v => {
      const q = curQ();
      if (v === 1) delete state.importance[q.id]; else state.importance[q.id] = v;
      save(); renderAll();
    }),
    isDone: () => state.deck.every(id => state.answers[id] != null),
    progress: () => ({ n: state.deck.filter(id => state.answers[id] != null).length, total: state.deck.length }),
    // Krótkie podsumowanie wyniku do przeczytania na głos.
    resultText() {
      const { scores, count } = current();
      const lean = AXES.filter(a => count[a.id] && intensity(scores[a.id]))
        .sort((a, b) => Math.abs(scores[b.id]) - Math.abs(scores[a.id])).slice(0, 3)
        .map(a => `${tr(a.name)}: ${intensity(scores[a.id])} ${tr(scores[a.id] < 0 ? a.neg : a.pos)}`);
      const top = rank(IDEOLOGIES, scores, count)[0];
      return { lean, archetype: top ? tr(top.x.name) : '' };
    },
    showGuide: () => infoBox(t('guideHtml'))
  };

  setupCollapse();
  applyTab();
  applyI18n();
  renderAll();
  // Instalacja jako aplikacja na telefonie i działanie offline (tylko przez http/https, nie z pliku).
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Po powrocie do apki (np. z ekranu głównego telefonu) sprawdź, czy jest nowa wersja.
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    }).catch(() => { /* bez SW apka też działa */ });
    // Gdy nowa wersja przejmie stronę, przeładuj raz, żeby od razu było widać zmiany.
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloaded) { reloaded = true; location.reload(); }
    });
  }
  // Ekran startowy (wybór wersji) pokazuje voice.js; bez niego - instrukcja przy pierwszym uruchomieniu.
  // DOMContentLoaded, a nie setTimeout: dopiero wtedy na pewno wczytały się wszystkie skrypty.
  document.addEventListener('DOMContentLoaded', () => {
    if (SZ.Voice) return SZ.Voice.boot();
    if (!state.seenGuide && !Object.keys(state.answers).length) {
      state.seenGuide = true; save();
      infoBox(t('guideHtml'), t('start'));
    }
  });
})();
