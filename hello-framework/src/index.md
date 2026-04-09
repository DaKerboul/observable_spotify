---
toc: false
---

<div class="hero">
  <h1>Evolution in music production</h1>
  <h2>How did the most widely shared music trends evolve over time, across genres and languages?</h2>
</div>

<style>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 3rem 0 2rem;
  text-align: center;
}
.hero h1 {
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  max-width: none;
  font-size: clamp(2.5rem, 10vw, 7rem);
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, #1DB954, #1a75cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero h2 {
  margin: 0.4rem 0 0;
  max-width: 42rem;
  font-size: clamp(1.15rem, 2.1vw, 1.65rem);
  font-weight: 600;
  line-height: 1.35;
  color: var(--theme-foreground-muted);
}

/* ── Tab selector (shared for metric + découpage) ──────────────────────── */
.tab-selector { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.tab-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--theme-foreground-muted); white-space: nowrap; }
.tab-group { display: flex; gap: 4px; flex-wrap: wrap; }
.tab-btn {
  padding: 5px 15px; border-radius: 8px;
  border: 1.5px solid var(--theme-foreground-faint, #ddd);
  background: var(--theme-background-alt);
  color: var(--theme-foreground-muted);
  font-size: 0.8rem; font-weight: 600; font-family: var(--sans-serif);
  cursor: pointer; transition: all .12s; line-height: 1.4;
}
.tab-btn:hover:not(.active) { border-color: #1DB95488; color: var(--theme-foreground); }
.tab-btn.active { background: #1DB954; border-color: #1DB954; color: #fff; }
.tab-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.tab-btn:disabled:hover { border-color: var(--theme-foreground-faint, #ddd); color: var(--theme-foreground-muted); }
</style>

```js
// ── Imports ──────────────────────────────────────────────────────────────
import { yearSlider }            from "./components/yearSlider.js";
import { searchableMultiSelect } from "./components/searchableMultiSelect.js";
import { langPieChart }          from "./components/langPieChart.js";
import { langMeta, getLang, getLangColor, langLabel } from "./utils/langMeta.js";
```

```js
// ── Chargement des données ──────────────────────────────────────────────
const genreLangYear = await FileAttachment("data/genre_language_year.json").json();
```

```js
// ── Constantes dérivées ─────────────────────────────────────────────────
const allGenres = [...new Set(genreLangYear.map(d => d.genre))].sort();

const defaultGenres = [...d3.rollup(genreLangYear, v => d3.sum(v, d => +d.track_count), d => d.genre)]
  .sort((a, b) => b[1] - a[1]).slice(0, 12).map(d => d[0]);

const topLangs = [...d3.rollup(genreLangYear, v => d3.sum(v, d => +d.track_count), d => d.language_code).entries()]
  .sort((a, b) => b[1] - a[1]).slice(0, 10).map(d => d[0]);

const palette12 = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c",
                   "#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#b15928","#ffff99"];

// Ordre global stable des genres (calculé sur toutes les années, pas sur la fenêtre filtrée)
const genreGlobalOrder = [...d3.rollup(genreLangYear, v => d3.sum(v, d => +d.track_count), d => d.genre)]
  .sort((a, b) => b[1] - a[1]).map(d => d[0]);
```

```js
// ── Sélection des langues (Mutable, piloté par le disque) ───────────────
const selectedLangs = Mutable([...topLangs]);
const toggleLang = (lang) => {
  const cur = selectedLangs.value;
  if (cur.includes(lang)) {
    if (cur.length > 1) selectedLangs.value = cur.filter(l => l !== lang);
  } else {
    selectedLangs.value = [...cur, lang];
  }
};
```

<!-- ════════════════════════════════════════════════════════════════════════
     LAYOUT : filtres à gauche, contrôles + disque à droite
     ════════════════════════════════════════════════════════════════════════ -->

<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start;margin-bottom:1.5rem;">
<div>

### Filtre

```js
// ── Filtre genre : création de l'élément (réf stable) ───────────────────
const genreFilterEl = searchableMultiSelect(allGenres, {label: "Genres (max 12)", value: defaultGenres, max: 12});
display(genreFilterEl);
```

```js
// ── Filtre genre : écoute réactive ──────────────────────────────────────
const selectedGenres = Generators.input(genreFilterEl);
```

```js
// ── Effet : adapter le filtre genre selon le découpage ───────────────────
{
  const byGenre = decoupage === "genre";
  genreFilterEl.setBtnAllVisible(!byGenre);
  genreFilterEl.setMax(byGenre ? 12 : Infinity);
  if (byGenre && selectedGenres.length > 12) {
    genreFilterEl.setValue(defaultGenres);
    alert(`La sélection a été réinitialisée aux 12 genres par défaut.\nEn mode "Découpage par genre", la sélection est limitée à 12 genres.`);
  }
}
```

</div>
<div>

```js
// ── Filtre langue (disque vinyle, toujours visible) ─────────────────────
const langPieData = topLangs.map(code => {
  const total = genreLangYear
    .filter(d => d.language_code === code
      && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1]
      && selectedGenres.includes(d.genre))
    .reduce((s, d) => s + (+d.track_count), 0);
  return { lang: code, label: getLang(code), count: total, color: getLangColor(code) };
}).filter(d => d.count > 0);

const pieTotal = langPieData.reduce((s, d) => s + d.count, 0);
display(langPieChart(langPieData, pieTotal, selectedLangs, toggleLang));
```

</div>
<div>

```js
// ── Découpage : comment séparer les areas / lignes du graphe ? ──────────
const decoupage = (() => {
  const tabs = [["aucun", "Aucun"], ["genre", "Par genre"], ["langue", "Par langue"]];
  let current = "genre";
  const wrap = document.createElement("div");
  wrap.className = "tab-selector";
  const lbl = document.createElement("span");
  lbl.className = "tab-label";
  lbl.textContent = "Découpage";
  const grp = document.createElement("div");
  grp.className = "tab-group";
  const buttons = [];
  tabs.forEach(([value, label]) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (value === current ? " active" : "");
    btn.textContent = label;
    btn.type = "button";
    btn.dataset.value = value;
    btn.onclick = () => {
      if (btn.disabled) return;
      current = value;
      grp.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
      wrap.dispatchEvent(new CustomEvent("input"));
    };
    grp.appendChild(btn);
    buttons.push(btn);
  });
  wrap.append(lbl, grp);
  Object.defineProperty(wrap, "value", { get: () => current });
  display(wrap);
  return Generators.input(wrap);
})();
```

```js
// ── Diviser par : small multiples (facettes) ────────────────────────────
// On ne peut pas diviser par la même dimension que le découpage
const diviserPar = (() => {
  const opts = [["aucun", "—"]];
  if (decoupage !== "genre")  opts.push(["genre", "Genre"]);
  if (decoupage !== "langue") opts.push(["langue", "Langue"]);

  let current = "aucun";
  const wrap = document.createElement("div");
  wrap.className = "tab-selector";
  const lbl = document.createElement("span");
  lbl.className = "tab-label";
  lbl.textContent = "Diviser par";
  const grp = document.createElement("div");
  grp.className = "tab-group";
  opts.forEach(([value, label]) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (value === current ? " active" : "");
    btn.textContent = label;
    btn.type = "button";
    btn.onclick = () => {
      current = value;
      grp.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
      wrap.dispatchEvent(new CustomEvent("input"));
    };
    grp.appendChild(btn);
  });
  wrap.append(lbl, grp);
  Object.defineProperty(wrap, "value", { get: () => current });
  display(wrap);
  return Generators.input(wrap);
})();
```

```js
// ── Normaliser (on/off) ─────────────────────────────────────────────────
const normaliser = (() => {
  let on = false;
  const wrap = document.createElement("div");
  wrap.className = "tab-selector";
  const lbl = document.createElement("span");
  lbl.className = "tab-label";
  lbl.textContent = "Normaliser";
  const btn = document.createElement("button");
  btn.className = "tab-btn";
  btn.textContent = "Off";
  btn.type = "button";
  btn.onclick = () => {
    on = !on;
    btn.classList.toggle("active", on);
    btn.textContent = on ? "On" : "Off";
    wrap.dispatchEvent(new CustomEvent("input"));
  };
  wrap.append(lbl, btn);
  Object.defineProperty(wrap, "value", { get: () => on });
  display(wrap);
  return Generators.input(wrap);
})();
```

</div>
</div>

```js
// ── Préparation des données filtrées ────────────────────────────────────
const filteredData = genreLangYear.filter(d =>
  selectedGenres.includes(d.genre) &&
  selectedLangs.includes(d.language_code) &&
  +d.release_year >= evoYearRange[0] &&
  +d.release_year <= evoYearRange[1]
);
```

```js
// ── Rendu du graphe ─────────────────────────────────────────────────────
{
  const genreColorScale = (keys) => {
    const ext = d3.quantize(d3.interpolateRainbow, Math.max(keys.length, 2));
    return keys.map((g, i) => i < palette12.length ? palette12[i] : ext[i]);
  };
  const fillField  = decoupage  === "genre" ? "genre" : decoupage  === "langue" ? "language_code" : null;
  const facetField = diviserPar === "genre" ? "genre" : diviserPar === "langue" ? "language_code" : null;

  // ── Données agrégées selon les dimensions actives ─────────────────────
  const groupKeys = [...new Set([fillField, facetField].filter(Boolean))];
  const data = groupKeys.length === 2
    ? d3.rollups(filteredData, v => d3.sum(v, d => +d.track_count),
        d => d[fillField], d => d[facetField], d => +d.release_year
      ).flatMap(([f, facets]) => facets.flatMap(([fac, years]) =>
        years.map(([y, c]) => ({ [fillField]: f, [facetField]: fac, release_year: y, track_count: c }))))
    : groupKeys.length === 1
      ? d3.rollups(filteredData, v => d3.sum(v, d => +d.track_count),
          d => d[groupKeys[0]], d => +d.release_year
        ).flatMap(([k, years]) => years.map(([y, c]) => ({ [groupKeys[0]]: k, release_year: y, track_count: c })))
      : d3.rollups(filteredData, v => d3.sum(v, d => +d.track_count),
          d => +d.release_year
        ).map(([y, c]) => ({ release_year: y, track_count: c }));

  // ── Couleurs du fill ──────────────────────────────────────────────────
  let colorCfg, areaFill = "#1DB954", fillOpacity = 0.6, order;
  if (fillField === "genre") {
    // Ordre stable basé sur les counts globaux (toutes années), pas sur la fenêtre filtrée
    order = genreGlobalOrder.filter(g => selectedGenres.includes(g));
    colorCfg = { domain: order, range: genreColorScale(order), legend: true, columns: 4 };
    areaFill = "genre";
    fillOpacity = undefined;
  } else if (fillField === "language_code") {
    order = topLangs.filter(l => selectedLangs.includes(l));
    colorCfg = { domain: order, range: order.map(l => getLangColor(l)), legend: true, columns: 4, tickFormat: c => getLang(c) };
    areaFill = "language_code";
    fillOpacity = undefined;
  }

  // ── Facettes ──────────────────────────────────────────────────────────
  // Remap language_code → label lisible dans les données pour l'affichage fy
  if (facetField === "language_code") {
    for (const d of data) d._facet = getLang(d.language_code);
  } else if (facetField === "genre") {
    for (const d of data) d._facet = d.genre;
  }
  const facetKeys = facetField ? [...new Set(data.map(d => d._facet))] : [];
  const nFacets = facetKeys.length;
  const plotHeight = nFacets > 1 ? nFacets * 110 + 60 : 380;

  // ── Mark options ──────────────────────────────────────────────────────
  const markOpts = {
    x: "release_year", y: "track_count", fill: areaFill,
    order, curve: "monotone-x", tip: true,
    title: d => {
      const parts = [];
      if (d.genre) parts.push(d.genre);
      if (d.language_code) parts.push(getLang(d.language_code));
      return `${parts.join(" · ")} · ${d.release_year}\n${d.track_count.toLocaleString()} titres`;
    }
  };
  if (fillOpacity) markOpts.fillOpacity = fillOpacity;
  if (facetField) markOpts.fy = "_facet";

  // ── Normalisation via Plot.stackY ─────────────────────────────────────
  const stackOpts = normaliser && fillField ? { offset: "normalize" } : {};
  const areaMark = fillField
    ? Plot.areaY(data, Plot.stackY(stackOpts, markOpts))
    : Plot.areaY(data, markOpts);

  // ── Plot config ───────────────────────────────────────────────────────
  const plotCfg = {
    width, height: plotHeight, marginLeft: 55, marginBottom: 40,
    y: {
      label: normaliser && fillField ? "%" : "Titres",
      grid: true,
      tickFormat: normaliser && fillField ? d => `${Math.round(d * 100)}%` : "s"
    },
    marks: [areaMark, Plot.ruleY([0])]
  };
  if (colorCfg) plotCfg.color = colorCfg;
  if (facetField) {
    plotCfg.marginRight = 140;
    plotCfg.fy = { label: null, domain: facetKeys, padding: 0.12 };
  }

  display(Plot.plot(plotCfg));
}
```

```js
const evoYearRange = view(yearSlider({min: 1970, max: 2025, label: "Période"}));
```

*Encoding note (rough): data item = one genre-year pair (aggregated across selected languages). Mark used = stacked area, chosen to show continuous change over time while also showing part-to-whole composition at each year. Visual variables: x-position maps year, y-height/area maps track count, and color hue maps genre identity.*
