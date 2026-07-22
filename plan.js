// Plan d'entraînement Sierre-Zinal, construit à partir des données Strava réelles
// (historique de charge, séance de côtes du 11/07, résultat & splits de l'édition 2024)
// et de tes contraintes : 1x/semaine en salle (renfo + gainage), week-ends allégés
// (tu es souvent plus au sud), et les sorties clés en semaine en fin de journée
// (tu as ~3h de jour après 18h30).
//
// PLAN_DATED : jour par jour, daté, pour la fenêtre réelle 22/07 -> 08/08/2026.
// PLAN_TEMPLATE_BY_DAYS_OUT : repli générique (indexé par nb de jours avant la course)
// utilisé si l'utilisateur change la date de course dans l'app et sort de la fenêtre datée.

const TAGS = {
  KEY: "key",       // séance clé de la préparation
  EASY: "easy",     // footing / activation facile
  GYM: "gym",       // salle de sport (renfo + gainage)
  REST: "rest",     // repos complet
  FLEX: "flex",     // optionnel / week-end libre
  RACE: "race",
};

// estLoad : charge journalière estimée (échelle "Effort Relatif" Strava) utilisée pour
// projeter la trajectoire Fitness/Fatigue/Forme jusqu'au jour J (voir app.js : computePMC).
const PLAN_DATED = [
  { date: "2026-07-22", tag: TAGS.KEY, title: "Côtes courtes soutenues", estLoad: 85, detail: "Soirée : 15' échauffement + 8×2' montée soutenue (Z3-Z4, RPE 7/10), récup en descente marchée/trottinée + 15' retour au calme." },
  { date: "2026-07-23", tag: TAGS.EASY, title: "Footing très facile ou repos", estLoad: 25, detail: "25-30' Z1-Z2 si les jambes sont fraîches, sinon repos. + 5-10' mobilité cheville/gainage." },
  { date: "2026-07-24", tag: TAGS.GYM, title: "Salle de sport — renfo bas du corps + gainage", estLoad: 40, detail: "45-60' : squats/fentes/mollets modérés + gainage. Placée loin de la sortie longue de lundi pour ne pas la percuter." },
  { date: "2026-07-25", tag: TAGS.FLEX, title: "Week-end libre", estLoad: 15, detail: "Pas de sortie longue ce week-end. Marche/vélo tranquille si l'envie, sinon repos — la sortie longue est décalée en semaine." },
  { date: "2026-07-26", tag: TAGS.REST, title: "Repos", estLoad: 5, detail: "Repos ou activité très légère. Sommeil, hydratation." },
  { date: "2026-07-27", tag: TAGS.KEY, title: "Sortie longue spécifique (le plus important du bloc)", estLoad: 170, detail: "Lundi soir (18h30, ~3h de jour) : 2h30-3h, D+1200-1500m. Allure « région course », marche active >20%, descente contrôlée (cheville)." },
  { date: "2026-07-28", tag: TAGS.REST, title: "Récupération", estLoad: 10, detail: "Repos ou 30-40' très facile. Jambes lourdes normales après la sortie longue." },
  { date: "2026-07-29", tag: TAGS.KEY, title: "Seuil contrôlé", estLoad: 75, detail: "15' échauffement + 3×8' allure soutenue mais contrôlée (Z3) sur faux plat/D+ modéré, 3' récup. Travaille la capacité à tenir un effort long sans t'effondrer en 2ème partie (point faible 2024 : fatigue nette à Chandolin-Zinal)." },
  { date: "2026-07-30", tag: TAGS.EASY, title: "Footing facile + lignes droites", estLoad: 30, detail: "35-40' Z1-Z2 + 4-6×15'' accélérations progressives, relâchées." },
  { date: "2026-07-31", tag: TAGS.GYM, title: "Salle de sport — renfo bas du corps + gainage", estLoad: 40, detail: "2ème séance salle de la semaine, 7 jours après la précédente. Fin du dernier bloc de charge réel." },
  { date: "2026-08-01", tag: TAGS.FLEX, title: "Week-end libre", estLoad: 15, detail: "Pas de sortie longue. L'affûtage démarre." },
  { date: "2026-08-02", tag: TAGS.REST, title: "Repos", estLoad: 5, detail: "Repos ou marche très facile." },
  { date: "2026-08-03", tag: TAGS.KEY, title: "Dernière sortie avec D+ (contrôlée)", estLoad: 65, detail: "Soirée : 1h15-1h30, D+ 500-700m, allure conversationnelle du début à la fin. Aucune recherche de perf." },
  { date: "2026-08-04", tag: TAGS.GYM, title: "Salle de sport (version allégée)", estLoad: 15, detail: "Gainage + mobilité uniquement, pas de charge lourde : on garde l'habitude hebdomadaire sans percuter l'affûtage." },
  { date: "2026-08-05", tag: TAGS.EASY, title: "Footing très facile (J-3)", estLoad: 10, detail: "20-25' Z1 + 4 lignes droites progressives. Zéro fatigue à la sortie." },
  { date: "2026-08-06", tag: TAGS.REST, title: "Repos complet (J-2)", estLoad: 0, detail: "Sommeil, hydratation. Augmente légèrement les glucides." },
  { date: "2026-08-07", tag: TAGS.REST, title: "Repos, retrait du dossard (J-1)", estLoad: 5, detail: "Retrait dossard à Sierre si besoin. Activation optionnelle très courte (10' + 3 accélérations). Repas riche en glucides, matériel prêt." },
  { date: "2026-08-08", tag: TAGS.RACE, title: "SIERRE-ZINAL — jour J", estLoad: 435, detail: "Ne pars pas trop vite sur les 3 premiers km (pente 18-26%), garde de la réserve pour Chandolin-Tignousa où tu avais nettement décroché en FC en 2024. Détails dans l'onglet « Ta forme »." },
];

