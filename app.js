/* Analyse Strava + plan Sierre-Zinal — logique app (aucune dépendance externe) */

const RUNNING_SPORTS = new Set(["Run", "TrailRun"]);
const fmt1 = (n) => (Math.round(n * 10) / 10).toLocaleString("fr-CH");
const fmt0 = (n) => Math.round(n).toLocaleString("fr-CH");

function parseISO(d) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}
function toISO(date) {
  return date.toISOString ? date.toLocaleDateString("sv-SE") : "";
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}
function mondayOf(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function frDate(date, opts) {
  return new Intl.DateTimeFormat("fr-CH", opts || { day: "numeric", month: "short" }).format(date);
}
function frDow(date) {
  return new Intl.DateTimeFormat("fr-CH", { weekday: "long" }).format(date);
}

/* ---------- Analyse ---------- */

const ASOF = parseISO(ATHLETE.snapshotDate); // date de référence des stats (données figées à ce jour)

function runningActivitiesUpTo(date) {
  return ACTIVITIES.filter((a) => RUNNING_SPORTS.has(a.sport) && parseISO(a.date) <= date);
}

function sumWindow(activities, start, end) {
  const inWindow = activities.filter((a) => {
    const d = parseISO(a.date);
    return d >= start && d < end;
  });
  const km = inWindow.reduce((s, a) => s + a.distKm, 0);
  const elev = inWindow.reduce((s, a) => s + a.elevGain, 0);
  const efforts = inWindow.map((a) => a.effort).filter((e) => e != null);
  const avgEffort = efforts.length ? efforts.reduce((s, e) => s + e, 0) / efforts.length : null;
  return { km, elev, count: inWindow.length, avgEffort, sessions: inWindow };
}

function weeklyAggregates(activities, weeksBack, asOf) {
  const endMonday = mondayOf(asOf);
  const weeks = [];
  for (let i = weeksBack - 1; i >= 0; i--) {
    const start = addDays(endMonday, -7 * i);
    const end = addDays(start, 7);
    const agg = sumWindow(activities, start, end);
    weeks.push({ start, end, ...agg });
  }
  return weeks;
}

/* ---------- Rendu graphiques (canvas) ---------- */

function drawBarChart(canvas, weeks, valueKey, opts) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = Math.max(weeks.length * 34, 320);
  const cssH = 130;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  const values = weeks.map((w) => w[valueKey]);
  const max = Math.max(...values, opts.minMax || 1) * 1.15;
  const barW = 22;
  const gap = 12;
  const baseY = cssH - 22;

  const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillStyle = isDark ? "#a8a49c" : "#6b6862";
  ctx.textAlign = "center";

  weeks.forEach((w, i) => {
    const x = i * (barW + gap) + gap / 2;
    const h = (w[valueKey] / max) * (baseY - 10);
    const y = baseY - h;
    ctx.fillStyle = opts.color(w);
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, h, 3) : ctx.rect(x, y, barW, h);
    ctx.fill();
    ctx.fillStyle = isDark ? "#a8a49c" : "#6b6862";
    if (w[valueKey] > 0) {
      ctx.fillText(opts.label ? opts.label(w) : "", x + barW / 2, y - 4);
    }
    ctx.fillText(frDate(w.start, { day: "numeric", month: "numeric" }), x + barW / 2, cssH - 6);
  });
}

function effortColor(avgEffort) {
  if (avgEffort == null) return "#9a958c";
  if (avgEffort < 30) return "#b7d8c9";
  if (avgEffort < 70) return "#7fb8a0";
  if (avgEffort < 120) return "#e8b750";
  if (avgEffort < 180) return "#d97a3f";
  return "#b8432f";
}

