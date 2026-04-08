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
const genreYear = await FileAttachment("data/genre_year.json").json();
const langYear  = await FileAttachment("data/language_year.json").json();
```

```js
const allGenres   = [...new Set(genreYear.map(d => d.genre))].sort();
const allLangCodes = [...new Set(langYear.map(d => d.language_code))].sort();
const langLabel = {en:"Anglais",fr:"Français",es:"Espagnol",de:"Allemand",pt:"Portugais",
  it:"Italien",ja:"Japonais",ko:"Coréen",ar:"Arabe",ru:"Russe",tr:"Turc",nl:"Néerlandais",
  pl:"Polonais",sv:"Suédois",hi:"Hindi"};
```

```js
// Reusable searchable multi-select with checkboxes
function searchableMultiSelect(items, {label = "", format = d => d, value = items} = {}) {
  const selected = new Set(value);
  const wrapper = document.createElement("fieldset");
  wrapper.style.cssText = "border:1px solid var(--theme-foreground-faintest);border-radius:8px;padding:8px 12px;margin:0;";

  const leg = document.createElement("legend");
  leg.textContent = label;
  leg.style.cssText = "font-weight:700;font-size:0.85rem;padding:0 4px;";
  wrapper.appendChild(leg);

  const search = document.createElement("input");
  search.type = "text";
  search.placeholder = "Rechercher…";
  search.style.cssText = "width:100%;padding:6px 8px;margin-bottom:6px;border:1px solid var(--theme-foreground-faintest);border-radius:6px;font-size:0.85rem;background:var(--theme-background);color:var(--theme-foreground);box-sizing:border-box;";
  wrapper.appendChild(search);

  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:8px;margin-bottom:6px;";
  const btnStyle = "font-size:0.75rem;padding:2px 8px;cursor:pointer;border:1px solid var(--theme-foreground-faintest);border-radius:4px;background:var(--theme-background-alt);color:var(--theme-foreground);";
  const btnAll = Object.assign(document.createElement("button"), {textContent: "Tout sélectionner"});
  btnAll.style.cssText = btnStyle;
  const btnNone = Object.assign(document.createElement("button"), {textContent: "Tout désélectionner"});
  btnNone.style.cssText = btnStyle;
  btnRow.append(btnAll, btnNone);
  wrapper.appendChild(btnRow);

  const list = document.createElement("div");
  list.style.cssText = "max-height:200px;overflow-y:auto;";

  const checkboxes = items.map(item => {
    const lbl = document.createElement("label");
    lbl.style.cssText = "display:flex;align-items:center;gap:6px;padding:2px 0;font-size:0.82rem;cursor:pointer;";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = selected.has(item);
    lbl.appendChild(cb);
    lbl.appendChild(document.createTextNode(format(item)));
    lbl.dataset.text = format(item).toLowerCase();
    list.appendChild(lbl);
    return {label: lbl, checkbox: cb, item};
  });
  wrapper.appendChild(list);

  function emit() {
    selected.clear();
    for (const {checkbox, item} of checkboxes) if (checkbox.checked) selected.add(item);
    wrapper.value = [...selected];
    wrapper.dispatchEvent(new Event("input", {bubbles: true}));
  }

  search.addEventListener("input", () => {
    const q = search.value.toLowerCase();
    for (const {label} of checkboxes) label.style.display = label.dataset.text.includes(q) ? "" : "none";
  });
  for (const {checkbox} of checkboxes) checkbox.addEventListener("change", emit);
  btnAll.addEventListener("click", () => { const q = search.value.toLowerCase(); for (const {label, checkbox} of checkboxes) if (!q || label.dataset.text.includes(q)) checkbox.checked = true; emit(); });
  btnNone.addEventListener("click", () => { const q = search.value.toLowerCase(); for (const {label, checkbox} of checkboxes) if (!q || label.dataset.text.includes(q)) checkbox.checked = false; emit(); });

  wrapper.value = [...selected];
  return wrapper;
}
```

## Filtres

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
const filteredGenreYear = genreYear.filter(d => filters.genres.includes(d.genre));
const filteredLangYear  = langYear.filter(d => filters.langs.includes(d.language_code));
```

```js
// KPI computations
// Use filteredLangYear for total tracks (one language per track = no double-counting)
const totalTracks = d3.sum(filteredLangYear, d => +d.track_count);

const byGenre = d3.rollup(filteredGenreYear, v => d3.sum(v, d => +d.track_count), d => d.genre);
const genreEntries = [...byGenre.entries()].sort((a,b) => b[1]-a[1]);
const topGenre = genreEntries[0] ?? ["-", 0];

const byLang = d3.rollup(filteredLangYear, v => d3.sum(v, d => +d.track_count), d => d.language_code);
const langEntries = [...byLang.entries()].sort((a,b) => b[1]-a[1]);
const topLang = langEntries[0] ?? ["-", 0];

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
  .sort((a,b) => b[1]-a[1])
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
const allGenresEvo   = [...new Set(genreLangYear.map(d => d.genre))].sort();
const allLangsEvo    = [...new Set(genreLangYear.map(d => d.language_code))].sort();
const defaultGenresEvo = [...d3.rollup(genreLangYear, v => d3.sum(v, d => +d.track_count), d => d.genre)]
  .sort((a,b) => b[1]-a[1]).slice(0, 12).map(d => d[0]);
```

<p style="font-size:0.85rem;color:var(--theme-foreground-muted);margin:0 0 1rem;">Sélectionnez les genres et langues à afficher dans le graphique d'évolution. Par défaut : top 12 genres, toutes les langues.</p>

```js
const evoFilters = view(Inputs.form(
  {
    genres: searchableMultiSelect(allGenresEvo, {
      label: "Genres",
      value: defaultGenresEvo
    }),
    langs: Inputs.select(allLangsEvo, {
      label: "Langues",
      multiple: true,
      size: 10,
      format: c => langLabel[c] ?? c,
      value: allLangsEvo
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
// Aggregate: sum track_count by genre+year after filtering on selected genres & languages
const evoData = d3.rollups(
  genreLangYear.filter(d => evoFilters.genres.includes(d.genre) && evoFilters.langs.includes(d.language_code)),
  v => d3.sum(v, d => +d.track_count),
  d => d.genre,
  d => +d.release_year
).flatMap(([genre, years]) => years.map(([year, count]) => ({ genre, release_year: year, track_count: count })));

const evoGenreOrder = [...d3.rollup(evoData, v => d3.sum(v, d => d.track_count), d => d.genre)]
  .sort((a,b) => b[1]-a[1]).map(d => d[0]);

const palette12 = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
                   "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b"];
const extPalette = d3.quantize(d3.interpolateRainbow, Math.max(evoGenreOrder.length, 1));
const evoColors = evoGenreOrder.map((g,i) => i < palette12.length ? palette12[i] : extPalette[i]);

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

*Encoding note (rough): data item = one genre-year pair (aggregated across selected languages). Mark used = stacked area, chosen to show continuous change over time while also showing part-to-whole composition at each year. Visual variables: x-position maps year, y-height/area maps track count, and color hue maps genre identity.*