// Charge par défaut (échelle Effort Relatif) quand une entrée du gabarit générique
// ne précise pas estLoad explicitement.
const TAG_DEFAULT_LOAD = { key: 80, easy: 30, gym: 35, rest: 5, flex: 15, race: 430 };

// Repli générique si la date de course choisie sort de la fenêtre connue ci-dessus.
// Index 0 = jour de la course, en remontant vers le passé.
const PLAN_TEMPLATE_BY_DAYS_OUT = [
  { tag: TAGS.RACE, title: "Jour de course", detail: "Pacing prudent en début de montée, réserve pour la 2ème partie." },
  { tag: TAGS.REST, title: "Repos, retrait dossard", detail: "Activation courte optionnelle (10' + 3 accélérations). Repas riches en glucides." },
  { tag: TAGS.REST, title: "Repos complet", detail: "Sommeil, hydratation, carbo-load." },
  { tag: TAGS.EASY, title: "Footing très facile", detail: "20-25' Z1 + quelques lignes droites progressives." },
  { tag: TAGS.GYM, title: "Salle de sport (version allégée)", detail: "Gainage + mobilité uniquement, pas de charge lourde." },
  { tag: TAGS.EASY, title: "Activation courte", detail: "20' Z1-Z2 + 5×20'' accélérations franches." },
  { tag: TAGS.REST, title: "Récupération", detail: "Repos ou marche très facile." },
  { tag: TAGS.KEY, title: "Dernière sortie avec D+ (contrôlée)", detail: "1h-1h30, D+ 400-700m, allure conversationnelle, aucune recherche de perf." },
  { tag: TAGS.GYM, title: "Salle de sport — renfo bas du corps + gainage", detail: "45-60' : squats/fentes/mollets modérés + gainage." },
  { tag: TAGS.FLEX, title: "Week-end libre", detail: "Pas de sortie longue le week-end." },
  { tag: TAGS.REST, title: "Repos", detail: "Repos complet ou marche facile." },
  { tag: TAGS.KEY, title: "Seuil contrôlé", detail: "15' éch. + 3×8' allure soutenue (Z3) sur faux plat/D+, 3' récup." },
  { tag: TAGS.REST, title: "Récupération", detail: "Repos ou 30-40' très facile." },
  { tag: TAGS.KEY, title: "Sortie longue spécifique", detail: "En semaine, en soirée : 2h30-3h, D+ 1200-1500m, allure région course, marche active dans le raide." },
  { tag: TAGS.REST, title: "Repos", detail: "Repos ou activité très légère." },
  { tag: TAGS.FLEX, title: "Week-end libre", detail: "Pas de sortie longue le week-end." },
  { tag: TAGS.GYM, title: "Salle de sport — renfo bas du corps + gainage", detail: "45-60' : squats/fentes/mollets modérés + gainage." },
  { tag: TAGS.EASY, title: "Footing très facile ou repos", detail: "25-30' Z1-Z2 + mobilité/gainage." },
  { tag: TAGS.KEY, title: "Côtes courtes soutenues", detail: "15' éch. + 8×2' montée soutenue (Z3-Z4), récup en descente marchée + 15' retour au calme." },
];
