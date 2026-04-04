---
toc: false
---

<style>
.hom-title {
  font-family: var(--sans-serif);
  text-align: center;
  margin: 2rem 0 0.25rem;
}
.hom-title h1 {
  font-size: 2.6rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(90deg, #1DB954, #1a75cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hom-title p {
  color: var(--theme-foreground-muted);
  font-size: 0.95rem;
  margin: 0.3rem 0 1.5rem;
}

/* Controls bar */
.hom-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: flex-start;
  background: var(--theme-background-alt);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  font-family: var(--sans-serif);
  font-size: 13px;
}
.hom-ctrl-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hom-ctrl-label {
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--theme-foreground-muted);
}
.lang-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.lang-pill {
  padding: 4px 14px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 13px;
  font-family: var(--sans-serif);
  border: 2px solid;
  transition: all .15s;
  background: transparent;
}
.lang-pill[data-on="1"] {
  color: #fff;
}

/* Dual-range slider */
.drs-wrap { position: relative; height: 40px; width: 100%; min-width: 220px; }
.drs-track { position: absolute; left: 0; right: 0; top: 19px; height: 2px; border-radius: 2px; background: #ccc; }
.drs-fill  { position: absolute; top: 19px; height: 2px; background: #1DB954; }
.drs-wrap input[type=range] {
  -webkit-appearance: none; appearance: none;
  position: absolute; left: 0; width: 100%; top: 0;
  background: transparent; pointer-events: none;
  margin: 0; height: 40px;
}
.drs-wrap input[type=range]::-webkit-slider-runnable-track { background: transparent; height: 2px; }
.drs-wrap input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 18px; height: 18px; border-radius: 50%;
  background: #1DB954; cursor: pointer;
  pointer-events: all; border: none; box-shadow: 0 1px 4px #0003;
  margin-top: -8px;
}
.drs-wrap input[type=range]::-moz-range-track { background: transparent; height: 2px; }
.drs-wrap input[type=range]::-moz-range-thumb {
  width: 18px; height: 18px; border-radius: 50%;
  background: #1DB954; cursor: pointer;
  pointer-events: all; border: none; box-shadow: 0 1px 4px #0003;
}

/* Charts layout */
.hom-charts {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
}
@media (max-width: 860px) {
  .hom-charts { grid-template-columns: 1fr; }
}
.hom-area-wrap, .hom-pie-wrap {
  background: var(--theme-background-alt);
  border-radius: 12px;
  padding: 16px;
}
.hom-area-wrap h3, .hom-pie-wrap h3 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--theme-foreground-muted);
  margin: 0 0 12px;
}

/* Detail panel */
.hom-detail {
  background: var(--theme-background-alt);
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 20px;
  font-family: var(--sans-serif);
  font-size: 13px;
  min-height: 80px;
}
.hom-detail h3 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--theme-foreground-muted);
  margin: 0 0 10px;
}
.hom-detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
}
.hom-detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hom-detail-key {
  font-size: 11px;
  color: var(--theme-foreground-muted);
  text-transform: uppercase;
  letter-spacing: .04em;
}
.hom-detail-val {
  font-size: 15px;
  font-weight: 700;
}
.hom-placeholder {
  color: var(--theme-foreground-muted);
  font-style: italic;
}

/* Radio toggle for mode */
.mode-btns {
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid #1DB954;
}
.mode-btn {
  padding: 5px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-family: var(--sans-serif);
  color: #1DB954;
  transition: all .15s;
}
.mode-btn[data-on="1"] {
  background: #1DB954;
  color: #fff;
}
.mode-btn:not(:first-child) {
  border-left: 1.5px solid #1DB954;
}
</style>

<div class="hom-title">
  <h1>History of Music</h1>
  <p>Visualisation par langue et par intervalle temporaire des genres musicaux · données Spotify</p>
</div>

