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
.nav-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  margin: 1.5rem 0 2rem;
}
.nav-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 18px 24px;
  border-radius: 12px;
  text-decoration: none;
  background: var(--theme-background-alt);
  border: 2px solid transparent;
  transition: border-color .15s, box-shadow .15s;
  font-family: var(--sans-serif);
  min-width: 180px;
  max-width: 240px;
}
.nav-card:hover { border-color: #1DB954; box-shadow: 0 4px 18px #1DB95422; }
.nav-card-icon  { font-size: 1.8rem; }
.nav-card-title { font-weight: 700; font-size: 1rem; color: var(--theme-foreground); }
.nav-card-desc  { font-size: 0.78rem; color: var(--theme-foreground-muted); }

.kpi-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 2rem;
}
.kpi-card {
  flex: 1;
  min-width: 140px;
  background: var(--theme-background-alt);
  border-radius: 10px;
  padding: 14px 20px;
  font-family: var(--sans-serif);
}
.kpi-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--theme-foreground-muted);
  margin-bottom: 4px;
}
.kpi-val {
  font-size: 1.7rem;
  font-weight: 900;
  color: #1DB954;
  line-height: 1;
}
.kpi-sub {
  font-size: 0.72rem;
  color: var(--theme-foreground-muted);
  margin-top: 2px;
}
</style>

<div class="nav-cards">
  <a class="nav-card" href="./">
    <span class="nav-card-icon">📊</span>
    <span class="nav-card-title">Vue d'ensemble</span>
    <span class="nav-card-desc">Genres dominants, évolution globale</span>
  </a>
  <a class="nav-card" href="./history-of-music">
    <span class="nav-card-icon">🎵</span>
    <span class="nav-card-title">History of Music</span>
    <span class="nav-card-desc">Genres × langues × temps · stacked area</span>
  </a>
  <a class="nav-card" href="./language-trends">
    <span class="nav-card-icon">🌍</span>
    <span class="nav-card-title">Tendances par langue</span>
    <span class="nav-card-desc">Volume, durée par langue</span>
  </a>
  <a class="nav-card" href="./audio-features">
    <span class="nav-card-icon">🎛️</span>
    <span class="nav-card-title">Audio Features</span>
    <span class="nav-card-desc">DNA sonore des genres · énergie, danceability…</span>
  </a>
</div>

```js
import { yearSlider }            from "./components/yearSlider.js";
import { searchableMultiSelect } from "./components/searchableMultiSelect.js";
import { langPieChart }          from "./components/langPieChart.js";
import { langMeta, getLang, getLangColor, langLabel } from "./utils/langMeta.js";
```

```js
const genreYear = await FileAttachment("data/genre_year.json").json();
const langYear  = await FileAttachment("data/language_year.json").json();
```

```js
const allGenres    = [...new Set(genreYear.map(d => d.genre))].sort();
const allLangCodes = [...new Set(langYear.map(d => d.language_code))].sort();
```

## Filtres

```js
const mainYearRange = view(yearSlider({min: 1970, max: 2025, label: "Période"}));
```

```js
const filters = view(Inputs.form(
  {
    genres: searchableMultiSelect(allGenres, {
      label: "Genres musicaux",
      value: allGenres
    }),
    langs: Inputs.select(allLangCodes, {
      label: "Langues",
      multiple: true,
      size: 10,
      format: c => langLabel[c] ?? c,
      value: allLangCodes
    })
  },
  {
    template: (inputs) => {
      const div = document.createElement("div");
      div.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:0.5rem;";
      for (const inp of Object.values(inputs)) div.appendChild(inp);
      return div;
    }
  }
));
```

```js
const filteredGenreYear = genreYear.filter(d =>
  filters.genres.includes(d.genre) &&
  +d.release_year >= mainYearRange[0] &&
  +d.release_year <= mainYearRange[1]
);
const filteredLangYear = langYear.filter(d =>
  filters.langs.includes(d.language_code) &&
  +d.release_year >= mainYearRange[0] &&
  +d.release_year <= mainYearRange[1]
);
```

```js
// KPI computations
// filteredLangYear: one language per track → no double-counting
const totalTracks = d3.sum(filteredLangYear, d => +d.track_count);

const byGenre      = d3.rollup(filteredGenreYear, v => d3.sum(v, d => +d.track_count), d => d.genre);
const genreEntries = [...byGenre.entries()].sort((a, b) => b[1] - a[1]);
const topGenre     = genreEntries[0] ?? ["-", 0];

const byLang      = d3.rollup(filteredLangYear, v => d3.sum(v, d => +d.track_count), d => d.language_code);
const langEntries = [...byLang.entries()].sort((a, b) => b[1] - a[1]);
const topLang     = langEntries[0] ?? ["-", 0];

const yearRange = d3.extent(filteredGenreYear, d => +d.release_year);
```