function drawRacePaceChart(canvas, laps) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = 640, cssH = 160;
  canvas.style.width = "100%";
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const paceMin = laps.map((l) => l.t / 60);
  const hr = laps.map((l) => l.hr);
  const maxPace = Math.max(...paceMin);
  const minHr = Math.min(...hr) - 5, maxHr = Math.max(...hr) + 5;
  const padL = 30, padR = 30, padB = 18, padT = 8;
  const plotW = cssW - padL - padR, plotH = cssH - padB - padT;
  const stepX = plotW / (laps.length - 1);

  // grille
  ctx.strokeStyle = isDark ? "#34322d" : "#e5e3de";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT); ctx.lineTo(padL, cssH - padB); ctx.lineTo(cssW - padR, cssH - padB);
  ctx.stroke();

  // ligne temps/km (barres)
  ctx.fillStyle = "#c1440e55";
  laps.forEach((l, i) => {
    const x = padL + i * stepX;
    const h = (l.t / 60 / maxPace) * plotH;
    ctx.fillRect(x - stepX * 0.35, cssH - padB - h, stepX * 0.7, h);
  });

  // ligne FC
  ctx.strokeStyle = "#b8432f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  laps.forEach((l, i) => {
    const x = padL + i * stepX;
    const y = padT + plotH - ((l.hr - minHr) / (maxHr - minHr)) * plotH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillStyle = isDark ? "#a8a49c" : "#6b6862";
  ctx.textAlign = "center";
  [1, 10, 20, 31].forEach((km) => {
    const i = km - 1;
    const x = padL + i * stepX;
    ctx.fillText("km " + km, x, cssH - 4);
  });
  ctx.textAlign = "left";
  ctx.fillStyle = "#b8432f";
  ctx.fillText("FC (bpm)", padL, padT + 8);
  ctx.fillStyle = "#c1440e";
  ctx.fillText("min/km (barres)", padL + 70, padT + 8);
}

/* ---------- Construction du DOM : onglet Forme ---------- */