```js
const db = await FileAttachment("data/spotify_analytics_compact.sqlite3").sqlite();

// All genre/language/year data
const rawData = await db.query(`
  SELECT genre, language_code, release_year, track_count
  FROM agg_genre_language_year
  WHERE release_year <= 2025
  ORDER BY release_year
`);

// Top genres overall (limit to top 12 to keep chart readable)
const topGenresQ = await db.query(`
  SELECT genre, SUM(track_count) AS total
  FROM agg_genre_language_year
  GROUP BY genre
  ORDER BY total DESC
  LIMIT 12
`);
const topGenres = Array.from(topGenresQ).map(d => d.genre);

// Language labels
const langMeta = {
  en: { label: "Anglais",   color: "#1a75cc" },
  es: { label: "Espagnol",  color: "#e84040" },
  de: { label: "Allemand",  color: "#f5a623" },
  fr: { label: "Français",  color: "#9b59b6" },
  ja: { label: "Japonais",  color: "#e91e8c" },
  pl: { label: "Polonais",  color: "#16a085" },
};
const allLangs = ["en", "es", "de", "fr", "ja", "pl"];
```

<!-- ① Temporal slider + ② Language selector + Mode -->
```js
// ① Dual-range year slider
const yearRange = view((() => {
  const min = 1970, max = 2025;
  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex-direction:column;gap:4px;min-width:240px;max-width:340px;font-family:var(--sans-serif);font-size:13px;";

  const topRow = document.createElement("div");
  topRow.style.cssText = "display:flex;justify-content:space-between;align-items:center;";
  const lbl = document.createElement("span");
  lbl.style.cssText = "font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--theme-foreground-muted)";
  lbl.textContent = "① Période";
  const out = document.createElement("span");
  out.style.cssText = "font-weight:600;color:#1DB954;font-size:13px;";
  out.textContent = `${min} – ${max}`;
  topRow.append(lbl, out);

  const trackWrap = document.createElement("div");
  trackWrap.className = "drs-wrap";
  const track = document.createElement("div"); track.className = "drs-track";
  const fill = document.createElement("div");  fill.className = "drs-fill";
  const rangeLo = document.createElement("input");
  rangeLo.type = "range"; rangeLo.min = min; rangeLo.max = max; rangeLo.value = min;
  const rangeHi = document.createElement("input");
  rangeHi.type = "range"; rangeHi.min = min; rangeHi.max = max; rangeHi.value = max;

  function update() {
    const lo = Math.min(+rangeLo.value, +rangeHi.value);
    const hi = Math.max(+rangeLo.value, +rangeHi.value);
    const pLo = (lo - min) / (max - min) * 100;
    const pHi = (hi - min) / (max - min) * 100;
    fill.style.left = pLo + "%";
    fill.style.width = (pHi - pLo) + "%";
    out.textContent = `${lo} – ${hi}`;
    container.value = [lo, hi];
    container.dispatchEvent(new Event("input", { bubbles: true }));
  }
  rangeLo.addEventListener("input", () => { if (+rangeLo.value > +rangeHi.value) rangeLo.value = rangeHi.value; update(); });
  rangeHi.addEventListener("input", () => { if (+rangeHi.value < +rangeLo.value) rangeHi.value = rangeLo.value; update(); });
  trackWrap.append(track, fill, rangeLo, rangeHi);
  container.append(topRow, trackWrap);
  update();
  return container;
})());
```

