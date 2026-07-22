// Snapshot Strava — Bastien Ryser — récupéré le 2026-07-22.
// Pour rafraîchir : redemander à Claude de repasser sur ce fichier avec les dernières activités.
const ATHLETE = {
  firstName: "Bastien",
  lastName: "Ryser",
  weightKg: 75,
  location: "Sion, Suisse",
  snapshotDate: "2026-07-22",
};

const ZONES = {
  heartRate: [
    { zone: 1, min: 0, max: 124 },
    { zone: 2, min: 125, max: 154 },
    { zone: 3, min: 155, max: 169 },
    { zone: 4, min: 170, max: 184 },
    { zone: 5, min: 185, max: null },
  ],
  source: "MaxHeartRate (estimation Strava)",
};

// Course cible
const RACE = {
  name: "Sierre-Zinal",
  defaultDateISO: "2026-08-08",
  distanceKm: 31,
  elevGainM: 2200,
};

// Résultat 2024 (référence directe : même course, même profil)
const SZ_2024 = {
  activityId: "12108544282",
  date: "2024-08-10",
  distanceKm: 31.4,
  elevGainM: 2195,
  movingTimeS: 17301, // 4h48'21"
  elapsedTimeS: 17730,
  avgHr: 152.6,
  maxHr: 172,
  avgWatts: 215.7,
  // Laps 1km : elevation_gain (m), avg_grade (%), avg_hr, avg_watts, moving_time (s)
  laps: [
    { d: 1, elev: 80.6, grade: 8.04, hr: 155.7, watts: 399.9, t: 372 },
    { d: 2, elev: 162.4, grade: 16.29, hr: 163.8, watts: 273.8, t: 629 },
    { d: 3, elev: 181.0, grade: 18.15, hr: 161.7, watts: 251.0, t: 745 },
    { d: 4, elev: 234.4, grade: 23.45, hr: 158.2, watts: 200.7, t: 963 },
    { d: 5, elev: 265.2, grade: 26.50, hr: 157.3, watts: 198.4, t: 1115 },
    { d: 6, elev: 245.8, grade: 24.65, hr: 155.9, watts: 207.1, t: 1065 },
    { d: 7, elev: 143.4, grade: 14.39, hr: 155.9, watts: 217.6, t: 760 },
    { d: 8, elev: 72.0, grade: 6.45, hr: 147.4, watts: 224.3, t: 581 },
    { d: 9, elev: 80.6, grade: 8.08, hr: 152.5, watts: 233.0, t: 575 },
    { d: 10, elev: 41.8, grade: 4.12, hr: 151.9, watts: 269.8, t: 442 },
    { d: 11, elev: 9.6, grade: 0.90, hr: 155.7, watts: 294.5, t: 373 },
    { d: 12, elev: 0, grade: -8.92, hr: 150.9, watts: 257.9, t: 330 },
    { d: 13, elev: 90.0, grade: 8.27, hr: 152.6, watts: 214.2, t: 612 },
    { d: 14, elev: 48.8, grade: -0.08, hr: 158.0, watts: 251.0, t: 436 },
    { d: 15, elev: 127.6, grade: 12.76, hr: 155.3, watts: 194.6, t: 714 },
    { d: 16, elev: 8.6, grade: -2.58, hr: 153.9, watts: 254.9, t: 446 },
    { d: 17, elev: 30.6, grade: 0.46, hr: 153.1, watts: 241.7, t: 430 },
    { d: 18, elev: 31.8, grade: 0.62, hr: 150.2, watts: 234.3, t: 443 },
    { d: 19, elev: 46.8, grade: 4.10, hr: 148.4, watts: 207.9, t: 527 },
    { d: 20, elev: 126.8, grade: 12.61, hr: 148.9, watts: 165.7, t: 829 },
    { d: 21, elev: 76.8, grade: 5.61, hr: 145.7, watts: 163.3, t: 764 },
    { d: 22, elev: 38.0, grade: 1.88, hr: 145.3, watts: 175.8, t: 548 },
    { d: 23, elev: 27.4, grade: -0.50, hr: 145.6, watts: 202.9, t: 518 },
    { d: 24, elev: 2.2, grade: -2.71, hr: 149.7, watts: 249.2, t: 389 },
    { d: 25, elev: 2.0, grade: -5.59, hr: 146.0, watts: 206.9, t: 426 },
    { d: 26, elev: 0, grade: -9.16, hr: 138.7, watts: 145.6, t: 482 },
    { d: 27, elev: 14.4, grade: -2.56, hr: 142.6, watts: 168.8, t: 541 },
    { d: 28, elev: 0, grade: -4.04, hr: 152.9, watts: 247.8, t: 377 },
    { d: 29, elev: 16.2, grade: -6.13, hr: 147.2, watts: 174.1, t: 481 },
    { d: 30, elev: 2.4, grade: -20.84, hr: 151.1, watts: 136.2, t: 381 },
    { d: 31, elev: 4.6, grade: -19.25, hr: 158.0, watts: 122.0, t: 333 },
  ],
  keySegments: [
    { name: "Sierre → Chandolin (1ère montée)", distKm: 10.0, elevGain: 1897, movingTimeS: 6732, avgHr: 156.5 },
    { name: "Chandolin → Tignousa (2ième montée)", distKm: 10.1, elevGain: 900, movingTimeS: 5456, avgHr: 150.0 },
    { name: "Tignousa → Zinal (descente)", distKm: 15.4, elevGain: 401, movingTimeS: 7292, avgHr: 147.6 },
  ],
};

