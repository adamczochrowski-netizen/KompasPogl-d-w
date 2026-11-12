// Tematy do trybu „Tematy”: każde pytanie może należeć do kilku tematów.
// Odpowiedzi są wspólne z pełnym testem — pytanie odpowiedziane w temacie liczy się też w teście.
window.SZ = window.SZ || {};

SZ.TOPICS = [
  { id: 'economy', icon: '💰', name: { pl: 'Gospodarka i podatki', en: 'Economy and taxes' },
    ids: ['x_tax', 'x_minwage', 'x_stateco', 'x_trade', 'x_inherit', 'x_euro', 'x_localtax'] },
  { id: 'social', icon: '🏥', name: { pl: 'Zdrowie i pomoc społeczna', en: 'Health and welfare' },
    ids: ['x_health', 'x_welfare', 'x_childcare', 'x_housing', 'x_minwage'] },
  { id: 'education', icon: '🎓', name: { pl: 'Edukacja i szkoła', en: 'Education and school' },
    ids: ['x_sexed', 'x_schoolrel', 'x_curriculum', 'x_kidsonline'] },
  { id: 'family', icon: '👨‍👩‍👧', name: { pl: 'Rodzina i obyczaje', en: 'Family and social values' },
    ids: ['x_unions', 'x_abortion', 'x_cannabis', 'x_quotas', 'x_childcare', 'x_sexed'] },
  { id: 'state', icon: '🏛️', name: { pl: 'Państwo i demokracja', en: 'State and democracy' },
    ids: ['x_courts', 'x_pubmedia', 'x_referendum', 'x_surveil', 'x_regions'] },
  { id: 'world', icon: '🌍', name: { pl: 'Polska i świat', en: 'Poland and the world' },
    ids: ['x_eu', 'x_migration', 'x_euro', 'x_trade', 'x_ukraine'] },
  { id: 'climate', icon: '🌳', name: { pl: 'Klimat i energia', en: 'Climate and energy' },
    ids: ['x_coal', 'x_nuclear', 'x_cars', 'x_forest', 'x_flights'] },
  { id: 'religion', icon: '⛪', name: { pl: 'Religia i Kościół', en: 'Religion and church' },
    ids: ['x_religion', 'x_schoolrel', 'x_churchfund', 'x_blasphemy'] },
  { id: 'security', icon: '🛡️', name: { pl: 'Wojsko i bezpieczeństwo', en: 'Defence and security' },
    ids: ['x_draft', 'x_defense', 'x_guns', 'x_ukraine', 'x_surveil'] },
  { id: 'justice', icon: '⚖️', name: { pl: 'Prawo i kary', en: 'Law and punishment' },
    ids: ['x_crime', 'x_death', 'x_juvenile', 'x_prison', 'x_cannabis'] },
  { id: 'tech', icon: '💻', name: { pl: 'Technologia', en: 'Technology' },
    ids: ['x_ai', 'x_kidsonline', 'x_cash', 'x_nuclear'] },
  { id: 'local', icon: '🏘️', name: { pl: 'Samorząd i miasto', en: 'Local government and cities' },
    ids: ['x_localtax', 'x_partbudget', 'x_regions', 'x_curriculum', 'x_cars', 'x_housing'] }
];
