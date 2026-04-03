---
toc: false
---

<div class="hero">
  <h1>Spotify Analytics</h1>
  <h2>Exploration des donn�es Spotify</h2>
</div>

<style>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}
</style>

## Genres musicaux

```js
const db = await FileAttachment("data/spotify_analytics_compact.sqlite3").sqlite();
const results = await db.query("SELECT genre, SUM(row_count) AS total_count FROM agg_genre_language_year WHERE language_code = 'fr' GROUP BY genre ORDER BY total_count DESC");
```

```js
display(Plot.plot({
  marginLeft: 140,
  marginBottom: 40,
  x: { label: "Nombre de titres" },
  y: { label: null },
  marks: [
    Plot.barX(results, {
      x: "total_count",
      y: "genre",
      sort: { y: "-x" },
      fill: "#1DB954",
      tip: true
    }),
    Plot.ruleX([0])
  ]
}));
```

## Évolution des genres par année

```js
const genrey = await db.query("SELECT genre, release_year, SUM(track_count) AS track_count FROM agg_genre_year GROUP BY genre, release_year ORDER BY release_year");
```

Il est possible de sélectionner les genres (ou de tous les sélectionner/déselectionner via le bouton ci-dessous) pour visualiser les données

```js
const allGenres = [...new Set(Array.from(genrey).map(d => d.genre))].sort();

const checkbox = Inputs.checkbox(allGenres, { label: "Genres", value: allGenres });

const toggleBtn = Inputs.button("Tout désélectionner", {
  reduce: () => {
    const allSelected = checkbox.value.length === allGenres.length;
    checkbox.value = allSelected ? [] : allGenres;
    checkbox.dispatchEvent(new Event("input", { bubbles: true }));
    toggleBtn.querySelector("button").textContent = allSelected ? "Tout sélectionner" : "Tout désélectionner";
  }
});

display(toggleBtn);
const selectedGenres = view(checkbox);
```

```js
const yearRange = view((() => {
  const min = 1970, max = 2025;

  // Inject styles once
  if (!document.getElementById("drs-style")) {
    const s = document.createElement("style");
    s.id = "drs-style";
    s.textContent = `
      .drs-wrap { position: relative; height: 40px; width: 100%; }
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
        width: 20px; height: 20px; border-radius: 50%;
        background: #1DB954; cursor: pointer;
        pointer-events: all;
        border: none;
        box-shadow: none;
        margin-top: -9px;
      }
      .drs-wrap input[type=range]::-moz-range-track { background: transparent; height: 2px; }
      .drs-wrap input[type=range]::-moz-range-thumb {
        width: 20px; height: 20px; border-radius: 50%;
        background: #1DB954; cursor: pointer;
        pointer-events: all;
        border: none;
        box-shadow: none;
      }
    `;
    document.head.appendChild(s);
  }

  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex-direction:column;gap:8px;font-family:var(--sans-serif);font-size:small;margin:8px 0;width:560px";

  const labelRow = document.createElement("div");
  labelRow.style.cssText = "display:flex;align-items:center;gap:8px;";
  const label = document.createElement("label");
  label.textContent = "Années";
  label.style.minWidth = "60px";
  const out = document.createElement("span");
  out.style.marginLeft = "8px";
  out.textContent = `${min} — ${max}`;
  labelRow.append(label, out);

  const trackWrap = document.createElement("div");
  trackWrap.className = "drs-wrap";

  const track = document.createElement("div");
  track.className = "drs-track";
  const fill = document.createElement("div");
  fill.className = "drs-fill";

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
    out.textContent = `${lo} — ${hi}`;
    container.value = [lo, hi];
    container.dispatchEvent(new Event("input", { bubbles: true }));
  }

  rangeLo.addEventListener("input", () => { if (+rangeLo.value > +rangeHi.value) rangeLo.value = rangeHi.value; update(); });
  rangeHi.addEventListener("input", () => { if (+rangeHi.value < +rangeLo.value) rangeHi.value = rangeLo.value; update(); });

  trackWrap.append(track, fill, rangeLo, rangeHi);
  container.append(labelRow, trackWrap);
  update();
  return container;
})());
```

```js
const filteredGenrey = Array.from(genrey).filter(d => selectedGenres.includes(d.genre) && d.release_year >= yearRange[0] && d.release_year <= yearRange[1]);

display(Plot.plot({
  marginLeft: 60,
  y: {grid: true},
  color: {legend: true, columns: 6},
  marks: [
    Plot.areaY(filteredGenrey, {x: "release_year", y: "track_count", fill: "genre"})
  ]
}))
```

# Analyse des tendances musicales

Comparez l'évolution des genres musicaux selon les langues avec leurs caractéristiques audio.

