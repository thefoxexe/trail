// Plan d'entraînement Sierre-Zinal, construit le 2026-07-22 à partir des données Strava réelles
// (historique de charge, séance de côtes du 11/07, résultat & splits de l'édition 2024).
//
// PLAN_DATED : jour par jour, daté, pour la fenêtre réelle 22/07 -> 08/08/2026.
// PLAN_TEMPLATE_BY_DAYS_OUT : repli générique (indexé par nb de jours avant la course)
// utilisé si l'utilisateur change la date de course dans l'app et sort de la fenêtre datée.

const TAGS = {
  KEY: "key",       // séance clé de la préparation
  EASY: "easy",     // footing / activation facile
  REST: "rest",     // repos complet
  FLEX: "flex",     // optionnel / tennis / libre
  RACE: "race",
};

// estLoad : charge journalière estimée (échelle "Effort Relatif" Strava) utilisée pour
// projeter la trajectoire Fitness/Fatigue/Forme jusqu'au jour J (voir app.js : computePMC).
const PLAN_DATED = [
  { date: "2026-07-22", tag: TAGS.KEY, title: "Côtes courtes soutenues", estLoad: 85, detail: "15' échauffement + 8×2' montée soutenue (Z3-Z4, RPE 7/10), récupération en descente marchée/trottinée + 15' retour au calme. Objectif : réhabituer les jambes à la puissance de montée sans s'exploser." },
  { date: "2026-07-23", tag: TAGS.EASY, title: "Footing très facile ou repos", estLoad: 25, detail: "25-30' en Z1-Z2 si les jambes sont fraîches, sinon repos complet. Ajoute 5-10' de mobilité cheville/gainage (ton historique montre une fragilité de cheville en 2025)." },
  { date: "2026-07-24", tag: TAGS.FLEX, title: "Tennis (libre) ou repos", estLoad: 20, detail: "Si tu joues au tennis, garde-le modéré : c'est la veille de la sortie longue. Sinon repos complet." },
  { date: "2026-07-25", tag: TAGS.KEY, title: "Sortie longue spécifique (le plus important du bloc)", estLoad: 170, detail: "2h30-3h avec 1200-1500m D+. Allure « région course » en montée, marche active dans les passages > 20% (comme km 3-6 de SZ), descente contrôlée en surveillant la cheville. Simule le rythme réel de la course, pas une perf." },
  { date: "2026-07-26", tag: TAGS.REST, title: "Récupération", estLoad: 10, detail: "Repos ou 30-40' marche/footing très facile. Étirements, sommeil, hydratation." },
  { date: "2026-07-27", tag: TAGS.KEY, title: "Seuil contrôlé", estLoad: 75, detail: "15' échauffement + 3×8' allure soutenue mais contrôlée (Z3) sur faux plat/D+ modéré, 3' récup entre les blocs. Renforce la capacité à tenir un effort long sans s'effondrer en 2ème partie (point faible identifié en 2024 : fatigue nette à Chandolin-Zinal)." },
  { date: "2026-07-28", tag: TAGS.EASY, title: "Footing facile + lignes droites", estLoad: 35, detail: "35-40' Z1-Z2 + 4-6×15'' accélérations progressives (relâchées, pas à fond). Fin du dernier bloc de charge réel." },
  { date: "2026-07-29", tag: TAGS.KEY, title: "Côtes courtes (volume réduit)", estLoad: 55, detail: "10' échauffement + 6×90'' montée rythmée (Z3), environ 25% de volume en moins que la séance du 22/07. L'affûtage démarre." },
  { date: "2026-07-30", tag: TAGS.REST, title: "Repos complet", estLoad: 0, detail: "Aucune activité intense. Marche tranquille possible." },
  { date: "2026-07-31", tag: TAGS.EASY, title: "Footing facile", estLoad: 30, detail: "30-35' Z1-Z2 + 4 lignes droites. Sensation de jambes légères, pas de fatigue résiduelle recherchée." },
  { date: "2026-08-01", tag: TAGS.KEY, title: "Dernière sortie avec D+ (contrôlée)", estLoad: 65, detail: "1h15-1h30, D+ 500-700m, allure conversationnelle du début à la fin. Aucune recherche de performance : juste réactiver les jambes en montée/descente sur terrain proche de SZ." },
  { date: "2026-08-02", tag: TAGS.REST, title: "Récupération", estLoad: 5, detail: "Repos ou marche très facile. Pas de tennis engagé si match intense — social ok, compétitif non." },
  { date: "2026-08-03", tag: TAGS.EASY, title: "Activation courte", estLoad: 15, detail: "20' Z1-Z2 + 5×20'' accélérations franches (pas épuisantes). Entretien de la vivacité neuromusculaire." },
  { date: "2026-08-04", tag: TAGS.REST, title: "Repos", estLoad: 0, detail: "Repos complet ou marche. Commence à penser logistique course (dossard, matériel, ravitos)." },
  { date: "2026-08-05", tag: TAGS.EASY, title: "Footing très facile (J-3)", estLoad: 10, detail: "20-25' Z1 + 4 lignes droites progressives. Zéro fatigue à la sortie." },
  { date: "2026-08-06", tag: TAGS.REST, title: "Repos complet (J-2)", estLoad: 0, detail: "Sommeil, hydratation. Le glycogène commence à se charger : augmente légèrement les glucides dans l'alimentation." },
  { date: "2026-08-07", tag: TAGS.REST, title: "Repos, retrait du dossard (J-1)", estLoad: 5, detail: "Retrait du dossard à Sierre si besoin. Activation optionnelle très courte (10' + 3 accélérations franches) en fin de journée. Repas riche en glucides, matériel prêt la veille." },
  { date: "2026-08-08", tag: TAGS.RACE, title: "SIERRE-ZINAL — jour J", estLoad: 435, detail: "Stratégie de course détaillée dans l'onglet « Ta forme » à partir de tes données 2024 : ne pars pas trop vite sur les 3 premiers km (forte pente 18-26%), garde de la réserve pour la 2ème montée Chandolin-Tignousa où tu avais nettement décroché en FC en 2024." },
];

