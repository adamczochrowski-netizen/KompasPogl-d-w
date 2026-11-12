// Dane aplikacji: osie i archetypy. Pytania są w js/questions-*.js.
// Każdy tekst to obiekt { pl: '...', en: '...' } — brakujący język spada na polski.

window.SZ = window.SZ || {};

SZ.AXES = [
  {
    id: 'econ', color: '#fbbf24', negColor: '#f87171', posColor: '#60a5fa',
    name: { pl: 'Gospodarka', en: 'Economy' },
    neg:  { pl: 'Kolektywizm', en: 'Collectivism' },
    pos:  { pl: 'Wolny rynek', en: 'Free market' },
    desc: { pl: 'Kto ma decydować o pieniądzach i produkcji: państwo i wspólnota, czy rynek i jednostka.',
            en: 'Who decides about money and production: the state and community, or the market and the individual.' }
  },
  {
    id: 'power', color: '#f43f5e', negColor: '#4ade80', posColor: '#f43f5e',
    name: { pl: 'Władza', en: 'Power' },
    neg:  { pl: 'Demokracja', en: 'Democracy' },
    pos:  { pl: 'Totalitaryzm', en: 'Totalitarianism' },
    desc: { pl: 'Jak bardzo władza może kontrolować obywateli i czy podlega kontroli (sądy, media, wybory).',
            en: 'How much power may control citizens and whether it is itself checked (courts, media, elections).' }
  },
  {
    id: 'soc', color: '#c084fc', negColor: '#c084fc', posColor: '#d6a35c',
    name: { pl: 'Obyczaje', en: 'Society' },
    neg:  { pl: 'Postępowość', en: 'Progressivism' },
    pos:  { pl: 'Tradycjonalizm', en: 'Traditionalism' },
    desc: { pl: 'Czy normy społeczne powinny się zmieniać, czy raczej chronić to, co sprawdzone.',
            en: 'Should social norms change, or protect what has been proven.' }
  },
  {
    id: 'world', color: '#38bdf8', negColor: '#38bdf8', posColor: '#fb923c',
    name: { pl: 'Świat', en: 'World' },
    neg:  { pl: 'Globalizm', en: 'Globalism' },
    pos:  { pl: 'Suwerenizm', en: 'Sovereignism' },
    desc: { pl: 'Współpraca i otwarte granice kontra pełna niezależność i interes narodowy.',
            en: 'Cooperation and open borders versus full independence and national interest.' }
  },
  {
    id: 'eco', color: '#34d399', negColor: '#34d399', posColor: '#94a3b8',
    name: { pl: 'Ekologia', en: 'Ecology' },
    neg:  { pl: 'Ochrona przyrody', en: 'Environment first' },
    pos:  { pl: 'Rozwój przemysłu', en: 'Industry first' },
    desc: { pl: 'Co jest ważniejsze, gdy trzeba wybierać: przyroda i klimat czy wzrost i tani prąd.',
            en: 'What matters more when you must choose: nature and climate, or growth and cheap energy.' }
  },
  {
    id: 'relig', color: '#f472b6', negColor: '#a5b4fc', posColor: '#facc15',
    name: { pl: 'Religia', en: 'Religion' },
    neg:  { pl: 'Świeckość', en: 'Secularism' },
    pos:  { pl: 'Religia w państwie', en: 'Religion in state' },
    desc: { pl: 'Na ile religia i kościoły powinny być obecne w prawie, szkołach i urzędach.',
            en: 'How present religion and churches should be in law, schools and public offices.' }
  },
  {
    id: 'sec', color: '#fb923c', negColor: '#7dd3fc', posColor: '#f97316',
    name: { pl: 'Bezpieczeństwo', en: 'Security' },
    neg:  { pl: 'Pacyfizm', en: 'Pacifism' },
    pos:  { pl: 'Militaryzm', en: 'Militarism' },
    desc: { pl: 'Czy bezpieczeństwo budować dyplomacją i współpracą, czy silną armią i gotowością do walki.',
            en: 'Should security be built on diplomacy and cooperation, or on a strong army and readiness to fight.' }
  },
  {
    id: 'just', color: '#a3e635', negColor: '#86efac', posColor: '#dc2626',
    name: { pl: 'Sprawiedliwość', en: 'Justice' },
    neg:  { pl: 'Resocjalizacja', en: 'Rehabilitation' },
    pos:  { pl: 'Surowe kary', en: 'Harsh punishment' },
    desc: { pl: 'Czy system karny ma przede wszystkim naprawiać ludzi, czy odstraszać i karać.',
            en: 'Should the penal system mainly reform people, or deter and punish.' }
  },
  {
    id: 'tech', color: '#818cf8', negColor: '#a8a29e', posColor: '#818cf8',
    name: { pl: 'Technologia', en: 'Technology' },
    neg:  { pl: 'Ostrożność', en: 'Caution' },
    pos:  { pl: 'Akceleracja', en: 'Acceleration' },
    desc: { pl: 'Czy nowe technologie (AI, geny, atom) wprowadzać szybko, czy ostrożnie i z ograniczeniami.',
            en: 'Should new technologies (AI, genes, nuclear) be adopted fast, or carefully and with limits.' }
  },
  {
    id: 'local', color: '#d4a373', negColor: '#5eead4', posColor: '#d4a373',
    name: { pl: 'Ustrój terytorialny', en: 'Governance' },
    neg:  { pl: 'Samorządność', en: 'Local self-rule' },
    pos:  { pl: 'Centralizacja', en: 'Centralisation' },
    desc: { pl: 'Czy decyzje mają zapadać blisko ludzi (gmina, region), czy w stolicy.',
            en: 'Should decisions be made close to people (town, region) or in the capital.' }
  }
];