```js
// ② Language pills selector
const selectedLangs = view((() => {
  const defaultOn = ["en", "fr"];
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:6px;";
  wrap.value = [...defaultOn];

  const lbl = document.createElement("div");
  lbl.style.cssText = "font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--theme-foreground-muted)";
  lbl.textContent = "② Langues analysées";
  const pillRow = document.createElement("div");
  pillRow.className = "lang-pills";

  allLangs.forEach(code => {
    const isOn = defaultOn.includes(code);
    const pill = document.createElement("button");
    pill.className = "lang-pill";
    pill.textContent = langMeta[code].label;
    pill.dataset.code = code;
    pill.dataset.on = isOn ? "1" : "0";
    const col = langMeta[code].color;
    const applyStyle = on => {
      pill.style.borderColor = col;
      pill.style.background = on ? col : "transparent";
      pill.style.color = on ? "#fff" : col;
    };
    applyStyle(isOn);
    pill.addEventListener("click", () => {
      pill.dataset.on = pill.dataset.on === "1" ? "0" : "1";
      applyStyle(pill.dataset.on === "1");
      wrap.value = Array.from(wrap.querySelectorAll(".lang-pill[data-on='1']")).map(b => b.dataset.code);
      wrap.dispatchEvent(new Event("input", { bubbles: true }));
    });
    pillRow.appendChild(pill);
  });
  wrap.append(lbl, pillRow);
  return wrap;
})());
```

```js
// ③ Objet d'analyse : genre musical ou genre d'artiste (mode normalisé %)
const normalised = view((() => {
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:6px;";
  wrap.value = false;

  const lbl = document.createElement("div");
  lbl.style.cssText = "font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--theme-foreground-muted)";
  lbl.textContent = "③ Affichage";

  const btns = document.createElement("div");
  btns.className = "mode-btns";

  const b1 = document.createElement("button"); b1.className = "mode-btn"; b1.textContent = "Absolu"; b1.dataset.on = "1";
  const b2 = document.createElement("button"); b2.className = "mode-btn"; b2.textContent = "Normalisé (%)"; b2.dataset.on = "0";

  b1.addEventListener("click", () => { b1.dataset.on="1"; b2.dataset.on="0"; wrap.value=false; wrap.dispatchEvent(new Event("input",{bubbles:true})); });
  b2.addEventListener("click", () => { b1.dataset.on="0"; b2.dataset.on="1"; wrap.value=true;  wrap.dispatchEvent(new Event("input",{bubbles:true})); });

  btns.append(b1, b2);
  wrap.append(lbl, btns);
  return wrap;
})());
```

```js
// ④ Genre filter selector (top 12 or "Tous")
const genreFilter = view((() => {
  const options = ["Tous", ...topGenres];
  const sel = document.createElement("select");
  sel.style.cssText = "padding:5px 10px;border-radius:8px;border:1.5px solid #ccc;font-family:var(--sans-serif);font-size:13px;background:var(--theme-background);color:var(--theme-foreground);cursor:pointer;";
  options.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g; opt.textContent = g === "Tous" ? "Tous les genres" : g;
    sel.appendChild(opt);
  });
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:6px;";
  const lbl = document.createElement("div");
  lbl.style.cssText = "font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--theme-foreground-muted)";
  lbl.textContent = "④ Genre";
  sel.addEventListener("change", () => { wrap.value = sel.value; wrap.dispatchEvent(new Event("input",{bubbles:true})); });
  wrap.value = "Tous";
  wrap.append(lbl, sel);
  return wrap;
})());
```

<div class="hom-controls">
  <div>${yearRange}</div>
  <div>${selectedLangs}</div>
  <div>${normalised}</div>
  <div>${genreFilter}</div>
</div>

