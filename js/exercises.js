// Ćwiczenia - „Obrona argumentów”: wybierasz do 5 argumentów, którymi bronisz swojego stanowiska.
// Każdy argument ma rodzaj:
//   good    - rzeczowy argument; supports = obozy (albo grupy: left/center/right), którym pomaga
//   fallacy - błąd logiczny (fallacy = jego rodzaj z SZ.FALLACIES), nawet jeśli brzmi „po naszej stronie”
//   false   - nieprawdziwy fakt
// conflicts - argument kłóci się z Twoją odpowiedzią na inne pytanie (gdy ją wybrałeś)
// excludes  - pary argumentów, które się wzajemnie wykluczają
window.SZ = window.SZ || {};

SZ.FALLACIES = {
  popularity: { pl: 'Odwołanie do popularności', en: 'Appeal to popularity',
    d: { pl: 'To, że wielu ludzi coś uważa, nie znaczy, że to prawda.', en: 'Many people believing something does not make it true.' } },
  adhominem: { pl: 'Atak na osobę', en: 'Ad hominem',
    d: { pl: 'Atakuje ludzi o innym zdaniu zamiast ich argumentów.', en: 'Attacks people who disagree instead of their arguments.' } },
  slippery: { pl: 'Równia pochyła', en: 'Slippery slope',
    d: { pl: 'Zakłada bez dowodu, że jeden krok musi doprowadzić do skrajnych skutków.', en: 'Assumes without evidence that one step must lead to extreme consequences.' } },
  falsedilemma: { pl: 'Fałszywa alternatywa', en: 'False dilemma',
    d: { pl: 'Udaje, że są tylko dwie skrajne możliwości, choć jest ich więcej.', en: 'Pretends there are only two extreme options when there are more.' } },
  anecdote: { pl: 'Anegdota zamiast danych', en: 'Anecdotal evidence',
    d: { pl: 'Jeden przypadek z życia nie mówi, jak jest w całym kraju.', en: 'One personal case does not show what happens across a whole country.' } },
  tradition: { pl: 'Odwołanie do tradycji', en: 'Appeal to tradition',
    d: { pl: 'To, że coś „zawsze było”, nie dowodzi, że jest dobre teraz.', en: '"It has always been so" does not prove it is good now.' } },
  nature: { pl: 'Odwołanie do natury', en: 'Appeal to nature',
    d: { pl: '„Naturalne” nie znaczy „bezpieczne” ani „dobre”.', en: '"Natural" does not mean "safe" or "good".' } },
  emotion: { pl: 'Odwołanie do emocji', en: 'Appeal to emotion',
    d: { pl: 'Wzbudza silne uczucia zamiast pokazać, że rozwiązanie działa.', en: 'Stirs strong feelings instead of showing the solution works.' } },
  generalization: { pl: 'Pochopne uogólnienie', en: 'Hasty generalisation',
    d: { pl: 'Z kilku przypadków wyciąga wniosek o całej grupie ludzi.', en: 'Draws a conclusion about a whole group from a few cases.' } }
};

