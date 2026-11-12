// Teksty interfejsu. Dodanie języka = nowy klucz z tymi samymi polami.
// {x} w tekście jest podmieniane przez funkcję t(key, {x: ...}).
window.SZ = window.SZ || {};

SZ.I18N = {
  pl: {
    appTitle: 'Kompas Poglądów',
    appSub: 'Zdefiniuj się - gospodarczo, politycznie, społecznie',
    liveTitle: 'Twój kierunek na żywo',
    question: 'Pytanie', of: 'z',
    typeDilemma: 'Dylemat', typeScenario: 'Scenariusz',
    a_m2: 'Zdecydowanie nie', a_m1: 'Raczej nie', a_0: 'Nie mam zdania', a_p1: 'Raczej tak', a_p2: 'Zdecydowanie tak',
    d_m2: 'Zdecydowanie A', d_m1: 'Raczej A', d_0: 'Pośrodku', d_p1: 'Raczej B', d_p2: 'Zdecydowanie B',
    optA: 'A', optB: 'B',
    impTitle: 'Jak ważne to dla Ciebie?', imp_low: 'Mało', imp_mid: 'Normalnie', imp_high: 'Bardzo',
    prev: '← Wstecz', next: 'Dalej →', skip: 'Pomiń', clear: 'Usuń odpowiedź',
    bubbleWhat: 'Co to właściwie znaczy?', bubbleExample: 'Z życia wzięte',
    bubblePro: 'Najmocniejszy argument ZA', bubbleCon: 'Najmocniejszy argument PRZECIW',
    bubbleProA: 'Za opcją A', bubbleProB: 'Za opcją B',
    bubbleHide: 'Schowaj', bubbleShow: 'Pokaż wyjaśnienie',
    modeQuick: 'Szybki', modeFull: 'Pełny', shuffle: '🔀 Przelosuj',
    modeTest: '📝 Test', modeTopics: '🗂️ Tematy',
    progressTitle: 'Postęp', axesTitle: '📏 Twoje osie', axesUnsure: 'Wyszarzone osie: Twoje odpowiedzi ciągną tu w różne strony, więc wynik jest niepewny.',
    ideoTitle: '🗺️ Mapa ideologii', ideoBest: 'Najbliżej Ci do', ideoAlso: 'Też blisko', ideoYou: 'Ty',
    ideoHint: 'Mapa pokazuje gospodarkę (poziomo) i władzę (pionowo). Dopasowanie liczy wszystkie 10 osi, więc najbliższa ideologia nie zawsze leży tuż obok Twojej kropki. To uproszczone szacunki.',
    ideoEmpty: 'Odpowiedz na co najmniej {n} pytań, żeby zobaczyć, jaka ideologia jest Ci najbliższa.',
    topicsTitle: 'Wybierz temat',
    topicsHint: 'W każdym temacie losuje się do 10 pytań, najpierw tych, na które jeszcze nie odpowiedziałeś. Odpowiedzi liczą się też do wyniku.',
    topicChange: '← Tematy', topicQuestions: 'pytań', topicNone: 'jeszcze bez odpowiedzi',
    topicDone: 'Temat „{name}” ukończony', topicMost: 'W tym temacie najczęściej wybierasz:',
    topicMore: '🎲 Kolejne pytania z tematu', topicPick: '🗂️ Wybierz inny temat', topicSeeResults: '📊 Zobacz cały wynik',
    compassTitle: 'Kompas 2D', compassHint: 'Ślad pokazuje, jak przesuwał się Twój pogląd z każdą odpowiedzią. Pusty okrąg to wybrane porównanie.',
    radarTitle: 'Profil biegunów', radarHint: 'Im dalej od środka, tym mocniej ciągnie Cię do danego bieguna. Przerywana linia to porównanie.',
    historyTitle: 'Ewolucja poglądów', historyHint: 'Wartość każdej osi po kolejnych odpowiedziach.',
    matchTitle: 'Najbliżej Ci do', matchHint: 'Ogólne typy poglądów, na podstawie dotychczasowych odpowiedzi.',
    confTitle: 'Pewność wyniku', confHint: 'Spójność: czy Twoje odpowiedzi na danej osi ciągną w jedną stronę. Niska spójność przy wyniku w centrum oznacza niezdecydowanie, a nie umiarkowanie.',
    confNone: 'brak danych', confNeutral: 'same neutralne', confHigh: 'spójne', confMid: 'raczej spójne', confLow: 'mieszane',
    undecided: 'niezdecydowanie',
    contraTitle: 'Możliwe sprzeczności', contraHint: 'Kliknij, aby wrócić do pytania i przemyśleć odpowiedź.',
    contraNone: 'Nie widać wyraźnych sprzeczności.',
    contraAgree: 'Zgadzasz się z oboma stwierdzeniami, choć ciągną w przeciwne strony osi {axis}.',
    contraDisagree: 'Nie zgadzasz się z żadnym z nich, choć są swoimi przeciwieństwami na osi {axis}.',
    partyTitle: 'Partie o podobnych poglądach', partyHint: 'Pozycje partii to przybliżone szacunki na podstawie programów i wypowiedzi (stan ok. 2025–2026), nie oficjalne dane.',
    partyNone: 'Brak partii z takimi poglądami', partyNeedMore: 'Odpowiedz na co najmniej {n} pytań, aby zobaczyć dopasowanie.',
    peopleTitle: 'Ludzie o podobnych poglądach', peopleHint: 'Przybliżone szacunki poglądów znanych osób i postaci - dla zabawy i inspiracji, nie jako ocena.',
    snapTitle: 'Historia i porównania', snapHint: 'Zapisz migawkę, aby za kilka miesięcy sprawdzić, jak zmieniły się Twoje poglądy. Możesz też wczytać plik eksportu znajomego.',
    snapSave: '📸 Zapisz migawkę', snapFriend: '👥 Wczytaj znajomego', snapName: 'Nazwa migawki:', snapDefault: 'Mój profil',
    snapEmpty: 'Brak zapisanych migawek.', snapSelf: 'migawka', snapFriendKind: 'znajomy',
    compare: 'Porównaj', hide: 'Ukryj', you: 'Ty', diffTitle: 'Ty vs {name}', del: 'Usuń', delConfirm: 'Usunąć „{name}”?',
    tableTitle: 'Twoje odpowiedzi', thNum: '#', thQ: 'Pytanie', thA: 'Odpowiedź', thImp: 'Ważność', thFx: 'Wpływ',
    noAnswer: '-', summaryEmpty: 'Odpowiedz na kilka pytań, a tu pojawi się opis Twojego profilu.',
    center: 'centrum', mild: 'lekko', moderate: 'umiarkowanie', strong: 'wyraźnie', extreme: 'skrajnie',
    answers: 'odp.', done: 'Wszystkie pytania za Tobą! Możesz zmieniać odpowiedzi w tabeli.',
    export: 'Eksport', import: 'Import', reset: 'Od nowa', report: '📄 Raport', image: '🖼️ Obrazek',
    resetConfirm: 'Na pewno usunąć wszystkie odpowiedzi? (Migawki zostaną.)',
    xAxis: 'Oś X', yAxis: 'Oś Y',
    shortcuts: 'Skróty: 1–5 odpowiedź · ←/→ nawigacja · I dymek',
    repSub: 'Raport z dnia {date}', repAnswered: 'Odpowiedzi: {n} z {total}',
    invalidFile: 'Niepoprawny plik.',
    guide: '❓ Jak to działa?', guideTxt: ' Jak to działa?', more: '⋯ Więcej', moreTxt: ' Więcej',
    tabQuiz: 'Pytania', tabResults: 'Wynik', tabMatch: 'Dopasowanie', tabMore: 'Więcej', modeLabel: 'Tryb',
    doneSeeResults: '✓ Gotowe! Zajrzyj do zakładek „Wynik” i „Dopasowanie”.', ok: 'OK', cancel: 'Anuluj', close: 'Zamknij', start: 'Zaczynamy!',
    collapse: 'Zwiń / rozwiń',
    argsToggle: '⚖️ Argumenty obu stron',
    axisClickHint: 'Kliknij dowolną oś, żeby zobaczyć, co oznacza i skąd wziął się Twój wynik.',
    fxTitle: 'Ta odpowiedź przesuwa Cię:', fxNeutral: 'Ta odpowiedź nie przesuwa wyniku - jest neutralna.',
    axisWhy: 'Skąd Twój wynik?', axisNoData: 'Nie ma jeszcze odpowiedzi na tej osi.', axisScore: 'Twój wynik',
    peoplePl: '🇵🇱 Z Polski', peopleWorld: '🌍 Ze świata', peopleFiction: '🎬 Z fikcji (na wesoło)',
    posWhy: 'Dlaczego:', posExample: 'Przykład:',
    campsTitle: 'Twój rozkład', campsHint: 'Ile razy wybierasz stanowisko lewicy, centrum i prawicy - ogółem i w każdej dziedzinie. Kliknij wyjątek, aby wrócić do pytania.',
    campsMost: 'Najczęściej wybierasz:', campsRightSplit: 'W tym prawica', campsLeftSplit: 'W tym lewica', campsByDomain: 'Według dziedzin',
    campsExceptions: 'Twoje wyjątki - tu nie wybierasz stanowiska: {camp}',
    guideHtml: `<h3>Jak to działa?</h3>
      <ol>
        <li><b>Odpowiadaj szczerze, nie „jak wypada”.</b> Nie ma dobrych ani złych odpowiedzi.</li>
        <li><b>Przy każdym pytaniu masz kilka konkretnych stanowisk:</b> typowe dla lewicy, centrum i prawicy (czasem lewica dzieli się na socjalną i progresywną, a prawica na konserwatywną i wolnorynkową). Wybierz to, które jest Ci <b>najbliższe</b> - nie musi pasować w 100%.</li>
        <li>Jeśli żadne Ci nie pasuje albo nie masz zdania, kliknij <b>„Pomiń”</b>.</li>
        <li><b>Dymek „i”</b> wyjaśnia, dlaczego każdy obóz tak uważa, podaje przykład z życia i link do Wikipedii.</li>
        <li><b>Ważność:</b> wybierz „Bardzo”, jeśli sprawa jest dla Ciebie kluczowa - liczy się podwójnie. „Mało” liczy się o połowę słabiej.</li>
        <li><b>Wynik:</b> każda oś ma dwa bieguny, od −100 do +100. Kliknij oś, żeby zobaczyć, które odpowiedzi Cię tam zaprowadziły.</li>
        <li><b>Pewność i sprzeczności</b> pokazują, gdzie warto zastanowić się jeszcze raz.</li>
        <li>Partie i postacie to <b>przybliżone porównania</b>, a nie wyrocznia.</li>
      </ol>
      <p class="hint">Wszystko zostaje w Twojej przeglądarce - nic nie jest nigdzie wysyłane.</p>`
  },
  en: {
    appTitle: 'Worldview Compass',
    appSub: 'Define yourself - economically, politically, socially',
    liveTitle: 'Your direction, live',
    question: 'Question', of: 'of',
    typeDilemma: 'Dilemma', typeScenario: 'Scenario',
    a_m2: 'Strongly disagree', a_m1: 'Disagree', a_0: 'Neutral', a_p1: 'Agree', a_p2: 'Strongly agree',
    d_m2: 'Strongly A', d_m1: 'Rather A', d_0: 'In between', d_p1: 'Rather B', d_p2: 'Strongly B',
    optA: 'A', optB: 'B',
    impTitle: 'How important is this to you?', imp_low: 'A little', imp_mid: 'Normal', imp_high: 'Very',
    prev: '← Back', next: 'Next →', skip: 'Skip', clear: 'Clear answer',
    bubbleWhat: 'What does it mean?', bubbleExample: 'Everyday example',
    bubblePro: 'Strongest argument FOR', bubbleCon: 'Strongest argument AGAINST',
    bubbleProA: 'For option A', bubbleProB: 'For option B',
    bubbleHide: 'Hide', bubbleShow: 'Show explanation',
    modeQuick: 'Quick', modeFull: 'Full', shuffle: '🔀 Shuffle',
    modeTest: '📝 Test', modeTopics: '🗂️ Topics',
    progressTitle: 'Progress', axesTitle: '📏 Your axes', axesUnsure: 'Greyed-out axes: your answers pull in different directions here, so the result is uncertain.',
    ideoTitle: '🗺️ Ideology map', ideoBest: 'Closest to you', ideoAlso: 'Also close', ideoYou: 'You',
    ideoHint: 'The map shows the economy (horizontal) and power (vertical). Matching uses all 10 axes, so the closest ideology is not always right next to your dot. These are simplified estimates.',
    ideoEmpty: 'Answer at least {n} questions to see which ideology is closest to you.',
    topicsTitle: 'Choose a topic',
    topicsHint: 'Each topic draws up to 10 questions, starting with ones you have not answered yet. Your answers also count towards your results.',
    topicChange: '← Topics', topicQuestions: 'questions', topicNone: 'no answers yet',
    topicDone: 'Topic "{name}" complete', topicMost: 'In this topic you most often choose:',
    topicMore: '🎲 More questions from this topic', topicPick: '🗂️ Choose another topic', topicSeeResults: '📊 See full results',
    compassTitle: '2D compass', compassHint: 'The trail shows how your view moved with each answer. The hollow ring is the selected comparison.',
    radarTitle: 'Pole profile', radarHint: 'The further from the centre, the stronger the pull to that pole. The dashed line is the comparison.',
    historyTitle: 'Evolution', historyHint: 'Each axis value after successive answers.',
    matchTitle: 'Closest to', matchHint: 'General types of views, based on your answers so far.',
    confTitle: 'Result confidence', confHint: 'Consistency: whether your answers on an axis pull the same way. Low consistency with a centre score means indecision, not moderation.',
    confNone: 'no data', confNeutral: 'all neutral', confHigh: 'consistent', confMid: 'fairly consistent', confLow: 'mixed',
    undecided: 'undecided',
    contraTitle: 'Possible contradictions', contraHint: 'Click to go back to the question and rethink your answer.',
    contraNone: 'No clear contradictions.',
    contraAgree: 'You agree with both statements, although they pull in opposite directions on the {axis} axis.',
    contraDisagree: 'You disagree with both, although they are opposites on the {axis} axis.',
    partyTitle: 'Parties with similar views', partyHint: 'Party positions are rough estimates based on programmes and statements (around 2025–2026), not official data.',
    partyNone: 'No party with such views', partyNeedMore: 'Answer at least {n} questions to see matches.',
    peopleTitle: 'People with similar views', peopleHint: 'Rough estimates of the views of well-known people and characters - for fun and inspiration, not as a judgement.',
    snapTitle: 'History and comparisons', snapHint: 'Save a snapshot to check in a few months how your views have changed. You can also load a friend\'s export file.',
    snapSave: '📸 Save snapshot', snapFriend: '👥 Load a friend', snapName: 'Snapshot name:', snapDefault: 'My profile',
    snapEmpty: 'No saved snapshots.', snapSelf: 'snapshot', snapFriendKind: 'friend',
    compare: 'Compare', hide: 'Hide', you: 'You', diffTitle: 'You vs {name}', del: 'Delete', delConfirm: 'Delete "{name}"?',
    tableTitle: 'Your answers', thNum: '#', thQ: 'Question', thA: 'Answer', thImp: 'Importance', thFx: 'Effect',
    noAnswer: '-', summaryEmpty: 'Answer a few questions and your profile description will appear here.',
    center: 'centre', mild: 'slightly', moderate: 'moderately', strong: 'clearly', extreme: 'extremely',
    answers: 'ans.', done: 'All questions answered! You can change answers in the table.',
    export: 'Export', import: 'Import', reset: 'Start over', report: '📄 Report', image: '🖼️ Image',
    resetConfirm: 'Really delete all answers? (Snapshots will stay.)',
    xAxis: 'X axis', yAxis: 'Y axis',
    shortcuts: 'Keys: 1–5 answer · ←/→ navigate · I bubble',
    repSub: 'Report from {date}', repAnswered: 'Answers: {n} of {total}',
    invalidFile: 'Invalid file.',
    guide: '❓ How it works', guideTxt: ' How it works', more: '⋯ More', moreTxt: ' More',
    tabQuiz: 'Questions', tabResults: 'Results', tabMatch: 'Matches', tabMore: 'More', modeLabel: 'Mode',
    doneSeeResults: '✓ Done! Check the "Results" and "Matches" tabs.', ok: 'OK', cancel: 'Cancel', close: 'Close', start: 'Let\'s go!',
    collapse: 'Collapse / expand',
    argsToggle: '⚖️ Arguments on both sides',
    axisClickHint: 'Click any axis to see what it means and where your score comes from.',
    fxTitle: 'This answer moves you:', fxNeutral: 'This answer does not move your score - it is neutral.',
    axisWhy: 'Where does your score come from?', axisNoData: 'No answers on this axis yet.', axisScore: 'Your score',
    peoplePl: '🇵🇱 From Poland', peopleWorld: '🌍 From the world', peopleFiction: '🎬 From fiction (just for fun)',
    posWhy: 'Why:', posExample: 'Example:',
    campsTitle: 'Your distribution', campsHint: 'How often you pick the left, centre and right position - overall and in each area. Click an exception to go back to the question.',
    campsMost: 'You most often pick:', campsRightSplit: 'Of which right', campsLeftSplit: 'Of which left', campsByDomain: 'By area',
    campsExceptions: 'Your exceptions - here you did not pick: {camp}',
    guideHtml: `<h3>How it works</h3>
      <ol>
        <li><b>Answer honestly, not "as you should".</b> There are no right or wrong answers.</li>
        <li><b>Each question offers a few concrete positions:</b> typical of the left, centre and right (sometimes the left splits into social and progressive, and the right into conservative and free-market). Pick the one <b>closest</b> to you - it does not have to fit 100%.</li>
        <li>If none fits or you have no opinion, click <b>"Skip"</b>.</li>
        <li><b>The "i" bubble</b> explains why each camp thinks so, with an everyday example and a Wikipedia link.</li>
        <li><b>Importance:</b> pick "Very" if the issue is key for you - it counts double. "A little" counts half.</li>
        <li><b>Score:</b> each axis has two poles, from −100 to +100. Click an axis to see which answers took you there.</li>
        <li><b>Confidence and contradictions</b> show where it is worth thinking again.</li>
        <li>Parties and characters are <b>rough comparisons</b>, not an oracle.</li>
      </ol>
      <p class="hint">Everything stays in your browser - nothing is sent anywhere.</p>`
  }
};