```js
// ─── Derived data ────────────────────────────────────────────────────────────
const raw = Array.from(rawData);

// Filter by selected languages + year range + genre filter
const filtered = raw.filter(d =>
  selectedLangs.includes(d.language_code) &&
  d.release_year >= yearRange[0] &&
  d.release_year <= yearRange[1] &&
  (genreFilter === "Tous" ? topGenres.includes(d.genre) : d.genre === genreFilter)
);

// Aggregate by genre + year (sum across selected languages)
const areaMap = new Map(); // key: `${genre}|${year}` -> track_count
const years = new Set();
const genresPresent = new Set();
for (const d of filtered) {
  const key = `${d.genre}|${d.release_year}`;
  areaMap.set(key, (areaMap.get(key) ?? 0) + d.track_count);
  years.add(d.release_year);
  genresPresent.add(d.genre);
}

// Build flat array for stacked area
const areaData = [];
for (const year of [...years].sort((a,b)=>a-b)) {
  for (const genre of genresPresent) {
    areaData.push({ year, genre, count: areaMap.get(`${genre}|${year}`) ?? 0 });
  }
}

// Normalise if needed
let plotData = areaData;
if (normalised) {
  // compute total per year
  const yearTotal = new Map();
  for (const d of areaData) yearTotal.set(d.year, (yearTotal.get(d.year) ?? 0) + d.count);
  plotData = areaData.map(d => ({
    ...d,
    count: yearTotal.get(d.year) > 0 ? d.count / yearTotal.get(d.year) * 100 : 0
  }));
}

// Colors for genres (consistent palette)
const genreList = genreFilter === "Tous" ? topGenres.filter(g => genresPresent.has(g)) : [genreFilter];
const palette = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c","#16a085","#d35400","#2c3e50","#27ae60","#8e44ad","#c0392b"];
const genreColor = Object.fromEntries(genreList.map((g,i) => [g, palette[i % palette.length]]));
```

```js
// ─── Pie chart data (language share for selected period) ───────────────────
const langPieData = allLangs.map(code => {
  const total = raw
    .filter(d => d.language_code === code && d.release_year >= yearRange[0] && d.release_year <= yearRange[1])
    .reduce((s,d) => s + d.track_count, 0);
  return { lang: code, label: langMeta[code].label, count: total, color: langMeta[code].color };
}).filter(d => d.count > 0);
const pieTotal = langPieData.reduce((s,d)=>s+d.count,0);
```

<!-- ─── Hover detail state ─────────────────────────────────────────────────── -->
```js
const hoverDetail = Mutable(null);
```

<div class="hom-charts">
  <div class="hom-area-wrap">
    <h3>Évolution des genres musicaux${normalised ? " (normalisé, %)" : " (nombre de titres)"}</h3>

```js
// ─── Stacked area chart ───────────────────────────────────────────────────
const areaPlot = Plot.plot({
  width: 680,
  height: 380,
  marginLeft: 55,
  marginBottom: 45,
  x: {
    label: "Année →",
    tickFormat: d => String(d),
  },
  y: {
    label: normalised ? "Part (%)" : "Nombre de titres →",
    grid: true,
    tickFormat: normalised ? d => d.toFixed(0) + "%" : undefined,
  },
  color: {
    domain: genreList,
    range: genreList.map(g => genreColor[g]),
    legend: true,
  },
  marks: [
    Plot.areaY(plotData, {
      x: "year",
      y: "count",
      fill: "genre",
      order: genreList,
      tip: true,
      title: d => `${d.genre}\n${d.year}\n${normalised ? d.count.toFixed(1) + "%" : d.count + " titres"}`,
    }),
    Plot.ruleY([0]),
  ],
});

display(areaPlot);
```

  </div>
  <div class="hom-pie-wrap">
    <h3>Part globale des langues</h3>
    <p style="font-size:11px;color:var(--theme-foreground-muted);margin:0 0 8px;">Période sélectionnée : ${yearRange[0]}–${yearRange[1]}</p>

```js
// ─── Pie / donut chart for language share ────────────────────────────────
const pieWidth = 240, pieHeight = 240, R = 88, r = 44;
const cx = pieWidth / 2, cy = pieHeight / 2;

// Build arcs
let cumAngle = -Math.PI / 2;
const arcs = langPieData.map(d => {
  const angle = d.count / pieTotal * 2 * Math.PI;
  const a0 = cumAngle, a1 = cumAngle + angle;
  cumAngle = a1;
  const midA = (a0 + a1) / 2;
  return { ...d, a0, a1, midA, pct: (d.count / pieTotal * 100).toFixed(1) };
});

function arcPath(a0, a1, R, r) {
  const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
  const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
  const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
  const x3 = cx + r * Math.cos(a0), y3 = cy + r * Math.sin(a0);
  const lg = (a1 - a0) > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${R} ${R} 0 ${lg} 1 ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 ${lg} 0 ${x3} ${y3} Z`;
}

