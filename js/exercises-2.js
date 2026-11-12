// Ćwiczenia, część 2: 5 razy dlaczego, Ślepa próba, Lustro zasad, Zasłona niewiedzy, Kalibracja.
window.SZ = window.SZ || {};

(function () {
  const C = (pl, en) => ({ pl, en });

  // ═══ 5 razy dlaczego: drabina wartości ═══
  // Krok 1: powód Twojej odpowiedzi (wspólny dla wszystkich pytań), dalej „a dlaczego to ważne?” po wartościach.
  SZ.VALUES = {
    care: { icon: '🤲', name: C('Troska o słabszych', 'Care for the vulnerable') },
    fair: { icon: '⚖️', name: C('Sprawiedliwość', 'Fairness') },
    liberty: { icon: '🕊️', name: C('Wolność', 'Liberty') },
    security: { icon: '🛡️', name: C('Bezpieczeństwo', 'Security') },
    prosperity: { icon: '📈', name: C('Dobrobyt', 'Prosperity') },
    community: { icon: '👨‍👩‍👧', name: C('Wspólnota (rodzina, naród)', 'Community (family, nation)') },
    order: { icon: '🏛️', name: C('Porządek i prawo', 'Order and law') },
    tradition: { icon: '⛪', name: C('Tradycja i wiara', 'Tradition and faith') },
    dignity: { icon: '✨', name: C('Godność człowieka', 'Human dignity') }
  };
  SZ.WHY_FIRST = [
    ['care', C('Bo to chroni słabszych', 'Because it protects the vulnerable')],
    ['fair', C('Bo tak jest uczciwie', 'Because it is fair')],
    ['liberty', C('Bo ludzie powinni sami decydować', 'Because people should decide for themselves')],
    ['security', C('Bo to daje bezpieczeństwo', 'Because it gives security')],
    ['prosperity', C('Bo to dobre dla gospodarki i zarobków', 'Because it is good for the economy and wages')],
    ['community', C('Bo to wzmacnia rodzinę i wspólnotę', 'Because it strengthens family and community')],
    ['order', C('Bo potrzebny jest porządek i jasne zasady', 'Because order and clear rules are needed')],
    ['tradition', C('Bo to zgodne z naszą tradycją i wartościami', 'Because it fits our tradition and values')]
  ];
  const W = (to, pl, en) => ({ to, text: C(pl, en) });
  SZ.WHY_LADDER = {
    care: { q: C('Dlaczego tak ważne jest chronienie słabszych?', 'Why is protecting the vulnerable so important?'), opts: [
      W('dignity', 'Bo każdy człowiek ma taką samą godność', 'Because every person has the same dignity'),
      W('security', 'Bo kiedyś sam mogę potrzebować pomocy', 'Because one day I may need help myself'),
      W('community', 'Bo dobre społeczeństwo dba o swoich', 'Because a good society looks after its own'),
      W('tradition', 'Bo tak każe sumienie albo wiara', 'Because conscience or faith requires it')] },
    fair: { q: C('Dlaczego uczciwe zasady są tak ważne?', 'Why are fair rules so important?'), opts: [
      W('dignity', 'Bo wszyscy ludzie są równi', 'Because all people are equal'),
      W('prosperity', 'Bo bez uczciwych zasad nikt nie chce pracować ani inwestować', 'Because without fair rules no one wants to work or invest'),
      W('order', 'Bo bez zasad zapanuje chaos', 'Because without rules chaos takes over'),
      W('community', 'Bo niesprawiedliwość dzieli ludzi', 'Because injustice divides people')] },
    liberty: { q: C('Dlaczego tak ważne, by ludzie sami decydowali?', 'Why is it so important that people decide for themselves?'), opts: [
      W('dignity', 'Bo dorosły człowiek odpowiada za siebie', 'Because an adult is responsible for themselves'),
      W('prosperity', 'Bo wolni ludzie tworzą więcej dobrobytu', 'Because free people create more prosperity'),
      W('security', 'Bo władza, która decyduje za ludzi, prędzej czy później jest nadużywana', 'Because power that decides for people is sooner or later abused'),
      W('fair', 'Bo nikt nie ma prawa decydować za innych', 'Because no one has the right to decide for others')] },
    security: { q: C('Dlaczego bezpieczeństwo jest tak ważne?', 'Why is security so important?'), opts: [
      W('care', 'Bo chroni rodziny i najsłabszych', 'Because it protects families and the weakest'),
      W('liberty', 'Bo bez bezpieczeństwa nie ma prawdziwej wolności', 'Because without security there is no real freedom'),
      W('community', 'Bo państwo musi chronić swój naród', 'Because the state must protect its nation'),
      W('order', 'Bo ludzie potrzebują przewidywalnego życia', 'Because people need a predictable life')] },
    prosperity: { q: C('Dlaczego dobrobyt jest tak ważny?', 'Why is prosperity so important?'), opts: [
      W('care', 'Bo bogate państwo może pomóc potrzebującym', 'Because a rich state can help those in need'),
      W('liberty', 'Bo pieniądze dają ludziom wybór', 'Because money gives people choice'),
      W('security', 'Bo biedne państwo jest słabe', 'Because a poor state is weak'),
      W('dignity', 'Bo praca i godne zarobki dają ludziom szacunek', 'Because work and decent pay give people respect')] },
    community: { q: C('Dlaczego wspólnota - rodzina, naród - jest tak ważna?', 'Why is community - family, nation - so important?'), opts: [
      W('tradition', 'Bo przekazuje kolejnym pokoleniom to, co najcenniejsze', 'Because it passes on what is most precious to the next generations'),
      W('security', 'Bo razem jesteśmy silniejsi', 'Because together we are stronger'),
      W('care', 'Bo w dobrej wspólnocie nikt nie zostaje sam', 'Because in a good community no one is left alone'),
      W('dignity', 'Bo człowiek potrzebuje przynależności', 'Because people need to belong')] },
    order: { q: C('Dlaczego porządek i prawo są tak ważne?', 'Why are order and law so important?'), opts: [
      W('security', 'Bo chaos jest groźny dla wszystkich', 'Because chaos is dangerous for everyone'),
      W('fair', 'Bo prawo musi obowiązywać każdego tak samo', 'Because the law must apply to everyone equally'),
      W('prosperity', 'Bo bez porządku nie ma rozwoju', 'Because without order there is no growth'),
      W('tradition', 'Bo sprawdzone zasady są cenne', 'Because proven rules are valuable')] },
    tradition: { q: C('Dlaczego tradycja i wiara są tak ważne?', 'Why are tradition and faith so important?'), opts: [
      W('community', 'Bo łączą pokolenia i ludzi', 'Because they connect generations and people'),
      W('order', 'Bo dają jasne zasady życia', 'Because they give clear rules for life'),
      W('dignity', 'Bo mówią, że każde życie ma wartość', 'Because they say every life has value'),
      W('security', 'Bo sprawdzone rozwiązania są bezpieczniejsze niż eksperymenty', 'Because proven ways are safer than experiments')] },
    dignity: { q: C('Dlaczego godność człowieka jest tak ważna?', 'Why is human dignity so important?'), opts: [
      W('liberty', 'Bo każdy ma prawo iść własną drogą', 'Because everyone has the right to their own path'),
      W('care', 'Bo nikt nie powinien być upokarzany ani zostawiony w biedzie', 'Because no one should be humiliated or left in poverty'),
      W('tradition', 'Bo człowiek jest kimś wyjątkowym - tak uczy moja wiara', 'Because a human being is special - as my faith teaches'),
      W('fair', 'Bo bez niej równe prawa nic nie znaczą', 'Because without it equal rights mean nothing')] }
  };
  // Pytania testu do ćwiczenia „5 razy dlaczego”
  SZ.WHY_QUESTIONS = ['x_tax', 'x_migration', 'x_abortion', 'x_eu', 'x_coal', 'x_defense', 'x_unions', 'x_crime'];

  // ═══ Ślepa próba: te same stanowiska bez podpisu i z podpisem (część podpisów celowo zamieniona) ═══
  // [pytanie, numer stanowiska, czy w rundzie 2 pokazać fałszywy podpis]
  SZ.BLIND = [
    ['x_health', 0, false], ['x_tax', 3, true], ['x_coal', 2, false], ['x_migration', 3, true],
    ['x_defense', 0, true], ['x_crime', 2, false], ['x_eu', 1, false], ['x_minwage', 0, true]
  ];

  // ═══ Lustro zasad: pary sytuacji różniące się tylko tym, kogo dotyczą ═══
  const M = (id, qpl, qen, apl, aen, bpl, ben, notepl, noteen) => ({ id, q: C(qpl, qen), a: C(apl, aen), b: C(bpl, ben), note: C(notepl, noteen) });
  SZ.MIRROR = [
    M('m1', 'Czy policja powinna usunąć blokadę, która od rana paraliżuje ruch w mieście?', 'Should police remove a blockade that has paralysed city traffic since morning?',
      'Rolnicy blokują drogę w proteście przeciw importowi taniego zboża.', 'Farmers block a road in protest against cheap grain imports.',
      'Aktywiści klimatyczni blokują drogę w proteście przeciw węglowi.', 'Climate activists block a road in protest against coal.',
      'Ta sama blokada, inne hasło na transparencie.', 'The same blockade, a different slogan on the banner.'),
    M('m2', 'Czy platforma powinna usunąć ten wpis?', 'Should the platform remove this post?',
      'Popularny wpis wyśmiewa katolików i nazywa ich „ciemnogrodem”.', 'A popular post mocks Catholics and calls them "backward bigots".',
      'Popularny wpis wyśmiewa osoby LGBT i nazywa je „zboczeńcami”.', 'A popular post mocks LGBT people and calls them "perverts".',
      'Ten sam rodzaj obraźliwej generalizacji wobec innej grupy.', 'The same kind of insulting generalisation against a different group.'),
    M('m3', 'Czy państwo powinno ograniczyć działanie tej fundacji?', 'Should the state restrict this foundation\'s activity?',
      'Fundacja pro-life finansowana głównie z USA prowadzi kampanię w polskich szkołach.', 'A pro-life foundation funded mainly from the USA campaigns in Polish schools.',
      'Fundacja na rzecz praw LGBT finansowana głównie z USA prowadzi kampanię w polskich szkołach.', 'An LGBT-rights foundation funded mainly from the USA campaigns in Polish schools.',
      'To samo źródło pieniędzy i to samo miejsce działania, inna sprawa.', 'The same funding source and the same setting, a different cause.'),
    M('m4', 'Czy ten poseł powinien stracić mandat?', 'Should this MP lose their seat?',
      'Poseł prawicy został skazany prawomocnie za jazdę po pijanemu.', 'A right-wing MP has a final conviction for drunk driving.',
      'Poseł lewicy został skazany prawomocnie za jazdę po pijanemu.', 'A left-wing MP has a final conviction for drunk driving.',
      'Identyczne przestępstwo, inna partia.', 'The identical offence, a different party.'),
    M('m5', 'Czy to w porządku, że nauczyciel tak robi?', 'Is it OK for the teacher to do this?',
      'Nauczyciel zachęca uczniów na lekcji do udziału w Marszu dla Życia.', 'A teacher encourages pupils in class to join the March for Life.',
      'Nauczyciel zachęca uczniów na lekcji do udziału w Młodzieżowym Strajku Klimatycznym.', 'A teacher encourages pupils in class to join the Youth Climate Strike.',
      'Ta sama zachęta na lekcji, inna manifestacja.', 'The same encouragement in class, a different demonstration.'),
    M('m6', 'Czy to dopuszczalne?', 'Is this acceptable?',
      'Rząd prawicowy po wygranych wyborach obsadza media publiczne swoimi ludźmi.', 'A right-wing government, after winning an election, fills public media with its own people.',
      'Rząd liberalny po wygranych wyborach obsadza media publiczne swoimi ludźmi.', 'A liberal government, after winning an election, fills public media with its own people.',
      'Ta sama praktyka, inna władza.', 'The same practice, a different government.')
  ];

  // ═══ Zasłona niewiedzy: najpierw zasady, potem losujesz, kim jesteś ═══
  // impact[profil] = [ocena dla opcji 0, 1, 2] (-2 bardzo źle ... +2 bardzo dobrze)
  const R = (id, icon, pl, en, opts, impact) => ({ id, icon, name: C(pl, en), opts, impact });
  SZ.VEIL_RULES = [
    R('tax', '💸', 'Podatki', 'Taxes', [C('Niskie i liniowe', 'Low and flat'), C('Umiarkowane, kilka progów', 'Moderate, a few brackets'), C('Wysokie dla bogatych', 'High for the rich')],
      { biz: [2, 0, -2], nurse: [-1, 0, 1], farmer: [-1, 0, 1], disabled: [-2, 0, 2], student: [-1, 0, 1], pensioner: [-1, 0, 1], worker: [-1, 0, 1], coder: [2, 0, -2] }),
    R('health', '🏥', 'Ochrona zdrowia', 'Healthcare', [C('Prywatna, każdy płaci sam', 'Private, everyone pays'), C('Mieszana', 'Mixed'), C('W pełni publiczna', 'Fully public')],
      { biz: [1, 1, 0], nurse: [-1, 0, 1], farmer: [-2, 0, 1], disabled: [-2, 0, 2], student: [-1, 0, 1], pensioner: [-2, 0, 2], worker: [-2, 0, 1], coder: [1, 1, 0] }),
    R('pension', '👵', 'Emerytury', 'Pensions', [C('Każdy oszczędza sam', 'Everyone saves for themselves'), C('Mieszane', 'Mixed'), C('Równa emerytura od państwa', 'An equal state pension')],
      { biz: [2, 1, -1], nurse: [-1, 1, 1], farmer: [-1, 0, 2], disabled: [-2, 0, 2], student: [0, 0, 0], pensioner: [-2, 0, 2], worker: [-1, 0, 1], coder: [2, 1, -1] }),
    R('housing', '🏠', 'Mieszkania', 'Housing', [C('Wolny rynek', 'Free market'), C('Mieszane', 'Mixed'), C('Dużo tanich mieszkań od państwa', 'Lots of cheap state housing')],
      { biz: [1, 0, -1], nurse: [-1, 1, 1], farmer: [0, 0, 0], disabled: [-1, 0, 2], student: [-2, 1, 2], pensioner: [0, 0, 1], worker: [-2, 0, 2], coder: [1, 1, 0] }),
    R('school', '🎓', 'Edukacja', 'Education', [C('Płatne, elitarne szkoły', 'Paid, elite schools'), C('Mieszana', 'Mixed'), C('Darmowa dla wszystkich', 'Free for everyone')],
      { biz: [1, 0, 0], nurse: [-1, 0, 1], farmer: [-2, 0, 1], disabled: [-1, 0, 1], student: [-2, 1, 2], pensioner: [0, 0, 0], worker: [-2, 0, 1], coder: [1, 1, 1] }),
    R('business', '🏭', 'Przepisy dla firm', 'Business rules', [C('Mało przepisów - szybki wzrost', 'Few rules - fast growth'), C('Umiarkowane', 'Moderate'), C('Dużo ochrony pracowników', 'Lots of worker protection')],
      { biz: [2, 0, -2], nurse: [0, 0, 0], farmer: [1, 0, -1], disabled: [0, 0, 1], student: [1, 0, -1], pensioner: [0, 0, 0], worker: [0, 0, 1], coder: [2, 1, -1] })
  ];
  SZ.VEIL_PEOPLE = [
    { id: 'biz', icon: '💼', name: C('Właścicielka firmy budowlanej z Warszawy', 'Owner of a construction firm in Warsaw') },
    { id: 'nurse', icon: '🩺', name: C('Pielęgniarz z małego miasta', 'Nurse from a small town') },
    { id: 'farmer', icon: '🚜', name: C('Rolnik z Podlasia', 'Farmer from Podlasie') },
    { id: 'disabled', icon: '♿', name: C('Osoba na wózku, żyjąca z renty', 'Wheelchair user living on a disability pension') },
    { id: 'student', icon: '🎒', name: C('Studentka z biednej rodziny', 'Student from a poor family') },
    { id: 'pensioner', icon: '👵', name: C('Emerytka z niską emeryturą', 'Pensioner with a small pension') },
    { id: 'worker', icon: '👷', name: C('Pracownik budowlany z Ukrainy', 'Construction worker from Ukraine') },
    { id: 'coder', icon: '💻', name: C('Programista na kontrakcie B2B', 'Programmer on a B2B contract') }
  ];

  // ═══ Kalibracja: fakty + Twoja pewność ═══
  const K = (id, qpl, qen, opts, ok, notepl, noteen) => ({ id, q: C(qpl, qen), opts, ok, note: C(notepl, noteen) });
  SZ.CALIB = [
    K('c1', 'Jaka jest najwyższa stawka podatku PIT na skali (bez daniny solidarnościowej)?', 'What is the top income tax rate on the scale (without the solidarity levy)?',
      ['19%', '32%', '40%', '50%'], 1, 'Stawki to 12% i 32%. Powyżej 1 mln zł dochodzi 4% daniny solidarnościowej.', 'The rates are 12% and 32%. Above 1 million zł a 4% solidarity levy is added.'),
    K('c2', 'Jaka część polskiego eksportu trafia do innych krajów UE?', 'What share of Polish exports goes to other EU countries?',
      ['ok. 1/4', 'ok. 1/2', 'ok. 3/4', 'ponad 90%'], 2, 'Ok. trzech czwartych eksportu trafia na jednolity rynek UE.', 'About three quarters of exports go to the EU single market.'),
    K('c3', 'Czy Polska więcej dostaje z budżetu UE, niż do niego wpłaca?', 'Does Poland get more from the EU budget than it pays in?',
      [C('Tak', 'Yes'), C('Nie', 'No')], 0, 'Tak - Polska jest największym beneficjentem netto budżetu UE.', 'Yes - Poland is the largest net beneficiary of the EU budget.'),
    K('c4', 'Ilu mniej więcej uchodźców z Ukrainy mieszka w Polsce?', 'Roughly how many Ukrainian refugees live in Poland?',
      [C('ok. 50 tys.', 'about 50,000'), C('ok. 250 tys.', 'about 250,000'), C('ok. 1 mln', 'about 1 million'), C('ok. 5 mln', 'about 5 million')], 2, 'Ok. miliona osób ma w Polsce ochronę czasową.', 'About a million people hold temporary protection in Poland.'),
    K('c5', 'Jaka część prądu w Polsce pochodziła w 2024 r. z węgla?', 'What share of Poland\'s electricity came from coal in 2024?',
      [C('ok. 30%', 'about 30%'), C('ok. 55-60%', 'about 55-60%'), C('ok. 75%', 'about 75%'), C('ponad 90%', 'over 90%')], 1, 'Ok. 55-60% - udział węgla szybko spada, ale wciąż jest największy.', 'About 55-60% - coal\'s share is falling fast but is still the largest.'),
    K('c6', 'Ile dzieci urodziło się w Polsce w 2024 r.?', 'How many babies were born in Poland in 2024?',
      [C('ok. 150 tys.', 'about 150,000'), C('ok. 250 tys.', 'about 250,000'), C('ok. 400 tys.', 'about 400,000'), C('ok. 600 tys.', 'about 600,000')], 1, 'Ok. 250 tys. - najmniej od zakończenia II wojny światowej.', 'About 250,000 - the fewest since the end of the Second World War.'),
    K('c7', 'Ile mniej więcej Polska wydaje na obronność w 2025 r. (jako % PKB)?', 'Roughly how much does Poland spend on defence in 2025 (as % of GDP)?',
      ['ok. 2%', 'ok. 3%', 'ok. 4,5-5%', 'ok. 8%'], 2, 'Ok. 4,5-5% PKB - najwięcej w NATO.', 'About 4.5-5% of GDP - the most in NATO.'),
    K('c8', 'Od kiedy w Polsce jest zawieszony obowiązkowy pobór do wojska?', 'Since when has compulsory conscription been suspended in Poland?',
      ['1989', '1999', '2009', '2017'], 2, 'Od 2009 r. Pobór jest zawieszony, a nie zniesiony.', 'Since 2009. Conscription is suspended, not abolished.'),
    K('c9', 'Ile wynosiła płaca minimalna brutto w Polsce w 2025 r.?', 'What was the gross minimum wage in Poland in 2025?',
      ['3490 zł', '4666 zł', '5500 zł', '6200 zł'], 1, '4666 zł brutto miesięcznie.', '4,666 zł gross per month.'),
    K('c10', 'Jaki odsetek posłów wybranych do Sejmu w 2023 r. to kobiety?', 'What share of MPs elected to the Sejm in 2023 were women?',
      [C('ok. 10%', 'about 10%'), C('ok. 30%', 'about 30%'), C('ok. 45%', 'about 45%'), C('ok. 50%', 'about 50%')], 1, 'Ok. 30% (138 z 460) - najwięcej w historii, ale wciąż mniej niż 1/3.', 'About 30% (138 of 460) - the most ever, but still under a third.')
  ];
})();
