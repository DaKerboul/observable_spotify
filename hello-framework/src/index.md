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

/* ── evoMode styled tab selector ─────────────────────────────────────────── */
.evo-mode-tabs { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.emt-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--theme-foreground-muted); white-space: nowrap; }
.emt-group { display: flex; gap: 4px; flex-wrap: wrap; }
.emt-btn {
  padding: 5px 15px; border-radius: 8px;
  border: 1.5px solid var(--theme-foreground-faint, #ddd);
  background: var(--theme-background-alt);
  color: var(--theme-foreground-muted);
  font-size: 0.8rem; font-weight: 600; font-family: var(--sans-serif);
  cursor: pointer; transition: all .12s; line-height: 1.4;
}
.emt-btn:hover:not(.active) { border-color: #1DB95488; color: var(--theme-foreground); }
.emt-btn.active { background: #1DB954; border-color: #1DB954; color: #fff; }

/* ── Genre chip filter (above disc) ─────────────────────────────────────── */
.genre-chip-filter { margin-bottom: 8px; }
.gcf-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.gcf-label-text { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--theme-foreground-muted); }
.gcf-all-btn { font-size: 9px; font-weight: 600; background: none; border: none; cursor: pointer; color: var(--theme-foreground-muted); padding: 0; text-decoration: underline; font-family: var(--sans-serif); }
.gcf-chips { display: flex; flex-wrap: wrap; gap: 3px; }
.gcf-chip {
  padding: 2px 8px; border-radius: 999px;
  border: 1.5px solid var(--theme-foreground-faint, #ddd);
  background: var(--theme-background-alt);
  color: var(--theme-foreground-muted);
  font-size: 0.7rem; font-weight: 600; font-family: var(--sans-serif);
  cursor: pointer; transition: all .12s;
}
.gcf-chip.active { background: #1DB954; border-color: #1DB954; color: #fff; }
.gcf-chip:hover:not(.active) { border-color: #1DB95488; color: var(--theme-foreground); }
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
const audioFeatLangYear = await FileAttachment("data/audio_features_lang_year.json").json();
const audioFeatGenreYear = await FileAttachment("data/audio_features_genre_year.json").json();
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
  if (cur.includes(lang)) {
    if (cur.length > 1) selectedLangs.value = cur.filter(l => l !== lang);
  } else {
    selectedLangs.value = [...cur, lang];
  }
};
```

```js
// Right-column disc mode: "langues" = language disc, "genres" = genre selector
const discMode = Mutable("langues");
const setDiscMode = (m) => { discMode.value = m; };
```

<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start;margin-bottom:1.5rem;">
<div>

```js
{
  const p = document.createElement("p");
  p.style.cssText = "font-size:0.85rem;color:var(--theme-foreground-muted);margin:0 0 1rem;";
  p.textContent = discMode === "langues"
    ? "Sélectionnez les genres à afficher. Utilisez le filtre Genre (→) pour voir leur répartition par langue."
    : "Choisissez les genres à droite. Sélectionnez 'Langue' ci-dessous pour faire apparaître le disque des langues ici.";
  display(p);
}
```

```js
const evoMode = (() => {
  let current = "genres";
  const wrap = document.createElement("div");
  wrap.className = "evo-mode-tabs";
  const lbl = document.createElement("span");
  lbl.className = "emt-label";
  lbl.textContent = "Analyser par";
  const grp = document.createElement("div");
  grp.className = "emt-group";
  const tabs = discMode === "genres"
    ? [["langue","Langue"],["tempo","Tempo (BPM)"],["durée","Durée"]]
    : [["genres","Genres"],["tempo","Tempo (BPM)"],["durée","Durée"]];
  tabs.forEach(([value, label]) => {
    const btn = document.createElement("button");
    btn.className = "emt-btn" + (value === current ? " active" : "");
    btn.textContent = label;
    btn.type = "button";
    btn.onclick = () => {
      current = value;
      grp.querySelectorAll(".emt-btn").forEach(b => b.classList.toggle("active", b === btn));
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
const leftGenreFilter = (() => {
  const el = searchableMultiSelect(allGenresEvo, {label: "Genres", value: defaultGenresEvo});
  el.style.display = (evoMode === "genres" && discMode === "langues") ? "" : "none";
  display(el);
  return Generators.input(el);
})();
```

```js
const divideBy = (() => {
  let opts;
  if (discMode === "genres" && (evoMode === "tempo" || evoMode === "durée")) {
    opts = new Map([["—", null], ["Genre", "genre"]]);
  } else if (discMode === "langues") {
    opts = new Map([["—", null], ["Langue", "language_code"], ["Genre", "genre"]]);
  } else {
    opts = new Map([["—", null], ["Langue", "language_code"]]);
  }
  const el = Inputs.radio(opts, { value: null, label: "Diviser par" });
  el.style.display = (evoMode === "genres" || evoMode === "langue" || evoMode === "tempo" || evoMode === "durée") ? "" : "none";
  display(el);
  return Generators.input(el);
})();
```

```js
{
  const container = document.createElement("div");
  if (discMode === "genres" && evoMode === "langue")
    container.append(langPieChart(langPieData, pieTotal, selectedLangs, toggleLang));
  display(container);
}
```

</div>
<div>

```js
// Right column: "Sélectionner par" toggle — Langues / Genres
{
  const wrap = document.createElement("div");
  wrap.className = "evo-mode-tabs";
  wrap.style.marginBottom = "12px";
  const lbl = document.createElement("span");
  lbl.className = "emt-label";
  lbl.textContent = "Sélectionner par";
  const grp = document.createElement("div");
  grp.className = "emt-group";
  [["langues","Langues"],["genres","Genres"]].forEach(([value, label]) => {
    const btn = document.createElement("button");
    btn.className = "emt-btn" + (value === discMode ? " active" : "");
    btn.textContent = label;
    btn.type = "button";
    btn.onclick = () => {
      grp.querySelectorAll(".emt-btn").forEach(b => b.classList.toggle("active", b === btn));
      setDiscMode(value);
    };
    grp.appendChild(btn);
  });
  wrap.append(lbl, grp);
  display(wrap);
}
```

```js
// Right genre selector — shown when discMode === "genres"
const rightGenreFilter = (() => {
  const el = searchableMultiSelect(allGenresEvo, {label: "Genres", value: defaultGenresEvo});
  el.style.display = discMode === "genres" ? "" : "none";
  display(el);
  return Generators.input(el);
})();
```

```js
// Compute pie data — in Genres mode filter by right selector, in Langues mode show all genres
const genreFilterForDisc = discMode === "langues" ? [] : rightGenreFilter;
const langPieData = topLangsEvo.map(code => {
  const total = genreLangYear
    .filter(d => d.language_code === code
      && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1]
      && (genreFilterForDisc.length === 0 || genreFilterForDisc.includes(d.genre)))
    .reduce((s, d) => s + (+d.track_count), 0);
  return {lang: code, label: getLang(code), count: total, color: getLangColor(code)};
}).filter(d => d.count > 0);
const pieTotal = langPieData.reduce((s, d) => s + d.count, 0);
```

```js
{
  const container = document.createElement("div");
  if (discMode === "langues")
    container.append(langPieChart(langPieData, pieTotal, selectedLangs, toggleLang));
  display(container);
}
```

</div>
</div>

```js
const activeGenreFilter = discMode === "langues" ? leftGenreFilter : rightGenreFilter;
```

```js
// === Mode GENRES / LANGUE ===
const evoData_genres = (evoMode !== "genres" && evoMode !== "langue") ? [] : d3.rollups(
  genreLangYear.filter(d => activeGenreFilter.includes(d.genre) && selectedLangs.includes(d.language_code) && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1]),
  v => d3.sum(v, d => +d.track_count),
  d => d.genre,
  d => +d.release_year
).flatMap(([genre, years]) => years.map(([year, count]) => ({ genre, release_year: year, track_count: count })));

// === Mode TEMPO ===
// By language (discMode=langues) or by genre (discMode=genres)
const evoData_tempo = evoMode !== "tempo" ? [] :
  discMode === "genres"
    ? audioFeatGenreYear
        .filter(d => activeGenreFilter.includes(d.genre) && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1])
        .map(d => ({ key: d.genre, release_year: +d.release_year, value: +d.tempo }))
    : audioFeatLangYear
        .filter(d => selectedLangs.includes(d.language_code) && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1])
        .map(d => ({ key: d.language_code, label: getLang(d.language_code), release_year: +d.release_year, value: +d.tempo }));

// === Mode DURÉE ===
// By language (discMode=langues) or by genre (discMode=genres)
const evoData_duree = evoMode !== "durée" ? [] :
  discMode === "genres"
    ? audioFeatGenreYear
        .filter(d => activeGenreFilter.includes(d.genre) && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1])
        .map(d => ({ key: d.genre, release_year: +d.release_year, value: +d.avg_duration_min }))
    : [...d3.rollup(
        genreLangYear.filter(d => selectedLangs.includes(d.language_code) && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1]),
        v => d3.mean(v, d => +d.avg_duration_ms) / 60000,
        d => d.language_code,
        d => +d.release_year
      )].flatMap(([lang, years]) => [...years].map(([year, val]) => ({ key: lang, label: getLang(lang), release_year: year, value: val })));

{
  const palette12 = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
                     "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b"];

  if (evoMode === "genres" || evoMode === "langue") {
    const rawEvoData = genreLangYear.filter(d =>
      activeGenreFilter.includes(d.genre) &&
      selectedLangs.includes(d.language_code) &&
      +d.release_year >= evoYearRange[0] &&
      +d.release_year <= evoYearRange[1]
    );

    if (!divideBy) {
      // ── Aggregated stacked area ──────────────────────────────────────────
      const evoData = d3.rollups(rawEvoData,
        v => d3.sum(v, d => +d.track_count),
        d => d.genre, d => +d.release_year
      ).flatMap(([genre, years]) => years.map(([year, count]) => ({ genre, release_year: year, track_count: count })));

      const evoGenreOrder = [...d3.rollup(evoData, v => d3.sum(v, d => d.track_count), d => d.genre)]
        .sort((a, b) => b[1]-a[1]).map(d => d[0]);
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
      // ── Small multiples par langue ───────────────────────────────────────
      const data = d3.rollups(rawEvoData,
        v => d3.sum(v, d => +d.track_count),
        d => d.language_code, d => d.genre, d => +d.release_year
      ).flatMap(([lang, genres]) => genres.flatMap(([genre, years]) =>
        years.map(([year, count]) => ({ language_code: getLang(lang), genre, release_year: year, track_count: count }))
      ));

      const evoGenreOrder = [...d3.rollup(data, v => d3.sum(v, d => d.track_count), d => d.genre)]
        .sort((a, b) => b[1]-a[1]).map(d => d[0]);
      const extPalette = d3.quantize(d3.interpolateRainbow, Math.max(evoGenreOrder.length, 1));
      const evoColors  = evoGenreOrder.map((g, i) => i < palette12.length ? palette12[i] : extPalette[i]);
      const langOrder  = selectedLangs.map(getLang);
      display(Plot.plot({
        width, height: selectedLangs.length * 110 + 60,
        marginLeft: 55, marginRight: 120, marginBottom: 30,
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
      // ── Small multiples par genre ────────────────────────────────────────
      const data = d3.rollups(rawEvoData,
        v => d3.sum(v, d => +d.track_count),
        d => d.genre, d => d.language_code, d => +d.release_year
      ).flatMap(([genre, langs]) => langs.flatMap(([lang, years]) =>
        years.map(([year, count]) => ({ genre, language_code: lang, release_year: year, track_count: count }))
      ));

      const genreOrder = [...d3.rollup(data, v => d3.sum(v, d => d.track_count), d => d.genre)]
        .sort((a, b) => b[1]-a[1]).map(d => d[0]);
      const langColors = selectedLangs.map(c => getLangColor(c));
      display(Plot.plot({
        width, height: genreOrder.length * 110 + 60,
        marginLeft: 55, marginRight: 160, marginBottom: 30,
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

  } else {
    // Tempo or Durée
    const data = evoMode === "tempo" ? evoData_tempo : evoData_duree;
    const yLabel = evoMode === "tempo" ? "BPM moyen" : "Durée (min)";
    const unitLabel = evoMode === "tempo" ? "BPM" : "min";
    const precision = evoMode === "tempo" ? 1 : 2;

    if (discMode === "genres") {
      // Keys are genre names
      const genreKeys = [...new Set(data.map(d => d.key))].sort();
      const extPal = d3.quantize(d3.interpolateRainbow, Math.max(genreKeys.length, 2));
      const palette12 = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
                         "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b"];
      const gColors = genreKeys.map((g, i) => i < palette12.length ? palette12[i] : extPal[i]);

      if (divideBy === "genre") {
        // Small multiples par genre
        display(Plot.plot({
          width, height: genreKeys.length * 110 + 60,
          marginLeft: 55, marginRight: 140, marginBottom: 30,
          fy: { label: null, domain: genreKeys, padding: 0.12 },
          y: { label: yLabel, grid: true },
          color: { domain: genreKeys, range: gColors, legend: true, columns: 4 },
          marks: [
            Plot.lineY(data, {
              fy: "key", x: "release_year", y: "value", stroke: "key",
              curve: "monotone-x", tip: true,
              title: d => `${d.key} · ${d.release_year}\n${(+d.value).toFixed(precision)} ${unitLabel}`
            }),
            Plot.ruleY([0])
          ]
        }));
      } else {
        // Toutes les lignes genre superposées
        display(Plot.plot({
          width, height: 380, marginLeft: 55, marginBottom: 40,
          y: { label: yLabel, grid: true },
          color: { domain: genreKeys, range: gColors, legend: true, columns: 4 },
          marks: [
            Plot.lineY(data, {
              x: "release_year", y: "value", stroke: "key",
              curve: "monotone-x", tip: true,
              title: d => `${d.key} · ${d.release_year}\n${(+d.value).toFixed(precision)} ${unitLabel}`
            }),
            Plot.ruleY([0])
          ]
        }));
      }
    } else {
      // Keys are language codes
      const langOrder = topLangsEvo.filter(l => selectedLangs.includes(l));
      const langColors = langOrder.map(l => getLangColor(l));
      display(Plot.plot({
        width, height: 380, marginLeft: 55, marginBottom: 40,
        y: { label: yLabel, grid: true },
        color: { domain: langOrder, range: langColors, tickFormat: c => getLang(c) },
        marks: [
          Plot.lineY(data, {
            x: "release_year", y: "value", stroke: "key",
            curve: "monotone-x", tip: true,
            title: d => `${getLang(d.key)} · ${d.release_year}\n${(+d.value).toFixed(precision)} ${unitLabel}`
          }),
          Plot.ruleY([0])
        ]
      }));
    }
  }
}
```

```js
const evoYearRange = view(yearSlider({min: 1970, max: 2025, label: "Période"}));
```

*Encoding note (rough): data item = one genre-year pair (aggregated across selected languages). Mark used = stacked area, chosen to show continuous change over time while also showing part-to-whole composition at each year. Visual variables: x-position maps year, y-height/area maps track count, and color hue maps genre identity.*