const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("viewBox", `0 0 ${pieWidth} ${pieHeight}`);
svg.setAttribute("width", pieWidth);
svg.setAttribute("height", pieHeight);
svg.style.display = "block";
svg.style.margin = "0 auto";

// Highlight border for selected langs
arcs.forEach(a => {
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", arcPath(a.a0, a.a1, R, r));
  path.setAttribute("fill", a.color);
  path.setAttribute("stroke", selectedLangs.includes(a.lang) ? "#fff" : "var(--theme-background-alt)");
  path.setAttribute("stroke-width", selectedLangs.includes(a.lang) ? "3" : "1.5");
  path.style.opacity = selectedLangs.includes(a.lang) ? "1" : "0.35";
  path.style.cursor = "pointer";

  // tooltip title
  const title = document.createElementNS(svgNS, "title");
  title.textContent = `${a.label}: ${a.pct}% (${a.count.toLocaleString()} titres)`;
  path.appendChild(title);

  svg.appendChild(path);

  // label if arc big enough
  if (a.a1 - a.a0 > 0.25) {
    const lx = cx + (R * 0.72) * Math.cos(a.midA);
    const ly = cy + (R * 0.72) * Math.sin(a.midA);
    const txt = document.createElementNS(svgNS, "text");
    txt.setAttribute("x", lx);
    txt.setAttribute("y", ly);
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("dominant-baseline", "middle");
    txt.setAttribute("fill", "#fff");
    txt.setAttribute("font-size", "11");
    txt.setAttribute("font-weight", "700");
    txt.setAttribute("font-family", "var(--sans-serif)");
    txt.textContent = a.pct + "%";
    svg.appendChild(txt);
  }
});

// center label
const centerTxt = document.createElementNS(svgNS, "text");
centerTxt.setAttribute("x", cx); centerTxt.setAttribute("y", cy - 6);
centerTxt.setAttribute("text-anchor", "middle");
centerTxt.setAttribute("dominant-baseline", "middle");
centerTxt.setAttribute("font-size", "13");
centerTxt.setAttribute("font-weight", "700");
centerTxt.setAttribute("font-family", "var(--sans-serif)");
centerTxt.setAttribute("fill", "var(--theme-foreground)");
centerTxt.textContent = pieTotal.toLocaleString();
svg.appendChild(centerTxt);
const centerSub = document.createElementNS(svgNS, "text");
centerSub.setAttribute("x", cx); centerSub.setAttribute("y", cy + 14);
centerSub.setAttribute("text-anchor", "middle");
centerSub.setAttribute("dominant-baseline", "middle");
centerSub.setAttribute("font-size", "9");
centerSub.setAttribute("font-family", "var(--sans-serif)");
centerSub.setAttribute("fill", "var(--theme-foreground-muted)");
centerSub.textContent = "titres total";
svg.appendChild(centerSub);

