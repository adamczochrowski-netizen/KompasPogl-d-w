// Partie i osoby do porównania.
// UWAGA: pozycje to przybliżone szacunki (programy, głosowania, wypowiedzi), stan na ok. 2025–2026.
// Kolejność osi w tablicy v: econ, power, soc, world, eco, relig, sec, just, tech, local.
window.SZ = window.SZ || {};

(function () {
  const ORDER = ['econ', 'power', 'soc', 'world', 'eco', 'relig', 'sec', 'just', 'tech', 'local'];
  const vec = arr => Object.fromEntries(ORDER.map((k, i) => [k, arr[i]]));

  SZ.REGIONS = [
    { id: 'pl', name: { pl: 'Polska', en: 'Poland' } },
    { id: 'eu', name: { pl: 'Europa', en: 'Europe' } },
    { id: 'am', name: { pl: 'Ameryki', en: 'Americas' } },
    { id: 'as', name: { pl: 'Azja', en: 'Asia' } },
    { id: 'af', name: { pl: 'Afryka', en: 'Africa' } }
  ];

  const P = (region, name, country, v) => ({ region, name, country, v: vec(v) });
  SZ.PARTIES = [
    // Polska
    P('pl', 'Koalicja Obywatelska', { pl: 'Polska', en: 'Poland' },               [0.2, -0.5, -0.3, -0.7, -0.2, -0.3, 0.5, 0.0, 0.4, -0.3]),
    P('pl', 'Prawo i Sprawiedliwość', { pl: 'Polska', en: 'Poland' },             [-0.4, 0.3, 0.7, 0.6, 0.4, 0.7, 0.8, 0.6, 0.0, 0.5]),
    P('pl', 'Konfederacja', { pl: 'Polska', en: 'Poland' },                       [0.8, 0.0, 0.7, 0.8, 0.7, 0.5, 0.6, 0.7, 0.3, -0.4]),
    P('pl', 'Lewica', { pl: 'Polska', en: 'Poland' },                             [-0.6, -0.6, -0.8, -0.5, -0.6, -0.9, 0.2, -0.5, 0.2, -0.3]),
    P('pl', 'Polskie Stronnictwo Ludowe', { pl: 'Polska', en: 'Poland' },         [0.1, -0.3, 0.3, -0.4, 0.1, 0.3, 0.5, 0.2, 0.1, -0.6]),
    P('pl', 'Polska 2050', { pl: 'Polska', en: 'Poland' },                        [0.2, -0.5, -0.2, -0.6, -0.5, -0.2, 0.5, -0.1, 0.5, -0.4]),
    P('pl', 'Partia Razem', { pl: 'Polska', en: 'Poland' },                       [-0.9, -0.6, -0.8, -0.3, -0.7, -0.9, 0.0, -0.6, 0.0, -0.4]),
    // Europa
    P('eu', 'CDU', { pl: 'Niemcy', en: 'Germany' },                               [0.4, -0.3, 0.3, -0.5, 0.1, 0.3, 0.5, 0.3, 0.4, -0.3]),
    P('eu', 'SPD', { pl: 'Niemcy', en: 'Germany' },                               [-0.4, -0.5, -0.4, -0.6, -0.3, -0.4, 0.2, -0.3, 0.3, -0.2]),
    P('eu', 'Zieloni (Die Grünen)', { pl: 'Niemcy', en: 'Germany' },              [-0.4, -0.6, -0.8, -0.8, -0.9, -0.6, 0.3, -0.5, -0.1, -0.3]),
    P('eu', 'AfD', { pl: 'Niemcy', en: 'Germany' },                               [0.3, 0.4, 0.8, 0.9, 0.8, 0.2, 0.5, 0.8, 0.0, -0.2]),
    P('eu', 'Rassemblement National', { pl: 'Francja', en: 'France' },            [-0.3, 0.4, 0.6, 0.8, 0.5, 0.0, 0.6, 0.8, 0.1, 0.6]),
    P('eu', 'Renaissance', { pl: 'Francja', en: 'France' },                       [0.4, -0.3, -0.4, -0.8, -0.2, -0.8, 0.5, 0.2, 0.7, 0.5]),
    P('eu', 'Fidesz', { pl: 'Węgry', en: 'Hungary' },                             [0.0, 0.6, 0.8, 0.8, 0.5, 0.7, 0.3, 0.7, 0.0, 0.8]),
    P('eu', 'Partia Pracy (Labour)', { pl: 'Wielka Brytania', en: 'United Kingdom' }, [-0.3, -0.4, -0.4, -0.3, -0.4, -0.5, 0.4, 0.0, 0.4, 0.0]),
    // Ameryki
    P('am', 'Partia Republikańska', { pl: 'USA', en: 'USA' },                     [0.7, 0.2, 0.7, 0.7, 0.8, 0.7, 0.7, 0.8, 0.5, -0.5]),
    P('am', 'Partia Demokratyczna', { pl: 'USA', en: 'USA' },                     [-0.2, -0.4, -0.6, -0.4, -0.5, -0.5, 0.4, -0.2, 0.5, 0.0]),
    P('am', 'Partia Libertariańska', { pl: 'USA', en: 'USA' },                    [1.0, -0.9, -0.4, 0.2, 0.6, -0.4, -0.5, -0.5, 0.8, -0.9]),
    P('am', 'Partia Liberalna', { pl: 'Kanada', en: 'Canada' },                   [0.0, -0.5, -0.7, -0.6, -0.5, -0.7, 0.0, -0.4, 0.4, -0.2]),
    P('am', 'La Libertad Avanza', { pl: 'Argentyna', en: 'Argentina' },           [1.0, 0.1, 0.5, 0.3, 0.8, 0.3, 0.4, 0.7, 0.6, -0.3]),
    P('am', 'Partia Pracujących (PT)', { pl: 'Brazylia', en: 'Brazil' },          [-0.6, -0.3, -0.3, -0.2, -0.2, -0.1, -0.3, -0.3, 0.1, 0.2]),
    P('am', 'MORENA', { pl: 'Meksyk', en: 'Mexico' },                             [-0.5, 0.2, 0.0, 0.4, 0.4, 0.0, 0.2, 0.1, 0.0, 0.5]),
    // Azja
    P('as', 'BJP', { pl: 'Indie', en: 'India' },                                  [0.3, 0.5, 0.8, 0.7, 0.6, 0.9, 0.7, 0.7, 0.6, 0.7]),
    P('as', 'Partia Liberalno-Demokratyczna (LDP)', { pl: 'Japonia', en: 'Japan' }, [0.4, -0.1, 0.6, 0.2, 0.4, 0.1, 0.6, 0.6, 0.6, 0.4]),
    P('as', 'Komunistyczna Partia Chin', { pl: 'Chiny', en: 'China' },            [-0.4, 1.0, 0.4, 0.6, 0.6, -0.9, 0.8, 0.9, 0.9, 1.0]),
    P('as', 'Demokratyczna Partia Postępowa', { pl: 'Tajwan', en: 'Taiwan' },     [0.0, -0.6, -0.5, -0.2, -0.4, -0.4, 0.5, 0.0, 0.6, -0.2]),
    P('as', 'Partia Demokratyczna Korei', { pl: 'Korea Płd.', en: 'South Korea' }, [-0.3, -0.4, 0.0, -0.1, -0.2, -0.2, -0.1, 0.1, 0.6, 0.0]),
    P('as', 'Partia Akcji Ludowej (PAP)', { pl: 'Singapur', en: 'Singapore' },    [0.5, 0.5, 0.4, -0.6, 0.4, -0.3, 0.6, 0.9, 0.9, 0.9]),
    P('as', 'AKP', { pl: 'Turcja', en: 'Turkey' },                                [0.2, 0.7, 0.8, 0.6, 0.6, 0.9, 0.7, 0.7, 0.3, 0.8]),
    // Afryka
    P('af', 'ANC', { pl: 'RPA', en: 'South Africa' },                             [-0.5, -0.2, -0.2, -0.1, 0.3, -0.2, -0.2, 0.1, 0.2, 0.4]),
    P('af', 'Democratic Alliance', { pl: 'RPA', en: 'South Africa' },             [0.6, -0.6, -0.3, -0.4, 0.0, -0.3, 0.0, 0.3, 0.4, -0.6]),
    P('af', 'Economic Freedom Fighters', { pl: 'RPA', en: 'South Africa' },       [-1.0, 0.2, -0.1, 0.6, 0.4, -0.1, 0.2, 0.2, 0.0, 0.6]),
    P('af', 'All Progressives Congress', { pl: 'Nigeria', en: 'Nigeria' },        [0.2, 0.2, 0.7, 0.3, 0.7, 0.6, 0.5, 0.7, 0.2, 0.3]),
    P('af', 'Ennahda', { pl: 'Tunezja', en: 'Tunisia' },                          [0.1, 0.0, 0.7, 0.2, 0.3, 0.8, 0.0, 0.4, 0.0, 0.2]),
    P('af', 'Rwandyjski Front Patriotyczny', { pl: 'Rwanda', en: 'Rwanda' },      [0.3, 0.8, 0.2, 0.1, -0.2, 0.0, 0.6, 0.6, 0.7, 0.9])
  ];

  const H = (name, desc, v) => ({ name, desc, v: vec(v) });
  SZ.PEOPLE = [
    H('Barack Obama', { pl: 'prezydent USA 2009–2017', en: 'US president 2009–2017' },              [-0.2, -0.4, -0.5, -0.6, -0.5, -0.2, 0.3, -0.3, 0.5, 0.0]),
    H('Donald Trump', { pl: 'prezydent USA', en: 'US president' },                                  [0.4, 0.5, 0.6, 0.9, 0.9, 0.4, 0.6, 0.9, 0.5, 0.2]),
    H('Bernie Sanders', { pl: 'senator USA, socjaldemokrata', en: 'US senator, social democrat' },  [-0.9, -0.6, -0.6, 0.1, -0.8, -0.5, -0.5, -0.6, 0.0, 0.0]),
    H('Angela Merkel', { pl: 'kanclerz Niemiec 2005–2021', en: 'German chancellor 2005–2021' },     [0.2, -0.4, 0.1, -0.7, -0.3, 0.2, 0.1, 0.0, 0.2, -0.2]),
    H('Margaret Thatcher', { pl: 'premier Wielkiej Brytanii 1979–1990', en: 'UK prime minister 1979–1990' }, [0.9, 0.3, 0.5, 0.4, 0.6, 0.3, 0.7, 0.8, 0.4, 0.6]),
    H('Nelson Mandela', { pl: 'prezydent RPA, noblista', en: 'South African president, Nobel laureate' }, [-0.5, -0.7, -0.3, -0.4, -0.2, 0.0, -0.6, -0.8, 0.0, 0.0]),
    H('Mahatma Gandhi', { pl: 'przywódca niepodległości Indii', en: 'leader of Indian independence' }, [-0.4, -0.9, 0.3, 0.3, -0.9, 0.6, -1.0, -0.9, -0.8, -1.0]),
    H('Winston Churchill', { pl: 'premier Wielkiej Brytanii w czasie II wojny', en: 'UK wartime prime minister' }, [0.4, 0.0, 0.6, 0.2, 0.4, 0.3, 1.0, 0.6, 0.4, 0.3]),
    H('Ronald Reagan', { pl: 'prezydent USA 1981–1989', en: 'US president 1981–1989' },             [0.9, 0.0, 0.6, 0.3, 0.6, 0.6, 0.9, 0.7, 0.4, -0.6]),
    H('Emmanuel Macron', { pl: 'prezydent Francji', en: 'French president' },                     [0.4, -0.2, -0.4, -0.8, -0.2, -0.8, 0.5, 0.2, 0.8, 0.5]),
    H('Viktor Orbán', { pl: 'premier Węgier', en: 'Hungarian prime minister' },                    [0.0, 0.6, 0.8, 0.8, 0.5, 0.7, 0.2, 0.7, 0.0, 0.8]),
    H('Javier Milei', { pl: 'prezydent Argentyny', en: 'Argentine president' },                    [1.0, 0.0, 0.4, 0.3, 0.8, 0.3, 0.4, 0.6, 0.7, -0.5]),
    H('Lula da Silva', { pl: 'prezydent Brazylii', en: 'Brazilian president' },                    [-0.6, -0.3, -0.2, -0.1, -0.2, 0.0, -0.4, -0.3, 0.0, 0.2]),
    H('Greta Thunberg', { pl: 'aktywistka klimatyczna', en: 'climate activist' },                  [-0.7, -0.6, -0.8, -0.7, -1.0, -0.8, -0.9, -0.6, -0.3, -0.3]),
    H('Elon Musk', { pl: 'przedsiębiorca (Tesla, SpaceX)', en: 'entrepreneur (Tesla, SpaceX)' },   [0.8, 0.0, 0.0, 0.3, 0.4, -0.5, 0.3, 0.3, 1.0, -0.3]),
    H('Jacinda Ardern', { pl: 'premier Nowej Zelandii 2017–2023', en: 'NZ prime minister 2017–2023' }, [-0.4, -0.4, -0.8, -0.6, -0.7, -0.7, -0.5, -0.4, 0.3, 0.2]),
    H('Lech Wałęsa', { pl: 'lider Solidarności, prezydent RP 1990–1995', en: 'Solidarity leader, Polish president 1990–1995' }, [0.2, -0.6, 0.5, -0.4, 0.1, 0.6, 0.3, 0.4, 0.0, -0.3]),
    H('Jan Paweł II', { pl: 'papież 1978–2005', en: 'Pope 1978–2005' },                            [-0.3, -0.6, 0.9, -0.4, -0.3, 1.0, -0.7, -0.6, -0.3, -0.3]),
    H('Józef Piłsudski', { pl: 'Naczelnik Państwa, marszałek', en: 'Polish Chief of State, Marshal' }, [-0.1, 0.6, 0.2, 0.6, 0.4, 0.1, 1.0, 0.6, 0.3, 0.8]),
    H('Xi Jinping', { pl: 'przywódca Chin', en: 'leader of China' },                               [-0.4, 1.0, 0.4, 0.7, 0.5, -0.9, 0.8, 0.9, 0.9, 1.0]),
    H('Władimir Putin', { pl: 'prezydent Rosji', en: 'Russian president' },                       [-0.1, 1.0, 0.8, 1.0, 0.9, 0.6, 1.0, 1.0, 0.3, 1.0]),
    H('Lee Kuan Yew', { pl: 'twórca nowoczesnego Singapuru', en: 'founder of modern Singapore' },  [0.5, 0.6, 0.4, -0.5, 0.5, -0.3, 0.6, 0.9, 0.9, 0.9]),
    H('Donald Tusk', { pl: 'premier RP', en: 'Polish prime minister' },                            [0.3, -0.4, -0.2, -0.7, -0.1, -0.2, 0.6, 0.2, 0.4, 0.2]),
    H('Jarosław Kaczyński', { pl: 'prezes PiS', en: 'leader of PiS' },                             [-0.3, 0.5, 0.8, 0.7, 0.4, 0.8, 0.8, 0.8, -0.2, 0.7]),
    H('Sławomir Mentzen', { pl: 'polityk Konfederacji', en: 'Confederation politician' },          [0.9, -0.1, 0.6, 0.8, 0.8, 0.4, 0.5, 0.6, 0.4, -0.6]),
    H('Adrian Zandberg', { pl: 'polityk partii Razem', en: 'Razem party politician' },             [-0.9, -0.6, -0.7, -0.4, -0.7, -0.9, 0.1, -0.6, 0.1, -0.3]),
    H('Martin Luther King', { pl: 'lider ruchu praw obywatelskich', en: 'civil rights leader' },   [-0.5, -0.8, 0.1, -0.3, -0.3, 0.6, -1.0, -0.7, 0.0, -0.2]),
    H('Milton Friedman', { pl: 'ekonomista, noblista', en: 'economist, Nobel laureate' },          [1.0, -0.6, -0.2, -0.6, 0.5, -0.4, 0.0, -0.4, 0.6, -0.6]),
    // Więcej postaci z Polski
    H('Karol Nawrocki', { pl: 'prezydent RP', en: 'Polish president' },                           [0.0, 0.3, 0.7, 0.6, 0.5, 0.6, 0.8, 0.7, 0.0, 0.3]),
    H('Rafał Trzaskowski', { pl: 'prezydent Warszawy', en: 'Mayor of Warsaw' },                   [0.2, -0.5, -0.5, -0.7, -0.5, -0.4, 0.4, -0.1, 0.5, -0.4]),
    H('Szymon Hołownia', { pl: 'lider Polski 2050', en: 'leader of Polska 2050' },                [0.2, -0.5, 0.0, -0.6, -0.5, 0.2, 0.4, -0.1, 0.4, -0.4]),
    H('Leszek Balcerowicz', { pl: 'ekonomista, autor reform 1989', en: 'economist, author of the 1989 reforms' }, [0.9, -0.5, -0.2, -0.6, 0.3, -0.3, 0.3, 0.0, 0.5, -0.2]),
    H('Jacek Kuroń', { pl: 'opozycjonista, minister pracy', en: 'dissident, labour minister' },  [-0.7, -0.7, -0.4, -0.3, -0.3, -0.3, -0.4, -0.5, 0.0, -0.6]),
    H('Roman Dmowski', { pl: 'twórca ruchu narodowego', en: 'founder of the national movement' }, [0.0, 0.5, 0.8, 1.0, 0.3, 0.8, 0.6, 0.6, 0.0, 0.5]),
    H('Janusz Korwin-Mikke', { pl: 'polityk konserwatywno-liberalny', en: 'conservative-liberal politician' }, [1.0, 0.3, 0.8, 0.7, 0.8, 0.2, 0.4, 1.0, 0.2, -0.7])
  ];
  const POLISH = new Set(['Lech Wałęsa', 'Jan Paweł II', 'Józef Piłsudski', 'Donald Tusk', 'Jarosław Kaczyński', 'Sławomir Mentzen',
    'Adrian Zandberg', 'Karol Nawrocki', 'Rafał Trzaskowski', 'Szymon Hołownia', 'Leszek Balcerowicz', 'Jacek Kuroń', 'Roman Dmowski', 'Janusz Korwin-Mikke']);
  SZ.PEOPLE.forEach(p => { p.region = POLISH.has(p.name) ? 'pl' : 'world'; });

  // Postacie fikcyjne — na wesoło. quip = żartobliwy komentarz.
  const F = (name, from, quip, v) => ({ name, from, quip, v: vec(v) });
  SZ.FICTION = [
    F('Janosik', { pl: 'legenda góralska', en: 'Polish highland legend' },
      { pl: 'Zabiera bogatym, daje biednym — podatek progresywny w wersji góralskiej.', en: 'Takes from the rich, gives to the poor — progressive tax, highland style.' },
      [-1.0, -0.7, 0.3, 0.2, -0.5, 0.2, 0.3, -0.5, -0.5, -1.0]),
    F('Ron Swanson', { pl: 'serial „Parks and Recreation”', en: '"Parks and Recreation"' },
      { pl: 'Najchętniej zlikwidowałby urząd, w którym pracuje.', en: 'Would happily abolish the office he works in.' },
      [1.0, -0.9, 0.4, 0.3, 0.6, 0.0, 0.3, 0.2, -0.6, -1.0]),
    F('Sknerus McKwacz', { pl: 'komiksy i bajki Disneya', en: 'Disney comics and cartoons' },
      { pl: 'Każdy grosz na wagę złota. Dosłownie — ma go cały skarbiec.', en: 'Every penny counts. Literally — he has a vault full of them.' },
      [1.0, 0.0, 0.3, -0.3, 0.9, 0.0, 0.2, 0.5, 0.6, 0.0]),
    F('Lisa Simpson', { pl: 'serial „Simpsonowie”', en: '"The Simpsons"' },
      { pl: 'Wegetarianka, saksofonistka i sumienie całego Springfield.', en: 'Vegetarian, saxophonist and the conscience of Springfield.' },
      [-0.6, -0.7, -0.8, -0.7, -1.0, -0.6, -0.8, -0.6, 0.3, -0.2]),
    F('Wielki Brat', { pl: 'powieść „Rok 1984”', en: 'novel "Nineteen Eighty-Four"' },
      { pl: 'Patrzy na Ciebie. Zawsze. Może jednak przemyśl kilka odpowiedzi?', en: 'He is watching you. Always. Maybe rethink a few answers?' },
      [-0.5, 1.0, 0.5, 1.0, 0.6, -0.5, 1.0, 1.0, 0.8, 1.0]),
    F('Imperator Palpatine', { pl: '„Gwiezdne wojny”', en: '"Star Wars"' },
      { pl: 'Demokracja? Nieźle brzmi, ale on woli „burzliwe brawa”.', en: 'Democracy? Sounds nice, but he prefers "thunderous applause".' },
      [0.2, 1.0, 0.3, 0.6, 0.8, 0.2, 1.0, 1.0, 1.0, 1.0]),
    F('Thanos', { pl: 'filmy Marvela', en: 'Marvel films' },
      { pl: 'Ekolog z bardzo, bardzo radykalnym planem.', en: 'An environmentalist with a very, very radical plan.' },
      [-0.3, 1.0, 0.0, -0.5, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
    F('Papa Smerf', { pl: 'bajka „Smerfy”', en: '"The Smurfs"' },
      { pl: 'Wszystko wspólne, wszyscy w lesie, a decyzje podejmuje mądry dziadek w czerwonej czapce.', en: 'Everything shared, everyone in the forest, decisions by a wise old man in a red hat.' },
      [-1.0, 0.2, 0.4, 0.2, -0.8, 0.0, -0.7, -0.4, -0.6, -0.4]),
    F('Geralt z Rivii', { pl: 'saga „Wiedźmin”', en: '"The Witcher" saga' },
      { pl: 'Polityka? „Mniejsze zło to wciąż zło.” Woli zostać neutralny i wziąć zapłatę.', en: 'Politics? "Evil is evil." He would rather stay neutral and get paid.' },
      [0.3, -0.6, 0.2, 0.3, -0.2, -0.7, 0.2, 0.3, -0.2, -0.5]),
    F('Hermiona Granger', { pl: 'seria „Harry Potter”', en: '"Harry Potter" series' },
      { pl: 'Założyłaby fundację na rzecz praw skrzatów, zanim skończysz czytać to zdanie.', en: 'Would found a house-elf rights charity before you finish this sentence.' },
      [-0.4, -0.5, -0.7, -0.5, -0.6, -0.5, -0.4, -0.4, 0.4, 0.2]),
    F('Kapitan Ameryka', { pl: 'filmy Marvela', en: 'Marvel films' },
      { pl: 'Tarcza w dłoni, wolność w sercu, a rano zawsze punktualnie na zbiórce.', en: 'Shield in hand, freedom in his heart, always on time for roll call.' },
      [0.2, -0.6, 0.3, 0.2, 0.0, 0.2, 0.8, 0.3, 0.2, -0.2]),
    F('Batman', { pl: 'komiksy DC', en: 'DC comics' },
      { pl: 'Miliarder, który uważa, że policja ma za mało gadżetów.', en: 'A billionaire who thinks the police lack gadgets.' },
      [0.6, 0.2, 0.2, 0.0, 0.2, -0.3, 0.5, 0.9, 1.0, 0.0]),
    F('Shrek', { pl: 'film „Shrek”', en: '"Shrek"' },
      { pl: 'Największy suwerenista świata: „Wynocha z mojego bagna!”.', en: 'The world\'s greatest sovereignist: "Get out of my swamp!".' },
      [0.2, -0.8, -0.4, 0.8, -0.6, -0.5, -0.3, -0.4, -0.6, -1.0]),
    F('Kubuś Puchatek', { pl: 'książki A.A. Milne’a', en: 'A.A. Milne\'s books' },
      { pl: 'Pacyfista, zwolennik spokojnego życia i miodu dla wszystkich.', en: 'A pacifist who backs a quiet life and honey for everyone.' },
      [-0.3, -0.8, 0.2, 0.0, -0.6, 0.0, -1.0, -0.8, -0.8, -0.5]),
    F('Ferdynand Kiepski', { pl: 'serial „Świat według Kiepskich”', en: 'Polish sitcom "Świat według Kiepskich"' },
      { pl: 'Ma pomysł na każdy problem kraju — byle nie musiał przy tym wstawać z kanapy.', en: 'Has a fix for every national problem — as long as he need not leave the sofa.' },
      [-0.6, 0.0, 0.6, 0.5, 0.6, 0.3, 0.0, 0.4, -0.5, 0.0]),
    F('Gandalf', { pl: '„Władca Pierścieni”', en: '"The Lord of the Rings"' },
      { pl: 'Szanuje tradycję, kocha Shire i nie ufa nikomu, kto buduje zbyt wysokie wieże.', en: 'Respects tradition, loves the Shire and distrusts anyone building towers too tall.' },
      [-0.2, -0.4, 0.5, -0.4, -0.7, 0.3, 0.4, -0.3, -0.7, -0.4]),
    F('Pan Kleks', { pl: 'książka „Akademia Pana Kleksa”', en: 'Polish novel "Mr Blot\'s Academy"' },
      { pl: 'Szkoła bez ocen, nauka przez zabawę i piegi z kropek atramentu.', en: 'A school without grades, learning through play, and freckles made of ink.' },
      [-0.4, -0.6, -0.8, -0.4, -0.3, -0.5, -0.8, -0.8, 0.7, -0.4]),
    F('Mistrz Yoda', { pl: '„Gwiezdne wojny”', en: '"Star Wars"' },
      { pl: 'Tradycja ważna jest. Pokój ważniejszy. Bagno najlepsze.', en: 'Important, tradition is. More important, peace. Best of all, a swamp.' },
      [-0.3, -0.4, 0.6, -0.3, -0.7, 0.8, -0.3, -0.2, -0.6, -0.3]),
    F('Tony Stark', { pl: 'filmy Marvela', en: 'Marvel films' },
      { pl: 'Wolny rynek, wielka technologia i zbroja na każdą okazję.', en: 'Free market, big tech and a suit of armour for every occasion.' },
      [0.8, 0.0, -0.4, -0.3, 0.3, -0.7, 0.7, 0.4, 1.0, 0.3]),
    F('Onufry Zagłoba', { pl: 'Trylogia Sienkiewicza', en: 'Sienkiewicz\'s Trilogy' },
      { pl: 'Szlachecka fantazja, patriotyzm i gotowość do bitwy — najlepiej po obiedzie.', en: 'Noble bravado, patriotism and readiness for battle — preferably after lunch.' },
      [0.2, 0.0, 0.6, 0.8, 0.3, 0.6, 0.7, 0.3, -0.4, -0.3])
  ];
})();