// Obozy, do których należą stanowiska w pytaniach. Lewica i prawica dzielą się tylko tam, gdzie ich odłamy się różnią.
SZ.CAMPS = {
  left:       { group: 'left',   color: '#f87171', name: { pl: 'Lewica', en: 'Left' } },
  left_soc:   { group: 'left',   color: '#f87171', name: { pl: 'Lewica socjalna', en: 'Social left' } },
  left_lib:   { group: 'left',   color: '#f472b6', name: { pl: 'Lewica progresywna', en: 'Progressive left' } },
  center:     { group: 'center', color: '#fbbf24', name: { pl: 'Centrum', en: 'Centre' } },
  right:      { group: 'right',  color: '#60a5fa', name: { pl: 'Prawica', en: 'Right' } },
  right_cons: { group: 'right',  color: '#60a5fa', name: { pl: 'Prawica konserwatywna', en: 'Conservative right' } },
  right_free: { group: 'right',  color: '#a78bfa', name: { pl: 'Prawica wolnorynkowa', en: 'Free-market right' } }
};
SZ.CAMP_GROUPS = [
  { id: 'left', color: '#f87171', name: { pl: 'Lewica', en: 'Left' } },
  { id: 'center', color: '#fbbf24', name: { pl: 'Centrum', en: 'Centre' } },
  { id: 'right', color: '#60a5fa', name: { pl: 'Prawica', en: 'Right' } }
];

// Co oznacza każdy biegun — pokazywane po kliknięciu osi.
SZ.POLE_INFO = {
  econ: { neg: { pl: 'Państwo i wspólnota dbają o równość: wyższe podatki, publiczne usługi, kontrola nad kluczowymi branżami.', en: 'The state and community ensure equality: higher taxes, public services, control over key industries.' },
          pos: { pl: 'Każdy decyduje o swoich pieniądzach: niskie podatki, konkurencja, mało regulacji.', en: 'Everyone decides about their own money: low taxes, competition, little regulation.' } },
  power: { neg: { pl: 'Władza jest ograniczona: wolne media, niezależne sądy, prawa obywateli i regularne wybory.', en: 'Power is limited: free media, independent courts, citizens\' rights and regular elections.' },
           pos: { pl: 'Silna, scentralizowana władza, która może kontrolować obywateli w imię porządku i skuteczności.', en: 'Strong, centralised power that may control citizens in the name of order and efficiency.' } },
  soc: { neg: { pl: 'Normy społeczne powinny się zmieniać: równość, wolność wyboru stylu życia, nowe modele rodziny.', en: 'Social norms should evolve: equality, freedom to choose a lifestyle, new family models.' },
         pos: { pl: 'Warto chronić sprawdzone normy: tradycyjną rodzinę, obyczaje i autorytety.', en: 'Proven norms are worth protecting: the traditional family, customs and authority.' } },
  world: { neg: { pl: 'Współpraca ponad granicami: integracja, wspólne instytucje, otwartość na ludzi i handel.', en: 'Cooperation across borders: integration, shared institutions, openness to people and trade.' },
           pos: { pl: 'Pełna niezależność kraju: własne decyzje, ochrona granic, interes narodowy na pierwszym miejscu.', en: 'Full national independence: own decisions, protected borders, national interest first.' } },
  eco: { neg: { pl: 'Przyroda i klimat są priorytetem, nawet kosztem wygody i wzrostu gospodarczego.', en: 'Nature and climate come first, even at the cost of comfort and growth.' },
         pos: { pl: 'Rozwój, miejsca pracy i tania energia są ważniejsze niż ochrona środowiska.', en: 'Growth, jobs and cheap energy matter more than environmental protection.' } },
  relig: { neg: { pl: 'Religia to sprawa prywatna: państwo neutralne, prawo oparte na świeckich argumentach.', en: 'Religion is private: a neutral state, laws based on secular arguments.' },
           pos: { pl: 'Wiara i jej wartości powinny być obecne w prawie, szkole i życiu publicznym.', en: 'Faith and its values should be present in law, schools and public life.' } },
  sec: { neg: { pl: 'Bezpieczeństwo budują rozmowy, dyplomacja i pomoc innym, a nie broń.', en: 'Security is built through talks, diplomacy and helping others, not weapons.' },
         pos: { pl: 'Pokój zapewnia silna armia i gotowość do obrony — „chcesz pokoju, szykuj się do wojny”.', en: 'Peace is secured by a strong army and readiness to fight — "if you want peace, prepare for war".' } },
  just: { neg: { pl: 'Kara ma przede wszystkim naprawiać: terapia, edukacja, druga szansa.', en: 'Punishment should mainly reform: therapy, education, a second chance.' },
          pos: { pl: 'Kara ma odstraszać i być sprawiedliwą odpłatą: surowe wyroki, silna policja.', en: 'Punishment should deter and be just retribution: harsh sentences, strong police.' } },
  tech: { neg: { pl: 'Nowe technologie wprowadzać ostrożnie, z regulacjami i myśleniem o skutkach.', en: 'Adopt new technologies carefully, with regulation and thought for consequences.' },
          pos: { pl: 'Postęp technologiczny jak najszybciej — AI, geny, atom rozwiążą więcej problemów, niż stworzą.', en: 'Technological progress as fast as possible — AI, genes, nuclear will solve more than they create.' } },
  local: { neg: { pl: 'Decyzje blisko ludzi: silne gminy i regiony, budżety obywatelskie.', en: 'Decisions close to people: strong towns and regions, participatory budgets.' },
           pos: { pl: 'Ważne sprawy decydowane centralnie: równe zasady dla wszystkich i sprawne wielkie projekty.', en: 'Important matters decided centrally: equal rules for all and efficient big projects.' } }
};