// Activités (Run/TrailRun/Hike/Tennis/Ski...), triées par date croissante.
// distKm, movingMin, elevGain (m), effort = Strava Relative Effort (null si non calculé).
const ACTIVITIES = [{"id":"11204846979","name":"Course à pied en soirée","date":"2024-04-17","sport":"Run","distKm":9.93,"movingMin":80.9,"elevGain":426,"effort":108},{"id":"11255381558","name":"Course à pied en soirée","date":"2024-04-24","sport":"Run","distKm":9.77,"movingMin":70.0,"elevGain":419,"effort":129},{"id":"11300943086","name":"Course à pied en soirée","date":"2024-04-30","sport":"Run","distKm":5.39,"movingMin":49.1,"elevGain":502,"effort":66},{"id":"11419073280","name":"Course à pied en soirée","date":"2024-05-15","sport":"Run","distKm":6.56,"movingMin":45.4,"elevGain":400,"effort":145},{"id":"11473155260","name":"Course à pied en soirée","date":"2024-05-22","sport":"Run","distKm":5.87,"movingMin":40.4,"elevGain":487,"effort":null},{"id":"11526762518","name":"Course à pied en soirée","date":"2024-05-29","sport":"Run","distKm":7.04,"movingMin":50.8,"elevGain":494,"effort":109},{"id":"11581306515","name":"Course à pied en soirée","date":"2024-06-05","sport":"Run","distKm":8.75,"movingMin":69.7,"elevGain":531,"effort":212},{"id":"11637067751","name":"Course à pied dans l'après-midi","date":"2024-06-12","sport":"Run","distKm":7.19,"movingMin":105.9,"elevGain":994,"effort":128},{"id":"11676467507","name":"Course à pied en soirée","date":"2024-06-17","sport":"Run","distKm":7.27,"movingMin":60.7,"elevGain":436,"effort":88},{"id":"11691258849","name":"Course à pied en soirée","date":"2024-06-19","sport":"Run","distKm":7.0,"movingMin":99.9,"elevGain":972,"effort":187},{"id":"11727713787","name":"Course à pied dans l'après-midi","date":"2024-06-24","sport":"Run","distKm":7.76,"movingMin":59.8,"elevGain":453,"effort":95},{"id":"11855844787","name":"Course à pied en soirée","date":"2024-07-10","sport":"Run","distKm":3.55,"movingMin":22.4,"elevGain":0,"effort":24},{"id":"11904258334","name":"SZ part 1 reco","date":"2024-07-16","sport":"Run","distKm":13.09,"movingMin":152.9,"elevGain":1308,"effort":218},{"id":"11971675382","name":"Course à pied en soirée","date":"2024-07-24","sport":"Run","distKm":12.18,"movingMin":80.9,"elevGain":116,"effort":69},{"id":"12012462691","name":"Course à pied en soirée","date":"2024-07-29","sport":"Run","distKm":12.31,"movingMin":94.2,"elevGain":662,"effort":113},{"id":"12049060608","name":"Course à pied le matin","date":"2024-08-03","sport":"Run","distKm":2.12,"movingMin":14.1,"elevGain":160,"effort":25},{"id":"12070866419","name":"Course à pied en soirée","date":"2024-08-05","sport":"Run","distKm":6.34,"movingMin":61.0,"elevGain":584,"effort":104},{"id":"12088209457","name":"Course à pied en soirée","date":"2024-08-07","sport":"Run","distKm":9.93,"movingMin":62.9,"elevGain":172,"effort":76},{"id":"12108544282","name":"Sierre-Zinal 2024","date":"2024-08-10","sport":"Run","distKm":31.4,"movingMin":288.4,"elevGain":2195,"effort":435},{"id":"13667471011","name":"Course à pied le matin","date":"2025-02-19","sport":"Run","distKm":4.72,"movingMin":29.9,"elevGain":90,"effort":51},{"id":"13740435644","name":"Course à pied le midi","date":"2025-02-27","sport":"Run","distKm":4.47,"movingMin":27.9,"elevGain":55,"effort":35},{"id":"13863940239","name":"Course à pied en soirée","date":"2025-03-12","sport":"Run","distKm":4.71,"movingMin":23.5,"elevGain":54,"effort":45},{"id":"13869861836","name":"Course à pied le midi","date":"2025-03-13","sport":"Run","distKm":4.46,"movingMin":29.4,"elevGain":53,"effort":22},{"id":"14010003358","name":"Course à pied le midi","date":"2025-03-28","sport":"Run","distKm":4.73,"movingMin":29.3,"elevGain":39,"effort":21},{"id":"14066648785","name":"Jeudi GC","date":"2025-04-03","sport":"Run","distKm":3.84,"movingMin":23.6,"elevGain":19,"effort":30},{"id":"14135024714","name":"Jeudi GC pendant la pause de midi","date":"2025-04-10","sport":"Run","distKm":3.61,"movingMin":21.2,"elevGain":19,"effort":24},{"id":"14282819733","name":"Sortie chill avec Noé","date":"2025-04-25","sport":"Run","distKm":8.86,"movingMin":98.7,"elevGain":878,"effort":null},{"id":"14799760772","name":"La chaleur de malade","date":"2025-06-14","sport":"Run","distKm":5.03,"movingMin":28.7,"elevGain":118,"effort":43},{"id":"15015854298","name":"Fouly - Bivouac de Dolent","date":"2025-07-05","sport":"Run","distKm":7.82,"movingMin":148.5,"elevGain":1076,"effort":null},{"id":"15146458189","name":"Course à pied le soir","date":"2025-07-17","sport":"Run","distKm":6.42,"movingMin":58.1,"elevGain":576,"effort":null},{"id":"15201991776","name":"Énorme bug - Siviez - Pas de jus","date":"2025-07-22","sport":"Run","distKm":5.81,"movingMin":63.5,"elevGain":668,"effort":null},{"id":"15202338720","name":"Course à pied en soirée","date":"2025-07-22","sport":"Run","distKm":1.94,"movingMin":19.0,"elevGain":240,"effort":9},{"id":"15243695613","name":"Randonnée dans l'après-midi","date":"2025-07-26","sport":"Hike","distKm":10.78,"movingMin":149.2,"elevGain":747,"effort":45},{"id":"15253086988","name":"Randonnée Gd St-Bernard","date":"2025-07-27","sport":"Hike","distKm":12.36,"movingMin":214.3,"elevGain":959,"effort":60},{"id":"15308018391","name":"Course à pied dans l'après-midi","date":"2025-08-01","sport":"Run","distKm":5.11,"movingMin":56.3,"elevGain":484,"effort":57},{"id":"15355436491","name":"Reprise chill pour tester la cheville","date":"2025-08-05","sport":"Run","distKm":10.66,"movingMin":72.2,"elevGain":315,"effort":76},{"id":"15380335211","name":"Course à pied en soirée","date":"2025-08-07","sport":"Run","distKm":11.01,"movingMin":69.9,"elevGain":326,"effort":86},{"id":"15468800944","name":"Après 2h de tennis à fond","date":"2025-08-15","sport":"TrailRun","distKm":21.09,"movingMin":255.6,"elevGain":1184,"effort":143},{"id":"15515415876","name":"Petit deniv haut %","date":"2025-08-19","sport":"Run","distKm":5.1,"movingMin":49.1,"elevGain":530,"effort":44,"note":"Avant les orages"},{"id":"15555669205","name":"Course à pied le matin","date":"2025-08-23","sport":"Run","distKm":18.25,"movingMin":158.8,"elevGain":1012,"effort":128},{"id":"15595500610","name":"Last dance J-4","date":"2025-08-26","sport":"Run","distKm":8.56,"movingMin":61.2,"elevGain":403,"effort":40},{"id":"15639031693","name":"Marathon de la rose w/quentin","date":"2025-08-30","sport":"TrailRun","distKm":43.61,"movingMin":677.5,"elevGain":3377,"effort":307,"note":"Une cheville en moins dès le 5ème km"},{"id":"16178371701","name":"Première, ultra chill après la cheville","date":"2025-10-18","sport":"Run","distKm":4.6,"movingMin":27.0,"elevGain":104,"effort":null},{"id":"16190875087","name":"Aération du cerveau","date":"2025-10-19","sport":"Run","distKm":4.3,"movingMin":22.9,"elevGain":95,"effort":null},{"id":"16372577058","name":"Tout chill avec les GC","date":"2025-11-06","sport":"Run","distKm":3.82,"movingMin":28.2,"elevGain":14,"effort":6},{"id":"16465733863","name":"Course à pied dans l'après-midi","date":"2025-11-15","sport":"Run","distKm":8.37,"movingMin":46.1,"elevGain":49,"effort":94},{"id":"16472705558","name":"Petites séries avec Hugo !","date":"2025-11-16","sport":"Run","distKm":4.73,"movingMin":29.1,"elevGain":17,"effort":15},{"id":"16827449272","name":"Christmas run","date":"2025-12-24","sport":"Run","distKm":10.16,"movingMin":67.9,"elevGain":424,"effort":99},{"id":"17008105373","name":"Course à pied le matin","date":"2026-01-11","sport":"Run","distKm":4.37,"movingMin":24.9,"elevGain":104,"effort":41},{"id":"17081741450","name":"Ski alpin dans l'après-midi","date":"2026-01-17","sport":"AlpineSki","distKm":13.74,"movingMin":39.1,"elevGain":89,"effort":7},{"id":"17079565573","name":"Ski alpin le matin","date":"2026-01-17","sport":"AlpineSki","distKm":23.0,"movingMin":93.0,"elevGain":130,"effort":14},{"id":"17350897461","name":"Course à pied dans l'après-midi","date":"2026-02-10","sport":"Run","distKm":6.64,"movingMin":48.6,"elevGain":301,"effort":null},{"id":"17504194575","name":"Course à pied le midi avec les GC","date":"2026-02-24","sport":"Run","distKm":4.39,"movingMin":26.5,"elevGain":37,"effort":10},{"id":"17588980091","name":"Course à pied dans l'après-midi","date":"2026-03-03","sport":"Run","distKm":10.12,"movingMin":67.2,"elevGain":35,"effort":19},{"id":"17656236784","name":"Course à pied le matin","date":"2026-03-09","sport":"Run","distKm":10.02,"movingMin":51.7,"elevGain":30,"effort":78,"note":"1/5 séries"},{"id":"17668413793","name":"Course à pied le matin","date":"2026-03-10","sport":"Run","distKm":10.03,"movingMin":56.7,"elevGain":109,"effort":68,"note":"2/5 séries"},{"id":"17687214901","name":"Course à pied dans l'après-midi","date":"2026-03-11","sport":"Run","distKm":10.01,"movingMin":58.8,"elevGain":105,"effort":46,"note":"3/5 séries"},{"id":"17695710044","name":"Course à pied le midi","date":"2026-03-12","sport":"Run","distKm":10.02,"movingMin":53.7,"elevGain":110,"effort":60,"note":"4/5 séries"},{"id":"17704562421","name":"Course à pied le matin","date":"2026-03-13","sport":"Run","distKm":10.02,"movingMin":55.5,"elevGain":115,"effort":49,"note":"5/5 séries"},{"id":"18013929503","name":"Zermatt -> Cabane Mont-Rose","date":"2026-04-07","sport":"BackcountrySki","distKm":15.81,"movingMin":309.6,"elevGain":1013,"effort":280},{"id":"18027675024","name":"Cabane Monte Rosa - Signalkuppe (4558m)","date":"2026-04-08","sport":"BackcountrySki","distKm":31.45,"movingMin":498.1,"elevGain":1719,"effort":174},{"id":"18375558628","name":"Course à pied le soir","date":"2026-05-04","sport":"Run","distKm":10.04,"movingMin":55.2,"elevGain":94,"effort":null},{"id":"18636314916","name":"Marche dans l'après-midi","date":"2026-05-24","sport":"Walk","distKm":2.59,"movingMin":34.2,"elevGain":24,"effort":null},{"id":"18636312152","name":"Marche le matin","date":"2026-05-24","sport":"Walk","distKm":13.7,"movingMin":216.5,"elevGain":935,"effort":null},{"id":"18643396051","name":"KM Vertical de Fully","date":"2026-05-25","sport":"Run","distKm":7.2,"movingMin":105.4,"elevGain":1028,"effort":null},{"id":"18827853660","name":"Afternoon Tennis","date":"2026-06-07","sport":"Tennis","distKm":6.98,"movingMin":148.6,"elevGain":13,"effort":107},{"id":"18901764647","name":"Course à pied le midi","date":"2026-06-13","sport":"Run","distKm":15.06,"movingMin":120.9,"elevGain":767,"effort":181},{"id":"19025983403","name":"Hôtel du Sanetsch - Cabane Prarochet","date":"2026-06-22","sport":"Run","distKm":13.01,"movingMin":118.0,"elevGain":602,"effort":78},{"id":"19115298709","name":"Course à pied de nuit","date":"2026-06-29","sport":"Run","distKm":7.36,"movingMin":61.0,"elevGain":308,"effort":41},{"id":"19140483313","name":"Tennis dans l'après-midi","date":"2026-07-01","sport":"Tennis","distKm":6.57,"movingMin":124.7,"elevGain":61,"effort":39},{"id":"19153651454","name":"Course à pied en soirée","date":"2026-07-02","sport":"Run","distKm":7.32,"movingMin":51.3,"elevGain":305,"effort":58},{"id":"19166136060","name":"Tennis dans l'après-midi","date":"2026-07-03","sport":"Tennis","distKm":6.07,"movingMin":132.9,"elevGain":0,"effort":43},{"id":"19204343803","name":"Tennis en soirée","date":"2026-07-06","sport":"Tennis","distKm":0.26,"movingMin":65.5,"elevGain":0,"effort":11},{"id":"19219091487","name":"Course à pied en soirée","date":"2026-07-07","sport":"Run","distKm":16.01,"movingMin":142.4,"elevGain":1007,"effort":145},{"id":"19231810293","name":"Tennis en soirée","date":"2026-07-08","sport":"Tennis","distKm":3.85,"movingMin":83.4,"elevGain":0,"effort":18},{"id":"19266165160","name":"Morning Run","date":"2026-07-11","sport":"Run","distKm":21.03,"movingMin":255.7,"elevGain":1605,"effort":205,"note":"Premier vrai entrainement pour l'objectif dans moins d'un mois"},{"id":"19298340908","name":"Course à pied en soirée","date":"2026-07-13","sport":"Run","distKm":11.38,"movingMin":84.3,"elevGain":404,"effort":73,"note":"Horrible la chaleur"},{"id":"19312055141","name":"Tennis en soirée","date":"2026-07-14","sport":"Tennis","distKm":2.39,"movingMin":47.0,"elevGain":0,"effort":24}];
