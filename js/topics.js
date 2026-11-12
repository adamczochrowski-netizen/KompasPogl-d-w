// Tematy do trybu „Tematy”: każde pytanie może należeć do kilku tematów.
// Odpowiedzi są wspólne z pełnym testem - pytanie odpowiedziane w temacie liczy się też w teście.
window.SZ = window.SZ || {};

SZ.TOPICS = [
  { id: 'economy', icon: '💰', name: { pl: 'Gospodarka i podatki', en: 'Economy and taxes' },
    ids: ['x_tax', 'x_minwage', 'x_stateco', 'x_trade', 'x_inherit', 'x_euro', 'x_localtax', 'x_digitaltax', 'x_pension', 'p_vat', 'p_wealthtax', 'p_cit', 'p_pricecaps', 'p_sunday', 'p_debt', 'p_contracts', 'p_tradeunions', 'p_ubi', 'p_megaproj', 'p_farms'] },
  { id: 'social', icon: '🏥', name: { pl: 'Zdrowie i pomoc społeczna', en: 'Health and welfare' },
    ids: ['x_health', 'x_welfare', 'x_childcare', 'x_housing', 'x_minwage', 'x_pension', 'p_ubi', 'p_schoolfood', 'p_pricecaps', 'p_contracts', 'p_queues', 'p_drugs', 'p_carers', 'p_800', 'p_homeless', 'p_euthanasia', 'p_alcohol', 'p_sugartax', 'p_vaccines', 'p_mental'] },
  { id: 'education', icon: '🎓', name: { pl: 'Edukacja i szkoła', en: 'Education and school' },
    ids: ['x_sexed', 'x_schoolrel', 'x_curriculum', 'x_kidsonline', 'p_homework', 'p_grades', 'p_privschool', 'p_teachers', 'p_tuition', 'p_phones', 'p_history', 'p_tracking', 'p_gimnazja', 'p_vocational', 'p_schoolage', 'p_ngoschool', 'p_shooting', 'p_aischool', 'p_exams', 'p_schoolfood'] },
  { id: 'family', icon: '👨‍👩‍👧', name: { pl: 'Rodzina i obyczaje', en: 'Family and social values' },
    ids: ['x_unions', 'x_abortion', 'x_cannabis', 'x_quotas', 'x_childcare', 'x_sexed', 'x_ivf', 'x_gender', 'p_sunday', 'p_schoolage', 'p_divorce', 'p_spanking', 'p_surrogacy', 'p_prostitution', 'p_porn', 'p_leave', 'p_eldercare', 'p_pill', 'p_800', 'p_euthanasia'] },
  { id: 'state', icon: '🏛️', name: { pl: 'Państwo i demokracja', en: 'State and democracy' },
    ids: ['x_courts', 'x_pubmedia', 'x_referendum', 'x_surveil', 'x_regions', 'x_partyfund', 'x_digitalid', 'x_partbudget', 'p_termlimits', 'p_voteage', 'p_compvote', 'p_electoral', 'p_president', 'p_ipn', 'p_esbek', 'p_officials', 'p_protests', 'p_hatespeech', 'p_mediaown', 'p_evoting'] },
  { id: 'world', icon: '🌍', name: { pl: 'Polska i świat', en: 'Poland and the world' },
    ids: ['x_eu', 'x_migration', 'x_euro', 'x_trade', 'x_ukraine', 'x_foreignaid', 'x_usa', 'x_china', 'p_mediaown', 'x_digitaltax', 'p_farms', 'p_polexit', 'p_ukrrefugees', 'p_reparations', 'p_repatriation', 'p_euconditional', 'p_ukraineeu', 'p_icc', 'p_landsale', 'p_schengen'] },
  { id: 'climate', icon: '🌳', name: { pl: 'Klimat i energia', en: 'Climate and energy' },
    ids: ['x_coal', 'x_nuclear', 'x_cars', 'x_forest', 'x_flights', 'p_pricecaps', 'p_megaproj', 'p_farms', 'x_villagebus', 'p_stoves', 'p_ev', 'p_windfarms', 'p_hunting', 'p_meat', 'p_wolves', 'p_rivers', 'p_ets2', 'p_netzero', 'p_plastic', 'p_gmo'] },
  { id: 'religion', icon: '⛪', name: { pl: 'Religia i Kościół', en: 'Religion and church' },
    ids: ['x_religion', 'x_schoolrel', 'x_churchfund', 'x_blasphemy', 'x_crosses', 'p_sunday', 'p_euthanasia', 'x_ivf', 'x_abortion', 'p_concordat', 'p_abuse', 'p_headscarf', 'p_chaplains', 'p_churchproperty', 'p_ritual', 'p_pulpit', 'p_conscience', 'p_christeurope', 'p_holidays', 'p_pill'] },
  { id: 'security', icon: '🛡️', name: { pl: 'Wojsko i bezpieczeństwo', en: 'Defence and security' },
    ids: ['x_draft', 'x_defense', 'x_guns', 'x_ukraine', 'x_surveil', 'x_border', 'x_nukes', 'x_usa', 'p_shooting', 'p_schengen', 'x_china', 'p_wot', 'p_armysize', 'p_armsindustry', 'p_shelters', 'p_sabotage', 'p_peacekeepers', 'p_cyber', 'p_armsexport', 'p_womenarmy'] },
  { id: 'justice', icon: '⚖️', name: { pl: 'Prawo i kary', en: 'Law and punishment' },
    ids: ['x_crime', 'x_death', 'x_juvenile', 'x_prison', 'x_cannabis', 'x_selfdefense', 'p_spanking', 'p_esbek', 'p_icc', 'x_guns', 'p_protests', 'p_hatespeech', 'x_surveil', 'p_registry', 'p_castration', 'p_prisonwork', 'p_speeding', 'p_drunkcar', 'p_policeoversight', 'p_harddrugs'] },
  { id: 'tech', icon: '💻', name: { pl: 'Technologia', en: 'Technology' },
    ids: ['x_ai', 'x_kidsonline', 'x_cash', 'x_nuclear', 'x_digitaltax', 'x_digitalid', 'p_aischool', 'p_phones', 'p_porn', 'p_evoting', 'p_ev', 'p_gmo', 'p_vaccines', 'p_megaproj', 'p_robottax', 'p_crypto', 'p_facerec', 'p_repair', 'p_tiktok', 'p_selfdriving'] },
  { id: 'local', icon: '🏘️', name: { pl: 'Samorząd i miasto', en: 'Local government and cities' },
    ids: ['x_localtax', 'x_partbudget', 'x_regions', 'x_curriculum', 'x_cars', 'x_housing', 'x_villagebus', 'x_mergegminy', 'p_megaproj', 'p_termlimits', 'p_stoves', 'p_windfarms', 'p_alcohol', 'p_homeless', 'p_schoolfood', 'p_recall', 'p_parking', 'p_zoning', 'p_smallschools', 'p_citywatch'] }
];