<div class="kpi-row">
  <div class="kpi-card">
    <div class="kpi-label">Titres indexés</div>
    <div class="kpi-val">${(totalTracks/1e6).toFixed(1)}M</div>
    <div class="kpi-sub">track_details</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-label">Genre dominant</div>
    <div class="kpi-val" style="font-size:1.2rem">${topGenre[0]}</div>
    <div class="kpi-sub">${(topGenre[1]/1e3).toFixed(0)}k titres</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-label">Langue dominante</div>
    <div class="kpi-val" style="font-size:1.2rem">${langLabel[topLang[0]] ?? topLang[0]}</div>
    <div class="kpi-sub">${(topLang[1]/1e3).toFixed(0)}k titres</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-label">Période couverte</div>
    <div class="kpi-val" style="font-size:1.1rem">${yearRange[0]}–${yearRange[1]}</div>
    <div class="kpi-sub">${yearRange[1]-yearRange[0]+1} ans</div>
  </div>
</div>

## Top 20 genres (toutes années)

```js
const top20 = [...byGenre.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .map(([genre, total]) => ({ genre, total }));

display(Plot.plot({
  marginLeft: 150,
  marginRight: 10,
  width,
  height: 480,
  x: { label: "Nombre de titres", tickFormat: "s" },
  y: { label: null },
  marks: [
    Plot.barX(top20, {
      x: "total",
      y: "genre",
      sort: { y: "-x" },
      fill: "#1DB954",
      tip: true,
      title: d => `${d.genre}\n${d.total.toLocaleString()} titres`
    }),
    Plot.ruleX([0])
  ]
}));
```

*Encoding note (rough): data item = one genre with its total number of tracks over all years. Mark used = horizontal bar, chosen because bars are the clearest mark for comparing magnitudes across categories. Visual variables: y-position maps genre category, x-length maps number of tracks, and a single green color is used only for grouping this chart as one series.*

## Évolution des genres (1970 – 2025)

```js
const genreLangYear = await FileAttachment("data/genre_language_year.json").json();
```

```js
const allGenresEvo    = [...new Set(genreLangYear.map(d => d.genre))].sort();
const defaultGenresEvo = [...d3.rollup(genreLangYear, v => d3.sum(v, d => +d.track_count), d => d.genre)]
  .sort((a, b) => b[1] - a[1]).slice(0, 12).map(d => d[0]);

const topLangsEvo = [...d3.rollup(genreLangYear, v => d3.sum(v, d => +d.track_count), d => d.language_code).entries()]
  .sort((a, b) => b[1] - a[1]).slice(0, 10).map(d => d[0]);
```

```js
const selectedLangs = Mutable([...topLangsEvo]);
const toggleLang = (lang) => {
  const cur = selectedLangs.value;
  selectedLangs.value = cur.includes(lang)
    ? (cur.length > 1 ? cur.filter(l => l !== lang) : cur)
    : [...cur, lang];
};
```

<p style="font-size:0.85rem;color:var(--theme-foreground-muted);margin:0 0 1rem;">Sélectionnez les genres à afficher. Cliquez sur les segments du disque pour filtrer par langue.</p>

<div style="display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start;">

```js
const evoGenreFilter = view(searchableMultiSelect(allGenresEvo, {
  label: "Genres",
  value: defaultGenresEvo
}));
```

```js
const langPieData = topLangsEvo.map(code => {
  const total = genreLangYear
    .filter(d => d.language_code === code && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1])
    .reduce((s, d) => s + (+d.track_count), 0);
  return { lang: code, label: getLang(code), count: total, color: getLangColor(code) };
}).filter(d => d.count > 0);

const pieTotal = langPieData.reduce((s, d) => s + d.count, 0);
display(langPieChart(langPieData, pieTotal, selectedLangs, toggleLang));
```

</div>

```js
const evoData = d3.rollups(
  genreLangYear.filter(d =>
    evoGenreFilter.includes(d.genre) &&
    selectedLangs.includes(d.language_code) &&
    +d.release_year >= evoYearRange[0] &&
    +d.release_year <= evoYearRange[1]
  ),
  v => d3.sum(v, d => +d.track_count),
  d => d.genre,
  d => +d.release_year
).flatMap(([genre, years]) => years.map(([year, count]) => ({ genre, release_year: year, track_count: count })));

const evoGenreOrder = [...d3.rollup(evoData, v => d3.sum(v, d => d.track_count), d => d.genre)]
  .sort((a, b) => b[1] - a[1]).map(d => d[0]);

const palette12 = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
                   "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b"];
const extPalette = d3.quantize(d3.interpolateRainbow, Math.max(evoGenreOrder.length, 1));
const evoColors  = evoGenreOrder.map((g, i) => i < palette12.length ? palette12[i] : extPalette[i]);

display(Plot.plot({
  width,
  height: 380,
  marginLeft: 55,
  marginBottom: 40,
  y: { label: "Titres", grid: true, tickFormat: "s" },
  color: { domain: evoGenreOrder, range: evoColors, legend: true, columns: 4 },
  marks: [
    Plot.areaY(evoData, {
      x: "release_year",
      y: "track_count",
      fill: "genre",
      order: evoGenreOrder,
      curve: "monotone-x",
      tip: true,
      title: d => `${d.genre} · ${d.release_year}\n${d.track_count.toLocaleString()} titres`
    }),
    Plot.ruleY([0])
  ]
}));
```

```js
const evoYearRange = view(yearSlider({min: 1970, max: 2025, label: "Période"}));
```

*Encoding note (rough): data item = one genre-year pair (aggregated across selected languages). Mark used = stacked area, chosen to show continuous change over time while also showing part-to-whole composition at each year. Visual variables: x-position maps year, y-height/area maps track count, and color hue maps genre identity.*