// Charge par défaut (échelle Effort Relatif) quand une entrée du gabarit générique
// ne précise pas estLoad explicitement.
const TAG_DEFAULT_LOAD = { key: 80, easy: 30, rest: 0, flex: 20, race: 430 };

// Repli générique si la date de course choisie sort de la fenêtre connue ci-dessus.
// Index 0 = jour de la course, en remontant vers le passé.
const PLAN_TEMPLATE_BY_DAYS_OUT = [
  { tag: TAGS.RACE, title: "Jour de course", detail: "Pacing prudent en début de montée, réserve pour la 2ème partie." },
  { tag: TAGS.REST, title: "Repos, retrait dossard", detail: "Activation courte optionnelle (10' + 3 accélérations). Repas riches en glucides." },
  { tag: TAGS.REST, title: "Repos complet", detail: "Sommeil, hydratation, carbo-load." },
  { tag: TAGS.EASY, title: "Footing très facile", detail: "20-25' Z1 + quelques lignes droites progressives." },
  { tag: TAGS.REST, title: "Repos", detail: "Repos complet ou marche facile." },
  { tag: TAGS.EASY, title: "Activation courte", detail: "20' Z1-Z2 + 5×20'' accélérations franches." },
  { tag: TAGS.REST, title: "Récupération", detail: "Repos ou marche très facile." },
  { tag: TAGS.KEY, title: "Dernière sortie avec D+ (contrôlée)", detail: "1h-1h30, D+ 400-700m, allure conversationnelle, aucune recherche de perf." },
  { tag: TAGS.EASY, title: "Footing facile", detail: "30' Z1-Z2 + 4 lignes droites." },
  { tag: TAGS.REST, title: "Repos complet", detail: "Aucune activité intense." },
  { tag: TAGS.KEY, title: "Côtes courtes (volume réduit)", detail: "10' éch. + 6×90'' montée rythmée (Z3)." },
  { tag: TAGS.EASY, title: "Footing facile + lignes droites", detail: "35-40' Z1-Z2 + 4-6×15'' accélérations." },
  { tag: TAGS.KEY, title: "Seuil contrôlé", detail: "15' éch. + 3×8' allure soutenue (Z3) sur faux plat/D+, 3' récup." },
  { tag: TAGS.REST, title: "Récupération", detail: "Repos ou 30-40' très facile." },
  { tag: TAGS.KEY, title: "Sortie longue spécifique", detail: "2h30-3h, D+ 1200-1500m, allure région course, marche active dans le raide." },
  { tag: TAGS.FLEX, title: "Libre / tennis modéré", detail: "Veille de sortie longue : reste modéré." },
  { tag: TAGS.EASY, title: "Footing très facile ou repos", detail: "25-30' Z1-Z2 + mobilité/gainage." },
  { tag: TAGS.KEY, title: "Côtes courtes soutenues", detail: "15' éch. + 8×2' montée soutenue (Z3-Z4), récup en descente marchée + 15' retour au calme." },
];
