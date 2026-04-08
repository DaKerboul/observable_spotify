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
const divideBy = view(Inputs.radio(
  new Map([["—", null], ["Langue", "language_code"], ["Genre", "genre"]]),
  { value: null, label: "Diviser par" }
));
```

```js
{
  const palette12 = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
                     "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b"];

  const rawEvoData = genreLangYear.filter(d =>
    evoGenreFilter.includes(d.genre) &&
    selectedLangs.includes(d.language_code) &&
    +d.release_year >= evoYearRange[0] &&
    +d.release_year <= evoYearRange[1]
  );

  if (!divideBy) {
    // ── Aggregated stacked area ──────────────────────────────────────────────
    const evoData = d3.rollups(rawEvoData,
      v => d3.sum(v, d => +d.track_count),
      d => d.genre, d => +d.release_year
    ).flatMap(([genre, years]) => years.map(([year, count]) => ({ genre, release_year: year, track_count: count })));

    const evoGenreOrder = [...d3.rollup(evoData, v => d3.sum(v, d => d.track_count), d => d.genre)]
      .sort((a, b) => b[1] - a[1]).map(d => d[0]);
    const extPalette = d3.quantize(d3.interpolateRainbow, Math.max(evoGenreOrder.length, 1));
    const evoColors  = evoGenreOrder.map((g, i) => i < palette12.length ? palette12[i] : extPalette[i]);

    display(Plot.plot({
      width, height: 380, marginLeft: 55, marginBottom: 40,
      y: { label: "Titres", grid: true, tickFormat: "s" },
      color: { domain: evoGenreOrder, range: evoColors, legend: true, columns: 4 },
      marks: [
        Plot.areaY(evoData, {
          x: "release_year", y: "track_count", fill: "genre",
          order: evoGenreOrder, curve: "monotone-x", tip: true,
          title: d => `${d.genre} · ${d.release_year}\n${d.track_count.toLocaleString()} titres`
        }),
        Plot.ruleY([0])
      ]
    }));

  } else if (divideBy === "language_code") {
    // ── Small multiples par langue ───────────────────────────────────────────
    const data = d3.rollups(rawEvoData,
      v => d3.sum(v, d => +d.track_count),
      d => d.language_code, d => d.genre, d => +d.release_year
    ).flatMap(([lang, genres]) => genres.flatMap(([genre, years]) =>
      years.map(([year, count]) => ({ language_code: getLang(lang), genre, release_year: year, track_count: count }))
    ));

    const evoGenreOrder = [...d3.rollup(data, v => d3.sum(v, d => d.track_count), d => d.genre)]
      .sort((a, b) => b[1] - a[1]).map(d => d[0]);
    const extPalette = d3.quantize(d3.interpolateRainbow, Math.max(evoGenreOrder.length, 1));
    const evoColors  = evoGenreOrder.map((g, i) => i < palette12.length ? palette12[i] : extPalette[i]);
    const langOrder  = selectedLangs.map(getLang);

    display(Plot.plot({
      width, height: selectedLangs.length * 110 + 60,
      marginLeft: 55, marginBottom: 30,
      fy: { label: null, domain: langOrder, padding: 0.12 },
      y: { label: "Titres", grid: true, tickFormat: "s" },
      color: { domain: evoGenreOrder, range: evoColors, legend: true, columns: 4 },
      marks: [
        Plot.areaY(data, {
          fy: "language_code",
          x: "release_year", y: "track_count", fill: "genre",
          order: evoGenreOrder, curve: "monotone-x", tip: true,
          title: d => `${d.genre} · ${d.release_year}\n${d.track_count.toLocaleString()} titres`
        }),
        Plot.ruleY([0])
      ]
    }));

  } else {
    // ── Small multiples par genre ────────────────────────────────────────────
    const data = d3.rollups(rawEvoData,
      v => d3.sum(v, d => +d.track_count),
      d => d.genre, d => d.language_code, d => +d.release_year
    ).flatMap(([genre, langs]) => langs.flatMap(([lang, years]) =>
      years.map(([year, count]) => ({ genre, language_code: lang, release_year: year, track_count: count }))
    ));

    const genreOrder  = [...d3.rollup(data, v => d3.sum(v, d => d.track_count), d => d.genre)]
      .sort((a, b) => b[1] - a[1]).map(d => d[0]);
    const langColors  = selectedLangs.map(c => getLangColor(c));

    display(Plot.plot({
      width, height: genreOrder.length * 110 + 60,
      marginLeft: 55, marginBottom: 30,
      fy: { label: null, domain: genreOrder, padding: 0.12 },
      y: { label: "Titres", grid: true, tickFormat: "s" },
      color: { domain: selectedLangs, range: langColors, legend: true, columns: 4,
               tickFormat: c => getLang(c) },
      marks: [
        Plot.areaY(data, {
          fy: "genre",
          x: "release_year", y: "track_count", fill: "language_code",
          order: selectedLangs, curve: "monotone-x", tip: true,
          title: d => `${getLang(d.language_code)} · ${d.release_year}\n${d.track_count.toLocaleString()} titres`
        }),
        Plot.ruleY([0])
      ]
    }));
  }
}
```

```js
const evoYearRange = view(yearSlider({min: 1970, max: 2025, label: "Période"}));
```

*Encoding note (rough): data item = one genre-year pair (aggregated across selected languages). Mark used = stacked area, chosen to show continuous change over time while also showing part-to-whole composition at each year. Visual variables: x-position maps year, y-height/area maps track count, and color hue maps genre identity.*