// Archetypy do porównania. Wartości -1..1 na każdej osi.
SZ.ARCHETYPES = [
  { name: { pl: 'Socjaldemokrata', en: 'Social democrat' },
    v: { econ: -0.5, power: -0.5, soc: -0.4, world: -0.4, eco: -0.4, relig: -0.4, sec: -0.2, just: -0.4, tech: 0.1, local: -0.2 } },
  { name: { pl: 'Liberał', en: 'Liberal' },
    v: { econ: 0.4, power: -0.6, soc: -0.4, world: -0.6, eco: -0.1, relig: -0.5, sec: 0.1, just: -0.3, tech: 0.6, local: -0.3 } },
  { name: { pl: 'Libertarianin', en: 'Libertarian' },
    v: { econ: 0.9, power: -0.9, soc: -0.3, world: 0.1, eco: 0.5, relig: -0.3, sec: -0.3, just: -0.2, tech: 0.8, local: -0.8 } },
  { name: { pl: 'Konserwatysta', en: 'Conservative' },
    v: { econ: 0.4, power: 0.2, soc: 0.7, world: 0.4, eco: 0.3, relig: 0.6, sec: 0.6, just: 0.7, tech: 0.0, local: 0.1 } },
  { name: { pl: 'Narodowiec', en: 'Nationalist' },
    v: { econ: 0.0, power: 0.5, soc: 0.8, world: 0.9, eco: 0.4, relig: 0.7, sec: 0.8, just: 0.8, tech: -0.2, local: 0.4 } },
  { name: { pl: 'Zielony progresywista', en: 'Green progressive' },
    v: { econ: -0.6, power: -0.6, soc: -0.8, world: -0.6, eco: -0.9, relig: -0.8, sec: -0.7, just: -0.6, tech: -0.4, local: -0.5 } },
  { name: { pl: 'Komunista autorytarny', en: 'Authoritarian communist' },
    v: { econ: -1, power: 0.9, soc: 0.1, world: 0.3, eco: 0.6, relig: -0.9, sec: 0.7, just: 0.6, tech: 0.5, local: 0.9 } },
  { name: { pl: 'Chadek (chrześcijański demokrata)', en: 'Christian democrat' },
    v: { econ: -0.2, power: -0.2, soc: 0.5, world: -0.2, eco: 0.0, relig: 0.6, sec: 0.3, just: 0.3, tech: -0.1, local: -0.2 } },
  { name: { pl: 'Populista socjalny', en: 'Social populist' },
    v: { econ: -0.6, power: 0.4, soc: 0.5, world: 0.6, eco: 0.4, relig: 0.4, sec: 0.5, just: 0.7, tech: -0.3, local: 0.5 } },
  { name: { pl: 'Technokrata', en: 'Technocrat' },
    v: { econ: 0.2, power: 0.4, soc: -0.2, world: -0.5, eco: 0.2, relig: -0.6, sec: 0.3, just: 0.2, tech: 0.9, local: 0.6 } },
  { name: { pl: 'Anarchista', en: 'Anarchist' },
    v: { econ: -0.7, power: -1, soc: -0.7, world: -0.5, eco: -0.6, relig: -0.9, sec: -0.8, just: -0.8, tech: -0.2, local: -1 } },
  { name: { pl: 'Centrysta', en: 'Centrist' },
    v: { econ: 0, power: -0.2, soc: 0, world: 0, eco: 0, relig: 0, sec: 0, just: 0, tech: 0.2, local: 0 } }
];