```js
// Load all data for the experiment section
const [expRaw, topLangsQ, topGenresQ] = await Promise.all([
  db.query(`
    SELECT genre, language_code, release_year, track_count, avg_duration_ms, avg_track_popularity
    FROM agg_genre_language_year
    WHERE release_year >= 1970
    ORDER BY release_year
  `),
  db.query(`
    SELECT language_code, SUM(track_count) AS total
    FROM agg_genre_language_year
    WHERE release_year >= 1970
    GROUP BY language_code
    ORDER BY total DESC
    LIMIT 8
  `),
  db.query(`
    SELECT genre, SUM(track_count) AS total
    FROM agg_genre_language_year
    WHERE release_year >= 1970
    GROUP BY genre
    ORDER BY total DESC
    LIMIT 12
  `)
]);

const expLangs = Array.from(topLangsQ).map(d => d.language_code);
const expGenresList = Array.from(topGenresQ).map(d => d.genre);

const langLabel = {
  fr: "Français", en: "Anglais", de: "Allemand", es: "Espagnol",
  pt: "Portugais", it: "Italien", ja: "Japonais", ko: "Coréen",
  ar: "Arabe", ru: "Russe", tr: "Turc", nl: "Néerlandais"
};
const getLangLabel = code => langLabel[code] || code.toUpperCase();
```

```js
// Language pill selector — choose which languages to compare
const activeLangs = view((() => {
  const defaultActive = expLangs.slice(0, 4);
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-family:var(--sans-serif);font-size:14px;margin:10px 0 4px;";
  wrap.value = [...defaultActive];

  const lbl = document.createElement("span");
  lbl.textContent = "Langues :";
  lbl.style.cssText = "font-weight:600;min-width:72px;";
  wrap.appendChild(lbl);

  expLangs.forEach(code => {
    const isOn = defaultActive.includes(code);
    const pill = document.createElement("button");
    pill.textContent = getLangLabel(code);
    pill.dataset.code = code;
    pill.dataset.on = isOn ? "1" : "0";
    pill.style.cssText = "padding:5px 16px;border-radius:20px;cursor:pointer;font-size:13px;font-family:inherit;border:2px solid;transition:all .15s;";
    const applyStyle = on => {
      pill.style.background = on ? "#1DB954" : "transparent";
      pill.style.borderColor = on ? "#1DB954" : "#aaa";
      pill.style.color = on ? "#fff" : "";
    };
    applyStyle(isOn);
    pill.addEventListener("click", () => {
      pill.dataset.on = pill.dataset.on === "1" ? "0" : "1";
      applyStyle(pill.dataset.on === "1");
      wrap.value = Array.from(wrap.querySelectorAll("button[data-on='1']")).map(b => b.dataset.code);
      wrap.dispatchEvent(new Event("input", { bubbles: true }));
    });
    wrap.appendChild(pill);
  });
  return wrap;
})());
```

```js
// Split dimension: facet the chart by Language or Genre
const splitDim = view(Inputs.radio(["Langue", "Genre"], { label: "Diviser selon", value: "Langue" }));
```

```js
// Display mode: absolute track counts or normalized (%)
const normalise = view(Inputs.radio(["Absolus", "Normalisé (%)"], { label: "Affichage", value: "Absolus" }));
```

```js
// Genre multi-select with toggle-all button
const expCheckbox = Inputs.checkbox(expGenresList, { label: "Genres", value: expGenresList });
const expToggleBtn = Inputs.button("Tout désélectionner", {
  reduce: () => {
    const allOn = expCheckbox.value.length === expGenresList.length;
    expCheckbox.value = allOn ? [] : expGenresList;
    expCheckbox.dispatchEvent(new Event("input", { bubbles: true }));
    expToggleBtn.querySelector("button").textContent = allOn ? "Tout sélectionner" : "Tout désélectionner";
  }
});
display(expToggleBtn);
const expSelGenres = view(expCheckbox);
```

```js
// Year range slider (independent from the one above)
const expYears = view((() => {
  const min = 1970, max = 2025;
  if (!document.getElementById("drs-style")) {
    const s = document.createElement("style");
    s.id = "drs-style";
    s.textContent = `
      .drs-wrap { position: relative; height: 40px; width: 100%; }
      .drs-track { position: absolute; left: 0; right: 0; top: 19px; height: 2px; background: #ccc; }
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
        width: 20px; height: 20px; border-radius: 50%;
        background: #1DB954; cursor: pointer;
        pointer-events: all; border: none; box-shadow: none; margin-top: -9px;
      }
      .drs-wrap input[type=range]::-moz-range-track { background: transparent; height: 2px; }
      .drs-wrap input[type=range]::-moz-range-thumb {
        width: 20px; height: 20px; border-radius: 50%;
        background: #1DB954; cursor: pointer;
        pointer-events: all; border: none; box-shadow: none;
      }
    `;
    document.head.appendChild(s);
  }
  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex-direction:column;gap:8px;font-family:var(--sans-serif);font-size:small;margin:8px 0;max-width:560px";
  const labelRow = document.createElement("div");
  labelRow.style.cssText = "display:flex;align-items:center;gap:8px;";
  const label = document.createElement("label");
  label.textContent = "Années";
  label.style.minWidth = "60px";
  const out = document.createElement("span");
  out.style.marginLeft = "8px";
  out.textContent = `${min} — ${max}`;
  labelRow.append(label, out);
  const trackWrap = document.createElement("div");
  trackWrap.className = "drs-wrap";
  const track = document.createElement("div");
  track.className = "drs-track";
  const fill = document.createElement("div");
  fill.className = "drs-fill";
  const rangeLo = document.createElement("input");
  rangeLo.type = "range"; rangeLo.min = min; rangeLo.max = max; rangeLo.value = min;
  const rangeHi = document.createElement("input");
  rangeHi.type = "range"; rangeHi.min = min; rangeHi.max = max; rangeHi.value = max;
  function update() {
    const lo = Math.min(+rangeLo.value, +rangeHi.value);
    const hi = Math.max(+rangeLo.value, +rangeHi.value);
    fill.style.left = (lo - min) / (max - min) * 100 + "%";
    fill.style.width = (hi - lo) / (max - min) * 100 + "%";
    out.textContent = `${lo} — ${hi}`;
    container.value = [lo, hi];
    container.dispatchEvent(new Event("input", { bubbles: true }));
  }
  rangeLo.addEventListener("input", () => { if (+rangeLo.value > +rangeHi.value) rangeLo.value = rangeHi.value; update(); });
  rangeHi.addEventListener("input", () => { if (+rangeHi.value < +rangeLo.value) rangeHi.value = rangeLo.value; update(); });
  trackWrap.append(track, fill, rangeLo, rangeHi);
  container.append(labelRow, trackWrap);
  update();
  return container;
})());
```

