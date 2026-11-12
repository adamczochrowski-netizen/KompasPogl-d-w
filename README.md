# Kompas Poglądów

Apka do określania swojego światopoglądu na 10 osiach:
Gospodarka, Władza (demokracja ↔ totalitaryzm), Obyczaje, Świat, Ekologia, Religia,
Bezpieczeństwo, Sprawiedliwość, Technologia, Ustrój terytorialny.

Działa na komputerze i na telefonie. Na telefonie można ją zainstalować jak zwykłą aplikację i używać bez internetu.

Strona: https://adamczochrowski-netizen.github.io/KompasPogl-d-w/

## Uruchomienie
- **Na komputerze:** dwuklik w `index.html` albo dowolny prosty serwer, np. `python -m http.server 8765`.
- **Na telefonie:** otwórz adres strony i wybierz „Dodaj do ekranu głównego” (Android: menu ⋮, iPhone: przycisk Udostępnij).

Odpowiedzi zapisują się w przeglądarce, na danym urządzeniu.

## Co jest w środku
- **📝 Test:** stałe 60 pytań, po kilka z każdego tematu.
- **🗂️ Tematy:** 12 dziedzin po 20 pytań; przy każdym podejściu losuje się 10, najpierw te bez odpowiedzi. Odpowiedzi są wspólne z testem.
- **Pytania w formie stanowisk:** wybierasz stanowisko najbliższe Tobie. Lewica dzieli się na socjalną i progresywną, a prawica na konserwatywną i wolnorynkową tam, gdzie się różnią. Karty są zawsze w kolejności lewica → centrum → prawica.
- **Dymek „i”:** o co chodzi, ważność odpowiedzi oraz dlaczego dany obóz tak uważa, przykład i link do Wikipedii.
- **Wynik:** mapa ideologii (30 ideologii, najbliższe dopasowania), Twoje osie (niepewne są wyszarzone) i Twój rozkład lewica / centrum / prawica.
- **Dopasowanie:** partie (Polska, Europa, Ameryki, Azja, Afryka) i 3 postacie (z Polski, ze świata i z fikcji).
- **Więcej:** kompas 2D z dowolnymi osiami, migawki i porównanie ze znajomym, lista odpowiedzi. W menu ⋯: raport (PDF), obrazek PNG, eksport i import, przelosowanie.

Wszystkie pozycje partii, postaci i ideologii to przybliżone szacunki.

## Publikacja na GitHub Pages
Repozytorium `KompasPogl-d-w`, Pages z gałęzi `main`, folder `/ (root)`.
Przy każdej zmianie podbij numer `CACHE` w `sw.js`, żeby telefony szybciej pobrały nową wersję.

## Pliki
- `index.html`, `css/style.css`: wygląd
- `js/positions*.js`: 60 pytań testu
- `js/pool-*.js`: pytania tylko do Tematów (`pool: true`)
- `js/topics.js`: przypisanie pytań do tematów
- `js/ideologies.js`: ideologie na mapie
- `js/data.js`: osie i obozy
- `js/references.js`: partie i postacie (wektor 10 wartości od -1 do 1, w kolejności osi)
- `js/i18n.js`: teksty interfejsu (PL / EN)
- `js/charts.js`: kompas 2D
- `js/app.js`: logika
- `manifest.webmanifest`, `sw.js`, `icons/`: instalacja na telefonie i działanie offline
- `_na-pozniej/`: odłożony asystent głosowy i stare pytania ze skalą (nie są wczytywane)

## Dodanie pytania (stanowiska)
```js
{ id: 'x_nazwa', type: 'positions',          // pool: true - tylko w Tematach
  text: { pl: 'Pytanie?', en: 'Question?' },
  what: { pl: 'O co chodzi', en: '…' },
  options: [
    { camp: 'left', effects: { econ: -0.9 },
      text: { pl: 'Stanowisko', en: '…' }, why: { pl: 'Dlaczego', en: '…' },
      example: { pl: 'Przykład', en: '…' }, wiki: { pl: 'Hasło Wikipedii', en: 'Wikipedia title' } },
    { camp: 'center', … }, { camp: 'right', … }   // albo left_soc / left_lib, right_cons / right_free
  ] }
```
`effects` to „adres” stanowiska na osiach, od -1 do 1. Odpowiedź zapisuje się jako numer stanowiska na liście,
więc nowe stanowisko dopisuj na końcu albo dodaj wpis do `OPTION_INSERTS` w `js/app.js`.