(function () {
  const A = (id, kind, pl, en, extra = {}) => Object.assign({ id, kind, text: { pl, en } }, extra);
  const N = (pl, en) => ({ note: { pl, en } });

  SZ.EXERCISES = [
    { q: 'x_tax', args: [
      A('a1', 'good', 'Bogatsi więcej zyskują na tym, co daje państwo (drogi, sądy, ochrona własności), więc mogą płacić większy procent.',
        'The better-off gain more from what the state provides (roads, courts, property protection), so they can pay a higher share.',
        Object.assign({ supports: ['left'] }, N('Klasyczny argument za progresją: korzyść z państwa rośnie z majątkiem.', 'A classic case for progressive tax: the benefit from the state grows with wealth.'))),
      A('a2', 'good', 'Jedna stawka bez ulg zostawia mniej luk, więc system jest prostszy, tańszy w obsłudze i trudniej go obejść.',
        'One rate with no breaks leaves fewer loopholes, so the system is simpler, cheaper to run and harder to dodge.',
        Object.assign({ supports: ['right_free'] }, N('Rzeczowy argument za podatkiem liniowym: prostota i mniej optymalizacji.', 'A solid argument for a flat tax: simplicity and less tax avoidance.'))),
      A('a3', 'good', 'Wysoka kwota wolna chroni najmniej zarabiających, a nie karze nikogo wyższą stawką za awans.',
        'A high tax-free allowance protects low earners without punishing anyone with a higher rate for getting promoted.',
        Object.assign({ supports: ['center'] }, N('Tak działa polski system od 2022 r. - ochrona na dole bez wielu progów.', 'This is how the Polish system has worked since 2022 - protection at the bottom without many brackets.'))),
      A('a4', 'good', 'Ulgi na dzieci zostawiają pieniądze rodzinom, które ponoszą koszt wychowania przyszłych podatników.',
        'Child tax breaks leave money with families who bear the cost of raising future taxpayers.',
        Object.assign({ supports: ['right_cons'] }, N('Mocny argument prorodzinny: wychowanie dzieci to inwestycja dla wszystkich.', 'A strong pro-family argument: raising children is an investment for everyone.'))),
      A('a5', 'fallacy', 'Większość ludzi, których znam, chce niższych podatków, więc to słuszne.',
        'Most people I know want lower taxes, so it must be right.', { fallacy: 'popularity' }),
      A('a6', 'fallacy', 'Za podatkiem liniowym są tylko bogacze, którzy myślą o swoich kieszeniach.',
        'Only the rich support a flat tax, because they think about their own pockets.', { fallacy: 'adhominem' }),
      A('a7', 'fallacy', 'Jak raz podniesiemy podatki bogatym, to za kilka lat zabiorą wszystkim połowę pensji.',
        'Once we raise taxes on the rich, in a few years they will take half of everyone\'s pay.', { fallacy: 'slippery' }),
      A('a8', 'false', 'W Polsce najbogatsi płacą dziś aż 75% podatku dochodowego.',
        'In Poland the richest currently pay as much as 75% income tax.',
        N('Nieprawda: najwyższa stawka PIT to 32%, plus 4% daniny solidarnościowej od nadwyżki ponad 1 mln zł rocznie.', 'False: the top income tax rate is 32%, plus a 4% solidarity levy on income above 1 million zł a year.')),
      A('a9', 'good', 'Wyższe podatki od najbogatszych sfinansują dobre publiczne szpitale i szkoły dla wszystkich.',
        'Higher taxes on the richest will fund good public hospitals and schools for everyone.',
        Object.assign({ supports: ['left'], conflicts: [{ q: 'x_health', camps: ['right'],
          note: { pl: 'Chcesz więcej podatków na publiczne usługi, a w ochronie zdrowia wybrałeś konkurujących prywatnych ubezpieczycieli.', en: 'You want more taxes for public services, but in healthcare you chose competing private insurers.' } }] },
          N('Spójny argument lewicy: podatki jako źródło usług publicznych.', 'A coherent left-wing argument: taxes as the source of public services.'))),
      A('a10', 'good', 'Niskie podatki zostawiają ludziom wolność decydowania o własnych pieniądzach zamiast państwa.',
        'Low taxes leave people free to decide about their own money instead of the state.',
        Object.assign({ supports: ['right_free', 'right_cons', 'center'], conflicts: [{ q: 'x_stateco', camps: ['left_soc'],
          note: { pl: 'Bronisz małego państwa, a przy energetyce wybrałeś, że wszystko ma należeć do państwa.', en: 'You defend a small state, yet for energy you chose full state ownership.' } }] },
          N('Argument wolnościowy - pasuje do niższych podatków w każdej postaci.', 'A liberty argument - it fits lower taxes in any form.')))
    ], excludes: [['a2', 'a4', { pl: 'Jedna stawka „bez żadnych ulg” wyklucza specjalne ulgi na dzieci.', en: 'One rate "with no breaks at all" rules out special child tax breaks.' }]] },

    { q: 'x_minwage', args: [
      A('b1', 'good', 'Gdy rośnie płaca minimalna, ludzie mają więcej na zakupy, a to napędza też lokalne firmy.',
        'When the minimum wage rises, people have more to spend, which also drives local businesses.',
        Object.assign({ supports: ['left'] }, N('Argument popytowy: wyższe pensje to większe zakupy.', 'A demand-side argument: higher pay means more spending.'))),
      A('b2', 'good', 'Zbyt wysoka płaca minimalna może sprawić, że firmom nie opłaci się zatrudniać młodych bez doświadczenia.',
        'Too high a minimum wage can make it unprofitable to hire young people without experience.',
        Object.assign({ supports: ['right', 'center'] }, N('Rzeczowe ryzyko, o którym mówią ekonomiści - zwłaszcza w biedniejszych regionach.', 'A real risk economists point to - especially in poorer regions.'))),
      A('b3', 'good', 'Stały wzór podwyżek pozwala firmom zaplanować koszty, a pracownikom liczyć na wzrost płac.',
        'A fixed formula for rises lets firms plan costs and workers count on pay growth.',
        Object.assign({ supports: ['center'] }, N('Przewidywalność to główna zaleta „środkowej drogi”.', 'Predictability is the main advantage of the "middle way".'))),
      A('b4', 'false', 'Polska ma najniższą płacę minimalną w całej Unii Europejskiej.',
        'Poland has the lowest minimum wage in the whole European Union.',
        N('Nieprawda: najniższą płacę minimalną w UE ma Bułgaria, a Polska jest w środku stawki i wyprzedza wiele krajów regionu.', 'False: Bulgaria has the lowest minimum wage in the EU, while Poland is mid-table, ahead of many countries in the region.')),
      A('b5', 'fallacy', 'Mój znajomy zamknął sklep przez płacę minimalną, więc ona niszczy całą gospodarkę.',
        'A friend of mine closed his shop because of the minimum wage, so it is destroying the whole economy.', { fallacy: 'anecdote' }),
      A('b6', 'fallacy', 'Każdy, kto jest przeciw podwyżkom płacy minimalnej, po prostu nie szanuje pracowników.',
        'Anyone against raising the minimum wage simply does not respect workers.', { fallacy: 'adhominem' }),
      A('b7', 'fallacy', 'Albo płace ustala wolny rynek, albo mamy komunizm.',
        'Either the free market sets wages, or we have communism.', { fallacy: 'falsedilemma' }),
      A('b8', 'good', 'Państwo nie powinno ustalać cen, a płaca to po prostu cena pracy.',
        'The state should not set prices, and a wage is simply the price of labour.',
        Object.assign({ supports: ['right'], conflicts: [{ q: 'p_pricecaps', camps: ['left'],
          note: { pl: 'Mówisz, że państwo nie powinno ustalać cen, a przy energii chcesz stałego zamrożenia cen prądu.', en: 'You say the state should not set prices, yet you want electricity prices frozen permanently.' } }] },
          N('Spójny argument wolnorynkowy.', 'A consistent free-market argument.'))),
      A('b9', 'good', 'Praca na pełny etat powinna wystarczać na utrzymanie, bez dopłat z pomocy społecznej.',
        'A full-time job should be enough to live on, without top-ups from welfare.',
        Object.assign({ supports: ['left', 'center'] }, N('Argument godnościowy - popularny także poza lewicą.', 'A dignity argument - popular beyond the left too.'))),
      A('b10', 'good', 'Wiele badań pokazuje, że umiarkowane podwyżki płacy minimalnej nie zwiększają wyraźnie bezrobocia.',
        'Many studies show that moderate minimum wage rises do not clearly increase unemployment.',
        Object.assign({ supports: ['center', 'left'] }, N('Prawda dla umiarkowanych podwyżek - przy bardzo wysokich ryzyko rośnie.', 'True for moderate rises - the risk grows with very large ones.')))
    ], excludes: [['b5', 'b10', { pl: 'Pojedyncza historia znajomego przeczy temu, co mówią badania - trzeba wybrać, czemu bardziej ufasz.', en: 'A friend\'s single story contradicts what studies show - you need to decide which you trust more.' }]] },

    { q: 'x_migration', args: [
      A('c1', 'good', 'Ludzie uciekający przed wojną mają prawo szukać schronienia - to podstawa prawa międzynarodowego.',
        'People fleeing war have the right to seek refuge - it is a foundation of international law.',
        Object.assign({ supports: ['left'] }, N('Konwencja genewska o uchodźcach z 1951 r. - Polska ją podpisała.', 'The 1951 Geneva Refugee Convention - Poland has signed it.'))),
      A('c2', 'good', 'Równa płaca dla imigrantów chroni też pensje Polaków przed zaniżaniem.',
        'Equal pay for immigrants also protects Poles\' wages from being undercut.',
        Object.assign({ supports: ['left_soc', 'left'], conflicts: [{ q: 'x_minwage', camps: ['right'],
          note: { pl: 'Chcesz chronić płace przed zaniżaniem, a jednocześnie zniósłbyś płacę minimalną.', en: 'You want to protect wages from undercutting, yet you would abolish the minimum wage.' } }] },
          N('Argument związkowy: problemem nie jest imigrant, tylko tani pracownik.', 'A trade-union argument: the problem is not the immigrant but cheap labour.'))),
      A('c3', 'good', 'Społeczeństwo się starzeje i gospodarka potrzebuje rąk do pracy, ale państwo musi kontrolować, kto przyjeżdża.',
        'Society is ageing and the economy needs workers, but the state must control who comes.',
        Object.assign({ supports: ['center'] }, N('Pragmatyczne połączenie potrzeb rynku i kontroli.', 'A pragmatic mix of labour-market needs and control.'))),
      A('c4', 'good', 'Szybka imigracja z odległych kultur utrudnia integrację, więc najpierw warto wspierać dzietność i powroty Polaków.',
        'Rapid immigration from distant cultures makes integration harder, so it is better first to support births and Poles returning.',
        Object.assign({ supports: ['right'] }, N('Spójny argument prawicy, oparty na doświadczeniach części krajów Zachodu.', 'A coherent right-wing argument, based on the experience of some Western countries.'))),
      A('c5', 'fallacy', 'Imigranci to przestępcy - widziałem w internecie film z bójką.',
        'Immigrants are criminals - I saw a video of a fight online.', { fallacy: 'generalization' }),
      A('c6', 'fallacy', 'Przeciwnicy imigracji to po prostu rasiści.',
        'Opponents of immigration are simply racists.', { fallacy: 'adhominem' }),
      A('c7', 'false', 'Polska przyjęła po 2022 r. mniej niż 10 tys. uchodźców z Ukrainy.',
        'Poland took in fewer than 10,000 Ukrainian refugees after 2022.',
        N('Nieprawda: w Polsce schronienie znalazło ok. miliona uchodźców z Ukrainy.', 'False: about a million Ukrainian refugees found shelter in Poland.')),
      A('c8', 'fallacy', 'Albo przyjmujemy wszystkich chętnych, albo jesteśmy ludźmi bez serca.',
        'Either we take in everyone who wants to come, or we are heartless.', { fallacy: 'falsedilemma' }),
      A('c9', 'good', 'Państwo ma prawo decydować, kto przekracza jego granice.',
        'A state has the right to decide who crosses its borders.',
        Object.assign({ supports: ['right', 'center'] }, N('Zasada suwerenności - uznawana także przez większość centrum.', 'The sovereignty principle - accepted by most of the centre too.'))),
      A('c10', 'good', 'Legalne ścieżki przyjazdu odbierają klientów przemytnikom ludzi.',
        'Legal routes to come take customers away from people smugglers.',
        Object.assign({ supports: ['left_lib', 'center'] }, N('Argument praktyczny: gdy brak legalnej drogi, rośnie nielegalna.', 'A practical argument: without a legal route, the illegal one grows.')))
    ], excludes: [['c3', 'c8', { pl: '„Kontrolowana” imigracja wyklucza myślenie „wszyscy albo nikt”.', en: '"Controlled" immigration rules out "everyone or no one" thinking.' }]] },

    { q: 'x_draft', args: [
      A('d1', 'good', 'Nowoczesna wojna wymaga specjalistów; poborowy po kilku miesiącach nie obsłuży drona czy systemu obrony powietrznej.',
        'Modern war needs specialists; a conscript after a few months cannot operate a drone or an air-defence system.',
        Object.assign({ supports: ['left', 'center'] }, N('Główny argument za armią zawodową.', 'The main argument for a professional army.'))),
      A('d2', 'good', 'Dobrowolne, dobrze płatne szkolenia dają rezerwę bez zmuszania ludzi, którzy mają inne plany na życie.',
        'Voluntary, well-paid training builds a reserve without forcing people who have other plans.',
        Object.assign({ supports: ['center'] }, N('Kompromis: więcej przeszkolonych bez przymusu.', 'A compromise: more trained people without compulsion.'))),
      A('d3', 'good', 'Kraj, w którym każdy umie się bronić, jest zbyt kosztowny do zaatakowania.',
        'A country where everyone can defend themselves is too costly to attack.',
        Object.assign({ supports: ['right'] }, N('Logika odstraszania - na niej opiera się obrona Finlandii czy Szwajcarii.', 'The logic of deterrence - the basis of Finnish and Swiss defence.'))),
      A('d4', 'good', 'Finlandia ma pobór i jedną z największych rezerw w Europie, choć ma tylko 5,5 mln mieszkańców.',
        'Finland has conscription and one of Europe\'s largest reserves, though it has only 5.5 million people.',
        Object.assign({ supports: ['right'] }, N('Prawda - dobry przykład z życia.', 'True - a good real-world example.'))),
      A('d5', 'fallacy', 'Pobór zawsze był, więc powinien wrócić.',
        'There has always been conscription, so it should come back.', { fallacy: 'tradition' }),
      A('d6', 'fallacy', 'Jak wróci pobór, to za chwilę wyślą nas na wojnę za granicę.',
        'If conscription returns, they will soon send us to fight abroad.', { fallacy: 'slippery' }),
      A('d7', 'false', 'Polska zniosła pobór zaraz po upadku komunizmu, w 1989 r.',
        'Poland abolished conscription right after communism fell, in 1989.',
        N('Nieprawda: zasadnicza służba wojskowa obowiązywała do 2008 r., a od 2009 r. jest zawieszona (nie zniesiona).', 'False: compulsory service lasted until 2008 and has been suspended (not abolished) since 2009.')),
      A('d8', 'good', 'Pieniądze z utrzymania poborowej armii lepiej wydać na szkoły i szpitale.',
        'The money for a conscript army is better spent on schools and hospitals.',
        Object.assign({ supports: ['left'], conflicts: [{ q: 'x_defense', camps: ['right'],
          note: { pl: 'Mówisz, że pieniądze lepiej dać na szkoły niż na wojsko, a jednocześnie chcesz 5% PKB na armię.', en: 'You say the money is better spent on schools than the army, yet you want 5% of GDP for defence.' } }] },
          N('Argument „armaty czy masło” - spójny z lewicową wizją budżetu.', 'The "guns or butter" argument - consistent with a left-wing budget.'))),
      A('d9', 'fallacy', 'Przeciwnicy poboru to tchórze, którzy nie kochają ojczyzny.',
        'Opponents of conscription are cowards who do not love their country.', { fallacy: 'adhominem' }),
      A('d10', 'good', 'Państwo ma prawo wymagać od obywateli wysiłku dla wspólnego bezpieczeństwa.',
        'The state has the right to demand effort from citizens for common security.',
        Object.assign({ supports: ['right'], conflicts: [{ q: 'p_vaccines', camps: ['right'],
          note: { pl: 'Uważasz, że państwo może wymagać od obywateli wysiłku, ale przy szczepieniach - że nie może niczego narzucać.', en: 'You think the state may demand effort from citizens, but on vaccines that it may impose nothing.' } }] },
          N('Argument wspólnotowy: obywatelstwo to także obowiązki.', 'A communitarian argument: citizenship also means duties.')))
    ], excludes: [['d2', 'd10', { pl: '„Bez zmuszania” kłóci się z „państwo ma prawo wymagać” - to dwie różne wizje obowiązku obywatela.', en: '"Without compulsion" clashes with "the state may demand" - two different views of civic duty.' }]] },

    { q: 'x_death', args: [
      A('e1', 'good', 'Sądy się mylą, a po wykonaniu wyroku śmierci błędu nie da się już naprawić.',
        'Courts make mistakes, and once a death sentence is carried out the error cannot be undone.',
        Object.assign({ supports: ['left', 'center'] }, N('W USA uniewinniono ponad 190 osób skazanych wcześniej na śmierć.', 'In the USA over 190 people previously sentenced to death have been exonerated.'))),
      A('e2', 'good', 'Dożywocie bez prawa do zwolnienia chroni społeczeństwo równie skutecznie jak egzekucja.',
        'Life without parole protects society as effectively as execution.',
        Object.assign({ supports: ['center'] }, N('Główny argument „środka”: bezpieczeństwo bez nieodwracalnej kary.', 'The centre\'s main argument: safety without an irreversible penalty.'))),
      A('e3', 'good', 'Za najstraszniejsze zbrodnie sprawiedliwa kara musi być współmierna do czynu.',
        'For the most horrific crimes, a just punishment must match the deed.',
        Object.assign({ supports: ['right'] }, N('Argument z zasady sprawiedliwości odpłatnej - najmocniejszy po stronie zwolenników.', 'The retributive-justice argument - the strongest on the supporters\' side.'))),
      A('e4', 'good', 'Badania nie pokazują, by kara śmierci odstraszała od zbrodni wyraźnie bardziej niż dożywocie.',
        'Research does not show the death penalty deters crime clearly better than life imprisonment.',
        Object.assign({ supports: ['left', 'center'] }, N('Taki jest przeważający wniosek badań, m.in. amerykańskiej Narodowej Rady Badań (2012).', 'This is the prevailing research conclusion, including the US National Research Council (2012).'))),
      A('e5', 'false', 'Kraje z karą śmierci zawsze mają mniej morderstw niż kraje bez niej.',
        'Countries with the death penalty always have fewer murders than those without it.',
        N('Nieprawda: np. USA mają wyraźnie więcej zabójstw na mieszkańca niż kraje UE, które kary śmierci nie mają.', 'False: the USA, for example, has clearly more homicides per person than EU countries without the death penalty.')),
      A('e6', 'fallacy', 'W sondażach wielu Polaków popiera karę śmierci, więc trzeba ją przywrócić.',
        'Many Poles support the death penalty in polls, so it must be brought back.', { fallacy: 'popularity' }),
      A('e7', 'fallacy', 'Wyobraź sobie, że to Twoje dziecko zostało zamordowane - wtedy zmienisz zdanie.',
        'Imagine it was your child who was murdered - then you would change your mind.', { fallacy: 'emotion' }),
      A('e8', 'false', 'Polska może przywrócić karę śmierci i nadal pozostać w Unii Europejskiej.',
        'Poland could bring back the death penalty and still stay in the European Union.',
        N('Nieprawda: zakaz kary śmierci zapisano w Karcie praw podstawowych UE - jej przywrócenie oznaczałoby wyjście z Unii.', 'False: the ban is in the EU Charter of Fundamental Rights - bringing it back would mean leaving the Union.')),
      A('e9', 'good', 'Państwo nie powinno mieć prawa odbierać życia własnym obywatelom.',
        'The state should not have the right to take its own citizens\' lives.',
        Object.assign({ supports: ['left', 'center'], conflicts: [{ q: 'x_abortion', camps: ['left'],
          note: { pl: 'Część osób zobaczy napięcie z Twoim poparciem dla aborcji na życzenie. Warto umieć wyjaśnić, czym te sprawy się różnią.', en: 'Some will see a tension with your support for abortion on request. It is worth being able to explain how the issues differ.' } }] },
          N('Argument zasadniczy, wspierany też przez Kościół katolicki.', 'A principled argument, also backed by the Catholic Church.'))),
      A('e10', 'fallacy', 'Albo kara śmierci, albo morderca po kilku latach wyjdzie na wolność.',
        'Either the death penalty, or the murderer walks free after a few years.', { fallacy: 'falsedilemma' }),
      A('e11', 'good', 'Wykonany wyrok gwarantuje, że najgroźniejszy zbrodniarz nikogo już nie skrzywdzi - także współwięźniów czy strażników.',
        'An executed sentence guarantees the most dangerous criminal will never harm anyone again - including fellow inmates or guards.',
        Object.assign({ supports: ['right'] }, N('Argument z bezpieczeństwa - dożywocie nie chroni w pełni ludzi w więzieniu.', 'A safety argument - life imprisonment does not fully protect people inside prison.')))
    ], excludes: [['e4', 'e5', { pl: 'Jeden argument mówi, że kara śmierci nie odstrasza, drugi - że kraje z nią mają mniej morderstw. Oba naraz nie mogą być prawdą.', en: 'One says the death penalty does not deter, the other that countries with it have fewer murders. Both cannot be true at once.' }]] },

    { q: 'x_cannabis', args: [
      A('f1', 'good', 'Legalna sprzedaż odbiera rynek dilerom i pozwala kontrolować jakość i wiek kupujących.',
        'Legal sales take the market from dealers and allow control of quality and buyers\' age.',
        Object.assign({ supports: ['left', 'right_free'] }, N('Argument z doświadczeń Kanady i części stanów USA.', 'An argument from the experience of Canada and some US states.'))),
      A('f2', 'good', 'Wyrok za jointa niszczy młodym ludziom życie bardziej niż sama marihuana.',
        'A conviction for a joint harms young people\'s lives more than the cannabis itself.',
        Object.assign({ supports: ['center', 'left'] }, N('Główny argument za dekryminalizacją - Portugalia od 2001 r.', 'The main argument for decriminalisation - Portugal since 2001.'))),
      A('f3', 'good', 'Legalizacja może zwiększyć palenie wśród młodzieży, której mózg jeszcze się rozwija.',
        'Legalisation may increase use among teenagers, whose brains are still developing.',
        Object.assign({ supports: ['right_cons', 'center'] }, N('Uzasadniona obawa - wpływ na rozwijający się mózg jest dobrze udokumentowany.', 'A valid concern - the effect on the developing brain is well documented.'))),
      A('f4', 'good', 'Dorosły człowiek ma prawo decydować o własnym ciele, dopóki nie szkodzi innym.',
        'An adult has the right to decide about their own body as long as they do not harm others.',
        Object.assign({ supports: ['right_free', 'left'] }, N('Zasada szkody J.S. Milla - podstawa myślenia wolnościowego.', 'J.S. Mill\'s harm principle - the basis of liberty-minded thinking.'))),
      A('f5', 'fallacy', 'Każdy, kto zapali jointa, w końcu skończy na heroinie.',
        'Anyone who smokes a joint will end up on heroin.', { fallacy: 'slippery' }),
      A('f6', 'false', 'Marihuana jest już legalna w całej Unii Europejskiej.',
        'Cannabis is already legal across the whole European Union.',
        N('Nieprawda: w większości krajów UE jest nielegalna; częściowo zalegalizowały ją m.in. Malta, Luksemburg i Niemcy.', 'False: it is illegal in most EU countries; Malta, Luxembourg and Germany, among others, have partly legalised it.')),
      A('f7', 'fallacy', 'Marihuana to roślina, więc jest naturalna i bezpieczna.',
        'Cannabis is a plant, so it is natural and safe.', { fallacy: 'nature' }),
      A('f8', 'good', 'Państwo nie powinno wtrącać się w prywatne wybory dorosłych ludzi.',
        'The state should not interfere in the private choices of adults.',
        Object.assign({ supports: ['right_free', 'left'], conflicts: [
          { q: 'p_alcohol', camps: ['left'], note: { pl: 'Mówisz, że państwo nie powinno się wtrącać, a przy alkoholu chcesz zakazów i minimalnej ceny.', en: 'You say the state should not interfere, yet for alcohol you want bans and a minimum price.' } },
          { q: 'p_sugartax', camps: ['left'], note: { pl: 'Mówisz, że państwo nie powinno się wtrącać, a słodzone napoje chcesz wyżej opodatkować.', en: 'You say the state should not interfere, yet you want higher taxes on sugary drinks.' } }] },
          N('Argument wolnościowy.', 'A liberty argument.'))),
      A('f9', 'good', 'Państwo powinno chronić ludzi przed szkodliwymi używkami.',
        'The state should protect people from harmful substances.',
        Object.assign({ supports: ['right_cons'], conflicts: [{ q: 'p_alcohol', camps: ['right'],
          note: { pl: 'Chcesz chronić ludzi przed używkami, a przy alkoholu wybrałeś brak ograniczeń.', en: 'You want to protect people from harmful substances, yet for alcohol you chose no restrictions.' } }] },
          N('Argument opiekuńczy - spójny, jeśli stosujesz go też do alkoholu.', 'A protective argument - consistent if you also apply it to alcohol.'))),
      A('f10', 'fallacy', 'Wszyscy młodzi i tak palą, więc zakaz nie ma sensu.',
        'All young people smoke it anyway, so the ban makes no sense.', { fallacy: 'popularity' })
    ], excludes: [['f4', 'f9', { pl: '„Dorosły sam decyduje o swoim ciele” wyklucza „państwo ma chronić przed używkami”.', en: '"Adults decide about their own bodies" rules out "the state must protect people from substances".' }]] }
  ];

  // ── Adwokat diabła: osobne pytania; dla każdego stanowiska 2 dobre argumenty + pułapki ──
  // Talia kart: przy każdej karcie decydujesz, czy to dobry argument za wybraną stroną.
  const G = (id, camps, pl, en, npl, nen) => ({ id, kind: 'good', supports: camps, text: { pl, en }, note: { pl: npl, en: nen } });
  const F = (id, fallacy, pl, en) => ({ id, kind: 'fallacy', fallacy, text: { pl, en } });
  const X = (id, pl, en, npl, nen) => ({ id, kind: 'false', text: { pl, en }, note: { pl: npl, en: nen } });
  SZ.DEVIL = [
    { q: 'x_eu', args: [
      G('u1', ['left'], 'Wspólne standardy pracy w UE utrudniają firmom przenoszenie produkcji tam, gdzie najbardziej da się zaniżyć pensje.', 'Common EU labour standards make it harder for firms to move production to wherever wages can be pushed lowest.', 'Argument lewicy za wspólną polityką socjalną.', 'The left\'s argument for a common social policy.'),
      G('u2', ['left', 'center'], 'Zmiany klimatu nie znają granic - jedno państwo samo niewiele zdziała, cała Unia już tak.', 'Climate change knows no borders - one country alone can do little, the whole Union much more.', 'Argument za wspólną polityką klimatyczną.', 'An argument for a common climate policy.'),
      G('u3', ['center', 'left'], 'Do innych krajów UE trafia ok. trzech czwartych polskiego eksportu - silna Unia to silniejsza polska gospodarka.', 'About three quarters of Polish exports go to other EU countries - a strong Union means a stronger Polish economy.', 'Prawda - jednolity rynek to główny rynek polskich firm.', 'True - the single market is Polish firms\' main market.'),
      G('u4', ['center'], 'Wspólne zakupy uzbrojenia są tańsze, a Unia z 450 mln ludzi odstrasza skuteczniej niż pojedyncze państwo.', 'Joint arms purchases are cheaper, and a Union of 450 million deters better than a single country.', 'Argument za integracją w obronności.', 'An argument for defence integration.'),
      G('u5', ['right'], 'Decyzje podejmowane bliżej obywateli lepiej pasują do lokalnych potrzeb i łatwiej je rozliczyć.', 'Decisions taken closer to citizens fit local needs better and are easier to hold to account.', 'Zasada pomocniczości - najmocniejszy argument „Europy ojczyzn”.', 'The subsidiarity principle - the strongest "Europe of nations" argument.'),
      G('u6', ['right'], 'Prawo weta chroni mniejsze państwa przed przegłosowaniem w sprawach dla nich kluczowych.', 'The veto protects smaller states from being outvoted on issues vital to them.', 'Rzeczowy argument za jednomyślnością.', 'A solid argument for unanimity.'),
      F('u7', 'popularity', 'Większość Polaków popiera UE, więc każda nowa kompetencja dla Brukseli jest dobra.', 'Most Poles support the EU, so every new power for Brussels is good.'),
      X('u8', 'Polska wpłaca do budżetu UE więcej, niż z niego dostaje.', 'Poland pays more into the EU budget than it gets back.', 'Nieprawda: Polska jest największym beneficjentem netto budżetu UE.', 'False: Poland is the largest net beneficiary of the EU budget.'),
      F('u9', 'slippery', 'Każde oddanie kompetencji Brukseli to krok do likwidacji Polski jako państwa.', 'Every transfer of powers to Brussels is a step towards abolishing Poland as a state.')
    ] },
    { q: 'x_coal', args: [
      G('k1', ['left_soc'], 'Zamykanie kopalń bez nowych miejsc pracy zamienia miasta w biedne sypialnie - tak było w Wałbrzychu w latach 90.', 'Closing mines without new jobs turns towns into poor dormitories - as in Wałbrzych in the 1990s.', 'Prawdziwa lekcja z historii - argument za sprawiedliwą transformacją.', 'A real lesson from history - an argument for a just transition.'),
      G('k2', ['left_soc', 'center'], 'Transformacja musi mieć poparcie górników, inaczej zablokują ją protesty.', 'The transition needs miners\' support, or protests will block it.', 'Argument polityczny za odejściem z osłonami.', 'A political argument for a cushioned phase-out.'),
      G('k3', ['left_lib'], 'Smog z węgla przyczynia się w Polsce do dziesiątek tysięcy przedwczesnych zgonów rocznie.', 'Coal smog contributes to tens of thousands of premature deaths in Poland every year.', 'Prawda - tak szacuje m.in. Europejska Agencja Środowiska.', 'True - as estimated by the European Environment Agency, among others.'),
      G('k4', ['left_lib'], 'Prąd z wiatru i słońca należy dziś do najtańszych w przeliczeniu na koszt wytworzenia.', 'Wind and solar power are now among the cheapest per unit of generation cost.', 'Prawda - choć dochodzi koszt magazynowania i sieci.', 'True - although storage and grid costs come on top.'),
      G('k5', ['center'], 'Atom daje stały prąd bez emisji, gdy nie wieje i nie świeci - samo OZE tego nie zapewni.', 'Nuclear gives steady zero-emission power when there is no wind or sun - renewables alone cannot.', 'Główny argument za drogą „węgiel → atom + OZE”.', 'The main argument for "coal → nuclear + renewables".'),
      G('k6', ['center', 'left_soc'], 'Stopniowe odejście daje czas na przekwalifikowanie ludzi i budowę zastępczych elektrowni.', 'A gradual exit gives time to retrain people and build replacement plants.', 'Argument za tempem rozłożonym w czasie.', 'An argument for a phased pace.'),
      G('k7', ['right'], 'Węgiel jest nasz - nie musimy go od nikogo kupować, więc nikt nie może nas nim szantażować.', 'Coal is ours - we do not have to buy it from anyone, so no one can blackmail us with it.', 'Argument z bezpieczeństwa energetycznego.', 'An energy-security argument.'),
      G('k8', ['right'], 'Rosnące opłaty za emisje CO2 przy szybkim odejściu od węgla podnoszą rachunki rodzin.', 'Rising CO2 charges during a fast coal exit push up household bills.', 'Rzeczowy argument kosztowy.', 'A solid cost argument.'),
      X('k9', 'Polska wytwarza dziś ponad 90% prądu z węgla.', 'Poland currently makes over 90% of its electricity from coal.', 'Nieprawda: udział węgla spadł już poniżej 60%.', 'False: coal\'s share has already fallen below 60%.'),
      F('k10', 'tradition', 'Polska od zawsze stoi na węglu i tak powinno zostać.', 'Poland has always run on coal and it should stay that way.'),
      F('k11', 'adhominem', 'Za węglem są tylko lobbyści spółek węglowych.', 'Only coal-company lobbyists support coal.')
    ] },
    { q: 'x_guns', args: [
      G('g1', ['left'], 'Tam, gdzie broni jest dużo i łatwo ją kupić, częściej dochodzi do strzelanin i samobójstw z jej użyciem.', 'Where guns are plentiful and easy to buy, shootings and gun suicides happen more often.', 'Dobrze udokumentowana zależność.', 'A well-documented relationship.'),
      G('g2', ['left'], 'Broń trzymana w domu częściej kończy się wypadkiem lub tragedią w rodzinie niż obroną przed napastnikiem.', 'A gun kept at home more often ends in an accident or family tragedy than in self-defence.', 'Argument z badań nad bezpieczeństwem w domu.', 'An argument from research on home safety.'),
      G('g3', ['center'], 'Badania psychologiczne i egzamin odsiewają osoby niebezpieczne, a odpowiedzialni ludzie i tak mogą mieć broń.', 'Psychological tests and an exam screen out dangerous people, while responsible people can still own guns.', 'Argument za obecnym, kontrolowanym systemem.', 'An argument for the current controlled system.'),
      G('g4', ['center'], 'Przestępstwa z użyciem legalnie posiadanej broni są w Polsce bardzo rzadkie - obecny system działa.', 'Crimes with legally owned guns are very rare in Poland - the current system works.', 'Prawda - większość przestępstw z bronią dotyczy broni nielegalnej.', 'True - most gun crime involves illegal weapons.'),
      G('g5', ['right'], 'Uzbrojeni i przeszkoleni obywatele utrudniają życie przestępcom i ewentualnemu najeźdźcy.', 'Armed, trained citizens make life harder for criminals and any invader.', 'Argument z odstraszania i obrony totalnej.', 'An argument from deterrence and total defence.'),
      G('g6', ['right'], 'Czechy mają łatwiejszy dostęp do broni niż Polska i należą do najbezpieczniejszych krajów Europy.', 'Czechia has easier access to guns than Poland and is among Europe\'s safest countries.', 'Prawda - dobry przykład z regionu.', 'True - a good regional example.'),
      X('g7', 'W Polsce w ogóle nie można legalnie mieć broni palnej.', 'In Poland you cannot legally own a firearm at all.', 'Nieprawda: można, po zdaniu egzaminu i badaniach, np. do sportu lub kolekcji.', 'False: you can, after an exam and checks, e.g. for sport or collecting.'),
      F('g8', 'emotion', 'Wyobraź sobie strzelaninę w szkole Twojego dziecka - to wystarczy, żeby zakazać broni.', 'Imagine a shooting at your child\'s school - that is enough reason to ban guns.'),
      F('g9', 'falsedilemma', 'Albo każdy ma broń, albo jesteśmy bezbronni wobec bandytów.', 'Either everyone has a gun, or we are defenceless against criminals.')
    ] },
    { q: 'x_nuclear', args: [
      G('n1', ['left_soc'], 'Budowa i obsługa elektrowni jądrowej to tysiące stabilnych, dobrze płatnych miejsc pracy na dziesięciolecia.', 'Building and running a nuclear plant means thousands of stable, well-paid jobs for decades.', 'Argument socjalny za atomem.', 'A social argument for nuclear.'),
      G('n2', ['left_soc'], 'Państwowa elektrownia może sprzedawać prąd po przewidywalnej cenie przez kilkadziesiąt lat.', 'A state-owned plant can sell power at a predictable price for decades.', 'Argument za publiczną własnością energetyki.', 'An argument for public ownership of energy.'),
      G('n3', ['left_lib'], 'Elektrownie jądrowe w Europie często powstają wiele lat dłużej i dużo drożej, niż planowano.', 'Nuclear plants in Europe often take many years longer and cost much more than planned.', 'Prawda - np. Olkiluoto 3 w Finlandii i Flamanville we Francji.', 'True - e.g. Olkiluoto 3 in Finland and Flamanville in France.'),
      G('n4', ['left_lib'], 'Farmy wiatrowe, słoneczne i magazyny energii można postawić znacznie szybciej niż jedną elektrownię jądrową.', 'Wind and solar farms and storage can be built much faster than a single nuclear plant.', 'Rzeczowy argument o tempie transformacji.', 'A solid argument about the pace of transition.'),
      G('n5', ['center', 'left_soc', 'right'], 'Atom nie emituje CO2 i pracuje niezależnie od pogody, więc dobrze uzupełnia OZE.', 'Nuclear emits no CO2 and runs regardless of weather, so it complements renewables well.', 'Najczęstszy argument za atomem.', 'The most common argument for nuclear.'),
      G('n6', ['center', 'right'], 'Francja dzięki atomowi ma jeden z najczystszych miksów energii w Europie.', 'Thanks to nuclear, France has one of Europe\'s cleanest power mixes.', 'Prawda - ok. 70% prądu z atomu.', 'True - about 70% of its power is nuclear.'),
      G('n7', ['right'], 'Duży program jądrowy to niezależność od importowanego gazu i szantażu energetycznego.', 'A big nuclear programme means independence from imported gas and energy blackmail.', 'Argument z bezpieczeństwa.', 'A security argument.'),
      X('n8', 'Elektrownie jądrowe emitują więcej CO2 niż węglowe.', 'Nuclear plants emit more CO2 than coal plants.', 'Nieprawda: emisje atomu w całym cyklu życia są kilkadziesiąt razy niższe niż węgla.', 'False: nuclear\'s life-cycle emissions are dozens of times lower than coal\'s.'),
      F('n9', 'generalization', 'Czarnobyl pokazał, że każda elektrownia jądrowa to tykająca bomba.', 'Chernobyl showed that every nuclear plant is a ticking bomb.'),
      F('n10', 'popularity', 'Większość Polaków popiera atom, więc to na pewno najlepsze rozwiązanie.', 'Most Poles support nuclear, so it must be the best solution.')
    ] },
    { q: 'x_schoolrel', args: [
      G('s1', ['left'], 'Szkoła publiczna jest dla dzieci wszystkich wyznań i niewierzących, więc nie powinna uczyć jednej wiary.', 'A state school serves children of all faiths and none, so it should not teach one faith.', 'Argument z neutralności państwa.', 'An argument from state neutrality.'),
      G('s2', ['left'], 'Nauka o wielu religiach uczy tolerancji i rozumienia świata lepiej niż katecheza jednego wyznania.', 'Learning about many religions teaches tolerance and understanding better than one faith\'s catechism.', 'Argument edukacyjny.', 'An educational argument.'),
      G('s3', ['center'], 'Dobrowolna religia na pierwszej lub ostatniej lekcji nie zabiera czasu tym, którzy na nią nie chodzą.', 'Voluntary religion in the first or last period takes no time from those who do not attend.', 'Praktyczny argument za kompromisem.', 'A practical argument for compromise.'),
      G('s4', ['center'], 'Wielu rodziców chce religii w szkole, a dobrowolność szanuje też tych, którzy nie chcą.', 'Many parents want religion at school, and making it voluntary respects those who do not.', 'Argument z poszanowania obu stron.', 'An argument from respecting both sides.'),
      G('s5', ['right', 'center'], 'Chrześcijaństwo ukształtowało polską kulturę - bez jego znajomości trudno zrozumieć historię i sztukę.', 'Christianity shaped Polish culture - without knowing it, history and art are hard to understand.', 'Argument kulturowy.', 'A cultural argument.'),
      G('s6', ['right'], 'Obowiązkowy wybór religii albo etyki sprawia, że każdy uczeń dostaje jakieś wychowanie moralne.', 'A compulsory choice of religion or ethics means every pupil gets some moral education.', 'Argument za obowiązkowym wyborem.', 'An argument for a compulsory choice.'),
      X('s7', 'Lekcje religii w polskich szkołach są obowiązkowe dla wszystkich uczniów.', 'Religion lessons in Polish schools are compulsory for all pupils.', 'Nieprawda: religia jest dobrowolna, o udziale decydują rodzice lub pełnoletni uczniowie.', 'False: religion is voluntary; parents or adult pupils decide.'),
      F('s8', 'tradition', 'Religia była w szkołach od wieków, więc musi zostać.', 'Religion has been in schools for centuries, so it must stay.'),
      F('s9', 'adhominem', 'Religii w szkole chcą tylko ci, którzy chcą indoktrynować dzieci.', 'Only people who want to indoctrinate children want religion at school.')
    ] },
    { q: 'x_courts', args: [
      G('j1', ['left'], 'Sąd musi móc orzekać przeciw rządowi, a to łatwiejsze, gdy politycy nie decydują o karierach sędziów.', 'A court must be able to rule against the government, which is easier when politicians do not decide judges\' careers.', 'Argument z trójpodziału władzy.', 'An argument from the separation of powers.'),
      G('j2', ['left'], 'Trybunał Sprawiedliwości UE orzekał, że reforma KRS z 2017 r. naruszyła niezależność sądów.', 'The EU Court of Justice ruled that the 2017 judicial council reform violated judicial independence.', 'Prawda - argument z orzecznictwa europejskiego.', 'True - an argument from European case law.'),
      G('j3', ['center'], 'Wymóg dużej większości w parlamencie zmusza rząd i opozycję do porozumienia przy wyborze sędziów.', 'Requiring a large majority in parliament forces government and opposition to agree on judges.', 'Argument za modelem kompromisowym.', 'An argument for the compromise model.'),
      G('j4', ['center'], 'W Niemczech sędziów trybunału konstytucyjnego wybiera parlament większością 2/3, a sąd cieszy się dużym zaufaniem.', 'In Germany parliament elects constitutional judges by a two-thirds majority, and the court is widely trusted.', 'Prawda - dobry przykład z zagranicy.', 'True - a good example from abroad.'),
      G('j5', ['right'], 'Sędziowie, którzy sami wybierają swoich następców, mogą stać się zamkniętą kastą bez kontroli obywateli.', 'Judges who choose their own successors can become a closed caste beyond citizens\' control.', 'Argument za demokratyczną kontrolą sądów.', 'An argument for democratic control of courts.'),
      G('j6', ['right'], 'W wielu stanach USA sędziów wybierają obywatele w wyborach.', 'In many US states citizens elect judges.', 'Prawda - przykład większego wpływu wyborców.', 'True - an example of greater voter influence.'),
      X('j7', 'W Polsce sędziów wybierają obywatele w wyborach powszechnych.', 'In Poland citizens elect judges in general elections.', 'Nieprawda: sędziów powołuje prezydent na wniosek Krajowej Rady Sądownictwa.', 'False: judges are appointed by the president on the motion of the National Council of the Judiciary.'),
      F('j8', 'adhominem', 'Sędziowie bronią swojej niezależności tylko dlatego, że boją się utraty przywilejów.', 'Judges defend their independence only because they fear losing their privileges.'),
      F('j9', 'slippery', 'Jeśli politycy wybiorą choć jednego sędziego, za rok będziemy mieć dyktaturę.', 'If politicians pick even one judge, within a year we will have a dictatorship.')
    ] }
  ];

  // ── Zmiana zdania: osobne pytania; najmocniejszy fakt lub argument przeciw każdemu stanowisku ──
  const C = (pl, en) => ({ pl, en });
  SZ.CHALLENGES = {
    x_health: {
      left: C('W brytyjskiej, w pełni publicznej służbie zdrowia NHS kolejka na planowe leczenie przekroczyła w 2023 r. 7 mln przypadków.', 'In Britain\'s fully public NHS, the waiting list for planned treatment exceeded 7 million cases in 2023.'),
      center: C('Gdy prywatne placówki leczą za publiczne pieniądze, często wybierają najbardziej opłacalne zabiegi, a trudne przypadki zostają w szpitalach publicznych.', 'When private providers treat with public money, they often pick the most profitable procedures, leaving difficult cases to public hospitals.'),
      right: C('Szwajcarski system z konkurującymi prywatnymi ubezpieczycielami należy do najdroższych na świecie, a składki są dużym obciążeniem dla rodzin.', 'The Swiss system with competing private insurers is among the world\'s most expensive, and premiums are a heavy burden for families.')
    },
    x_crime: {
      left: C('Kary alternatywne słabo chronią ofiary przemocy domowej, gdy sprawca zostaje w tym samym mieście, a czasem w tym samym domu.', 'Alternative sentences protect domestic violence victims poorly when the offender stays in the same town, sometimes the same home.'),
      center: C('Pewność kary zależy od wykrywalności, a przy niektórych przestępstwach, np. włamaniach, sprawców wykrywa się rzadko.', 'Certainty of punishment depends on detection, and for some crimes, such as burglary, offenders are rarely caught.'),
      right: C('USA mają jeden z najwyższych na świecie odsetków więźniów i bardzo surowe kary, a przestępczość z użyciem przemocy wciąż jest tam wyższa niż w Europie.', 'The USA has one of the world\'s highest incarceration rates and very harsh sentences, yet violent crime is still higher there than in Europe.')
    },
    x_ai: {
      left: C('Surowe regulacje mogą sprawić, że firmy AI będą powstawać w USA i Chinach, a Europa będzie tylko kupować ich produkty.', 'Strict regulation may mean AI companies are founded in the USA and China, with Europe merely buying their products.'),
      center: C('Nowe zastosowania AI pojawiają się szybciej, niż urzędnicy zdążą ocenić ich ryzyko - podział na kategorie może nie nadążyć.', 'New AI uses appear faster than officials can assess their risk - risk categories may not keep up.'),
      right_cons: C('Polska nie ma własnego modelu AI na skalę światową - bez współpracy z zagranicznymi firmami trudno korzystać z najlepszych narzędzi.', 'Poland has no world-class AI model of its own - without foreign companies it is hard to use the best tools.'),
      right_free: C('Bez reguł algorytmy już dyskryminowały: system rekrutacyjny Amazona faworyzował mężczyzn i został wycofany w 2018 r.', 'Without rules algorithms have already discriminated: Amazon\'s hiring system favoured men and was scrapped in 2018.')
    },
    x_surveil: {
      left: C('Europejskie służby wielokrotnie udaremniały zamachy dzięki szybkiemu dostępowi do komunikatorów podejrzanych.', 'European security services have repeatedly foiled attacks thanks to fast access to suspects\' messaging.'),
      center: C('Polskie sądy zatwierdzają niemal wszystkie wnioski służb o kontrolę operacyjną - nadzór sądu bywa formalnością.', 'Polish courts approve almost all service requests for surveillance - court oversight can be a formality.'),
      right_cons: C('Afera Pegasusa pokazała, że szerokie uprawnienia służb mogą zostać użyte przeciw opozycji i dziennikarzom.', 'The Pegasus affair showed that broad surveillance powers can be used against the opposition and journalists.'),
      right_free: C('Bez kontroli komunikacji trudno wykryć siatki szpiegów i sabotażystów - w Polsce zatrzymano ich w ostatnich latach dziesiątki.', 'Without monitoring communication it is hard to detect spy and sabotage networks - dozens have been arrested in Poland in recent years.')
    },
    x_housing: {
      left: C('Limit czynszów w Berlinie z 2020 r. zmniejszył liczbę mieszkań na wynajem - część właścicieli wycofała je z rynku, a w 2021 r. sąd uchylił przepisy.', 'Berlin\'s 2020 rent cap reduced the number of rental flats - some landlords withdrew them, and in 2021 a court struck the law down.'),
      center: C('Gdy pieniądze rozkłada się na wiele małych programów, żaden nie ma dość siły, by realnie zmienić rynek.', 'When money is spread over many small programmes, none is strong enough to really change the market.'),
      right_cons: C('Po starcie „Bezpiecznego kredytu 2%” w 2023 r. ceny mieszkań w dużych miastach szybko wzrosły, więc część dopłaty zjadły wyższe ceny.', 'After the "Safe 2% Loan" began in 2023, flat prices in big cities rose fast, so higher prices ate up part of the subsidy.'),
      right_free: C('Nawet w miastach, gdzie buduje się dużo, ceny rosną, bo mieszkania kupują też inwestorzy na wynajem.', 'Even in cities that build a lot, prices rise because investors also buy flats to let.')
    },
    x_euro: {
      left: C('Grecja w strefie euro nie mogła osłabić własnej waluty w kryzysie i przeszła wieloletnią, bolesną recesję.', 'Greece, in the euro area, could not devalue its own currency in the crisis and went through a long, painful recession.'),
      center: C('Czekanie na zrównanie płac może trwać dekady, a Słowacja i państwa bałtyckie dobrze rozwijały się po przyjęciu euro.', 'Waiting for wages to catch up could take decades, while Slovakia and the Baltic states did well after adopting the euro.'),
      right: C('Wahania kursu złotego podnoszą koszty firm handlujących z UE, a przy euro znika koszt wymiany waluty dla firm i turystów.', 'Złoty exchange-rate swings raise costs for firms trading with the EU, while the euro removes currency-exchange costs for firms and tourists.')
    }
  };

  // ── Wybory z kosztem: dzielisz 100 mld zł; oczekiwanie wynika z Twoich osi ──
  // signal: jak wynik na osi przekłada się na „chcę na to więcej” (+) albo „mniej” (-)
  SZ.BUDGET = [
    { id: 'army', icon: '🛡️', name: C('Wojsko', 'Defence'), signal: { sec: 1 } },
    { id: 'health', icon: '🏥', name: C('Ochrona zdrowia', 'Healthcare'), signal: { econ: -0.8 } },
    { id: 'family', icon: '👨‍👩‍👧', name: C('Świadczenia dla rodzin (800 plus)', 'Family benefits (800 plus)'), signal: { soc: 0.6, econ: -0.4 } },
    { id: 'taxcut', icon: '💸', name: C('Obniżka podatków', 'Tax cuts'), signal: { econ: 1 } },
    { id: 'school', icon: '🎓', name: C('Edukacja i nauka', 'Education and science'), signal: { econ: -0.5, tech: 0.3 } },
    { id: 'climate', icon: '🌳', name: C('Klimat i czysta energia', 'Climate and clean energy'), signal: { eco: -1 } },
    { id: 'police', icon: '⚖️', name: C('Policja i sądy', 'Police and courts'), signal: { just: 0.8 } },
    { id: 'debt', icon: '📉', name: C('Spłata długu', 'Paying off debt'), signal: { econ: 0.6 } }
  ];
})();