function renderForme() {
  const weeks = weeklyAggregates(ACTIVITIES.filter((a) => RUNNING_SPORTS.has(a.sport)), 16, ASOF);
  const last28 = sumWindow(ACTIVITIES.filter((a) => RUNNING_SPORTS.has(a.sport)), addDays(ASOF, -28), addDays(ASOF, 1));
  const prev28 = sumWindow(ACTIVITIES.filter((a) => RUNNING_SPORTS.has(a.sport)), addDays(ASOF, -56), addDays(ASOF, -28));

  // Bloc final avant SZ 2024 (21 jours) vs bloc actuel (21 jours jusqu'à aujourd'hui)
  const block2024 = sumWindow(
    ACTIVITIES.filter((a) => RUNNING_SPORTS.has(a.sport)),
    addDays(parseISO(SZ_2024.date), -21),
    parseISO(SZ_2024.date)
  );
  const block2026 = sumWindow(
    ACTIVITIES.filter((a) => RUNNING_SPORTS.has(a.sport)),
    addDays(ASOF, -21),
    addDays(ASOF, 1)
  );

  document.getElementById("tiles").innerHTML = `
    <div class="tile"><div class="label">Volume course (28j)</div><div class="value">${fmt0(last28.km)} <small>km</small></div></div>
    <div class="tile"><div class="label">D+ cumulé (28j)</div><div class="value">${fmt0(last28.elev)} <small>m</small></div></div>
    <div class="tile"><div class="label">Sorties (28j)</div><div class="value">${last28.count}</div></div>
    <div class="tile"><div class="label">Effort moyen (28j)</div><div class="value">${last28.avgEffort ? fmt0(last28.avgEffort) : "—"}</div></div>
  `;

  const chartWeeks = weeks.map((w) => ({ ...w, label: () => (w.km ? fmt0(w.km) : "") }));
  drawBarChart(document.getElementById("chart-km"), chartWeeks, "km", {
    color: (w) => effortColor(w.avgEffort),
    label: (w) => fmt0(w.km),
    minMax: 10,
  });
  drawBarChart(document.getElementById("chart-elev"), chartWeeks, "elev", {
    color: () => "#8a7f6a",
    label: (w) => (w.elev ? fmt0(w.elev) : ""),
    minMax: 200,
  });

  const deltaKm = block2026.km - block2024.km;
  const deltaElev = block2026.elev - block2024.elev;
  const trend = deltaKm >= 0 ? "plus de volume" : "moins de volume";
  const intensityNote = block2026.avgEffort && block2024.avgEffort
    ? (block2026.avgEffort > block2024.avgEffort
        ? "des séances individuellement plus intenses"
        : "une intensité par séance comparable")
    : "";

  document.getElementById("narrative").innerHTML = `
    <p><strong>Où tu en es (données au ${frDate(ASOF, { day: "numeric", month: "long", year: "numeric" })}) :</strong>
    entre novembre 2025 et fin juin 2026, ton volume de course à pied a été faible et irrégulier — la charge de cette période
    est venue surtout du ski et du tennis. Tu as relancé sérieusement la course à pied le 29 juin, avec une nette accélération
    depuis le 7 juillet (3 sorties à forte charge en 2 semaines, dont une sortie de 21&nbsp;km / 1605&nbsp;m D+ à effort 205 —
    parmi les plus intenses de tout ton historique).</p>
    <p><strong>Comparé à ta préparation 2024</strong> (mêmes 3 dernières semaines avant la course) : tu cumules cette fois
    ${fmt0(block2026.km)}&nbsp;km / ${fmt0(block2026.elev)}&nbsp;m D+ sur ${block2026.count} sorties, contre
    ${fmt0(block2024.km)}&nbsp;km / ${fmt0(block2024.elev)}&nbsp;m D+ sur ${block2024.count} sorties en 2024
    — soit ${trend} (${deltaKm >= 0 ? "+" : ""}${fmt0(deltaKm)}&nbsp;km, ${deltaElev >= 0 ? "+" : ""}${fmt0(deltaElev)}&nbsp;m D+),
    concentré sur moins de sorties donc ${intensityNote}. Le signal est bon, mais la régularité est plus faible qu'en 2024 :
    priorité aux séances clés plutôt qu'au volume pur sur les 17 jours restants.</p>
    <p><strong>Point de vigilance :</strong> une entorse de cheville fin août 2025 (Marathon de la Rose) a limité la reprise
    jusqu'en octobre. Rien d'alarmant dans les données récentes, mais reste attentif en descente technique.</p>
  `;

  // Séances récentes (course à pied), 8 dernières avant ASOF
  const recent = ACTIVITIES.filter((a) => RUNNING_SPORTS.has(a.sport) && parseISO(a.date) <= ASOF)
    .slice(-8).reverse();
  document.getElementById("recent-body").innerHTML = recent.map((a) => `
    <tr>
      <td>${frDate(parseISO(a.date))}</td>
      <td>${a.name}</td>
      <td>${fmt1(a.distKm)} km</td>
      <td>${fmt0(a.elevGain)} m</td>
      <td>${a.effort ?? "—"}</td>
      <td class="note">${a.note || ""}</td>
    </tr>
  `).join("");

  // Carte course 2024
  const t = SZ_2024.movingTimeS;
  const hms = `${Math.floor(t / 3600)}h${String(Math.floor((t % 3600) / 60)).padStart(2, "0")}'${String(t % 60).padStart(2, "0")}"`;
  document.getElementById("race-summary").innerHTML = `
    <div class="tiles" style="margin-bottom:14px;">
      <div class="tile"><div class="label">Temps (mouvement)</div><div class="value">${hms}</div></div>
      <div class="tile"><div class="label">Distance / D+</div><div class="value">${fmt1(SZ_2024.distanceKm)} <small>km</small></div><div class="card-sub">${fmt0(SZ_2024.elevGainM)} m D+</div></div>
      <div class="tile"><div class="label">FC moyenne / max</div><div class="value">${fmt0(SZ_2024.avgHr)} <small>/ ${SZ_2024.maxHr} bpm</small></div></div>
      <div class="tile"><div class="label">Puissance moyenne</div><div class="value">${fmt0(SZ_2024.avgWatts)} <small>W</small></div></div>
    </div>
    <div class="chart-scroll"><canvas id="chart-race"></canvas></div>
    <div class="narrative" style="margin-top:12px;">
      <p><strong>Lecture des données :</strong> les 3 premiers km (montée à 18-26%) sont partis très vite en puissance
      (jusqu'à 400 W), avec une FC qui grimpe tout de suite vers 158-164 bpm. Elle ne redescend franchement qu'après le km 20,
      signe d'un effort payé cash en 2ème partie (Chandolin → Tignousa → Zinal, FC 138-152). Pour cette édition, viser un départ
      plus contenu sur les 3 premiers km permettrait de garder plus de jus sur la 2ème montée et la descente technique finale.</p>
    </div>
  `;
  drawRacePaceChart(document.getElementById("chart-race"), SZ_2024.laps);
}