```js
// Faceted area chart + audio feature line charts
const filteredExp = Array.from(expRaw).filter(d =>
  activeLangs.includes(d.language_code) &&
  expSelGenres.includes(d.genre) &&
  d.release_year >= expYears[0] &&
  d.release_year <= expYears[1]
);

const facetKey = splitDim === "Langue" ? "language_code" : "genre";
const colorKey = splitDim === "Langue" ? "genre" : "language_code";

// Main faceted area chart
const areaOpts = normalise === "Normalisé (%)"
  ? Plot.stackY({ offset: "expand" }, { x: "release_year", y: "track_count", fill: colorKey, curve: "monotone-x" })
  : { x: "release_year", y: "track_count", fill: colorKey, curve: "monotone-x" };

display(Plot.plot({
  facet: { data: filteredExp, x: facetKey },
  fx: {
    label: null,
    tickFormat: facetKey === "language_code" ? getLangLabel : d => d
  },
  width,
  height: 300,
  marginLeft: 50,
  marginBottom: 40,
  y: {
    label: normalise === "Normalisé (%)" ? "Proportion" : "Titres",
    tickFormat: normalise === "Normalisé (%)" ? ".0%" : "s",
    grid: true
  },
  color: {
    legend: true,
    columns: 5,
    tickFormat: colorKey === "language_code" ? getLangLabel : undefined
  },
  frame: true,
  marks: [
    Plot.areaY(filteredExp, areaOpts),
    Plot.ruleY([0])
  ]
}));

// Audio features: weighted avg per year across the filtered data
const featsMap = {};
for (const d of filteredExp) {
  if (!featsMap[d.release_year]) featsMap[d.release_year] = { year: d.release_year, durWSum: 0, popWSum: 0, w: 0 };
  const wt = d.track_count || 1;
  if (d.avg_duration_ms)        featsMap[d.release_year].durWSum += d.avg_duration_ms * wt;
  if (d.avg_track_popularity)   featsMap[d.release_year].popWSum += d.avg_track_popularity * wt;
  featsMap[d.release_year].w += wt;
}
const feats = Object.values(featsMap)
  .map(d => ({ year: d.year, duration: d.durWSum / d.w / 60000, popularity: d.popWSum / d.w }))
  .filter(d => isFinite(d.duration) && isFinite(d.popularity))
  .sort((a, b) => a.year - b.year);

const featGrid = document.createElement("div");
featGrid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;";
featGrid.append(
  Plot.plot({
    width: Math.floor(width / 2) - 10,
    height: 160,
    marginLeft: 55,
    x: { label: "Année" },
    y: { label: "Durée moy. (min)", grid: true },
    marks: [
      Plot.line(feats, { x: "year", y: "duration", stroke: "#1DB954", strokeWidth: 2, curve: "monotone-x" }),
      Plot.dot(feats, { x: "year", y: "duration", fill: "#1DB954", r: 3, tip: true,
        title: d => `${d.year}\nDurée: ${d.duration.toFixed(1)} min` })
    ]
  }),
  Plot.plot({
    width: Math.floor(width / 2) - 10,
    height: 160,
    marginLeft: 55,
    x: { label: "Année" },
    y: { label: "Popularité moy.", grid: true },
    marks: [
      Plot.line(feats, { x: "year", y: "popularity", stroke: "#E8A838", strokeWidth: 2, curve: "monotone-x" }),
      Plot.dot(feats, { x: "year", y: "popularity", fill: "#E8A838", r: 3, tip: true,
        title: d => `${d.year}\nPopularité: ${d.popularity.toFixed(1)}` })
    ]
  })
);
display(featGrid);
```