display(svg);
```

```js
// Legend for pie
const legendDiv = document.createElement("div");
legendDiv.style.cssText = "margin-top:10px;font-family:var(--sans-serif);font-size:12px;display:flex;flex-direction:column;gap:4px;";
langPieData.forEach(d => {
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;gap:7px;";
  const dot = document.createElement("span");
  dot.style.cssText = `width:12px;height:12px;border-radius:2px;background:${d.color};flex-shrink:0;opacity:${selectedLangs.includes(d.lang) ? 1 : 0.35};`;
  const info = document.createElement("span");
  info.style.cssText = `color:${selectedLangs.includes(d.lang) ? "var(--theme-foreground)" : "var(--theme-foreground-muted)"};`;
  info.textContent = `${d.label} — ${d.pct}%`;
  row.append(dot, info);
  legendDiv.appendChild(row);
});
display(legendDiv);
```

  </div>
</div>

<!-- ─── Detail panel ────────────────────────────────────────────────────────── -->
<div class="hom-detail">
  <h3>Détail · survolez le graphique pour explorer</h3>

```js
// Top genre in the selected period for selected languages
const topGenreData = (() => {
  const byGenre = new Map();
  for (const d of filtered) {
    byGenre.set(d.genre, (byGenre.get(d.genre) ?? 0) + d.track_count);
  }
  if (byGenre.size === 0) return null;
  const sorted = [...byGenre.entries()].sort((a,b) => b[1]-a[1]);
  const [topG, topCount] = sorted[0];
  const totalAll = [...byGenre.values()].reduce((s,v)=>s+v,0);
  return { genre: topG, count: topCount, total: totalAll, pct: (topCount/totalAll*100).toFixed(1), rank: sorted };
})();

const langLabels = selectedLangs.map(c => langMeta[c]?.label ?? c).join(", ") || "—";

if (topGenreData) {
  const detailDiv = document.createElement("div");
  detailDiv.className = "hom-detail-grid";

  const items = [
    { key: "Langues sélectionnées", val: langLabels },
    { key: "Période", val: `${yearRange[0]} – ${yearRange[1]}` },
    { key: "Genre dominant", val: topGenreData.genre },
    { key: "Part du genre dominant", val: topGenreData.pct + " %" },
    { key: "Titres (genre dom.)", val: topGenreData.count.toLocaleString() },
    { key: "Total titres", val: topGenreData.total.toLocaleString() },
  ];

  items.forEach(({ key, val }) => {
    const item = document.createElement("div");
    item.className = "hom-detail-item";
    const k = document.createElement("span"); k.className = "hom-detail-key"; k.textContent = key;
    const v = document.createElement("span"); v.className = "hom-detail-val"; v.textContent = val;
    item.append(k, v);
    detailDiv.appendChild(item);
  });

  // Top 5 genres bar
  const barDiv = document.createElement("div");
  barDiv.style.cssText = "width:100%;margin-top:12px;";
  const barTitle = document.createElement("div");
  barTitle.style.cssText = "font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--theme-foreground-muted);margin-bottom:6px;";
  barTitle.textContent = "Top 5 genres — période sélectionnée";
  barDiv.appendChild(barTitle);

  const top5 = topGenreData.rank.slice(0, 5);
  const maxCount = top5[0][1];
  top5.forEach(([g, cnt], i) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:12px;";
    const name = document.createElement("span");
    name.style.cssText = "min-width:130px;color:var(--theme-foreground);";
    name.textContent = g;
    const barWrap = document.createElement("div");
    barWrap.style.cssText = "flex:1;background:#eee;border-radius:4px;height:10px;overflow:hidden;";
    const bar = document.createElement("div");
    const col = genreColor[g] ?? palette[i % palette.length];
    bar.style.cssText = `width:${(cnt/maxCount*100).toFixed(1)}%;height:100%;background:${col};border-radius:4px;`;
    barWrap.appendChild(bar);
    const countSpan = document.createElement("span");
    countSpan.style.cssText = "min-width:60px;text-align:right;color:var(--theme-foreground-muted);";
    countSpan.textContent = cnt.toLocaleString();
    row.append(name, barWrap, countSpan);
    barDiv.appendChild(row);
  });

  display(detailDiv);
  display(barDiv);
} else {
  const p = document.createElement("p");
  p.className = "hom-placeholder";
  p.textContent = "Aucune donnée pour la sélection actuelle. Choisissez au moins une langue.";
  display(p);
}
```

</div>