/* ---------- Onglet Plan ---------- */

function daysUntil(raceDate, now) {
  return daysBetween(new Date(now.getFullYear(), now.getMonth(), now.getDate()), new Date(raceDate.getFullYear(), raceDate.getMonth(), raceDate.getDate()));
}

function buildPlanDays(raceDateISO) {
  const raceDate = parseISO(raceDateISO);
  if (raceDateISO === RACE.defaultDateISO) {
    return PLAN_DATED.map((d) => ({ ...d, date: parseISO(d.date) }));
  }
  // Repli générique : reconstruit une fenêtre de 18 jours en remontant depuis la course,
  // en réutilisant le gabarit générique (cyclique si plus long que le gabarit).
  const n = PLAN_TEMPLATE_BY_DAYS_OUT.length;
  const days = [];
  for (let out = n - 1; out >= 0; out--) {
    const date = addDays(raceDate, -out);
    const tpl = PLAN_TEMPLATE_BY_DAYS_OUT[out % n];
    days.push({ ...tpl, date });
  }
  return days;
}

function renderPlan(raceDateISO) {
  const now = new Date();
  const raceDate = parseISO(raceDateISO);
  const remaining = daysUntil(raceDate, now);

  const countdownEl = document.getElementById("countdown");
  if (remaining > 0) {
    countdownEl.innerHTML = `J-${remaining} <small>avant Sierre-Zinal</small>`;
  } else if (remaining === 0) {
    countdownEl.innerHTML = `C'est aujourd'hui <small>bonne course !</small>`;
  } else {
    countdownEl.innerHTML = `Course passée <small>il y a ${-remaining} j</small>`;
  }

  const days = buildPlanDays(raceDateISO);
  const templateLen = PLAN_TEMPLATE_BY_DAYS_OUT.length;
  const noteEl = document.getElementById("plan-gap-note");
  if (raceDateISO !== RACE.defaultDateISO && remaining > templateLen - 1) {
    noteEl.style.display = "block";
    noteEl.textContent = `Ce plan détaillé couvre les ${templateLen} derniers jours avant la course. Il reste encore ${remaining - (templateLen - 1)} jour(s) avant que ce bloc ne démarre — maintiens une base régulière (2-3 sorties/semaine) en attendant.`;
  } else {
    noteEl.style.display = "none";
  }

  const todayISO = toISO(now);
  let html = "";
  let lastWeekStart = null;
  days.forEach((d) => {
    const wStart = mondayOf(d.date);
    const wKey = toISO(wStart);
    if (wKey !== lastWeekStart) {
      lastWeekStart = wKey;
      html += `<div class="week-divider">Semaine du ${frDate(wStart, { day: "numeric", month: "long" })}</div>`;
    }
    const isToday = toISO(d.date) === todayISO;
    html += `
      <div class="day ${isToday ? "today" : ""}">
        <div class="date-col"><span class="dow">${frDow(d.date)}</span>${frDate(d.date)}</div>
        <div class="bar ${d.tag}"></div>
        <div class="content">
          <div class="title">${d.title}<span class="tagpill ${d.tag}">${tagLabel(d.tag)}</span></div>
          <div class="detail">${d.detail}</div>
        </div>
      </div>
    `;
  });
  document.getElementById("plan-days").innerHTML = html;
}

function tagLabel(tag) {
  return { key: "Clé", easy: "Facile", rest: "Repos", flex: "Libre", race: "Course" }[tag] || tag;
}

/* ---------- Init ---------- */

function initTabs() {
  document.querySelectorAll("nav.tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("nav.tabs button").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderForme();

  const dateInput = document.getElementById("race-date");
  dateInput.value = RACE.defaultDateISO;
  renderPlan(dateInput.value);
  dateInput.addEventListener("change", () => renderPlan(dateInput.value || RACE.defaultDateISO));

  window.addEventListener("resize", () => {
    renderForme();
  });
});
