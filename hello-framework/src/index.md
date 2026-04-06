---
toc: false
---

<div class="hero">
  <h1>Spotify Analytics</h1>
  <h2>9,8 millions de titres · 4 tables · données Anna's Archive 2025</h2>
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
  margin: 0;
  max-width: 34em;
  font-size: 1rem;
  font-weight: 500;
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
    <span class="nav-card-desc">Volume, popularité, durée par langue</span>
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
// KPI computations
// Use langYear for total tracks (one language per track = no double-counting)
const totalTracks = d3.sum(langYear, d => +d.track_count);

const byGenre = d3.rollup(genreYear, v => d3.sum(v, d => +d.track_count), d => d.genre);
const genreEntries = [...byGenre.entries()].sort((a,b) => b[1]-a[1]);
const topGenre = genreEntries[0] ?? ["—", 0];

const byLang = d3.rollup(langYear, v => d3.sum(v, d => +d.track_count), d => d.language_code);
const langEntries = [...byLang.entries()].sort((a,b) => b[1]-a[1]);
const topLang = langEntries[0] ?? ["—", 0];

const yearRange = d3.extent(genreYear, d => +d.release_year);

const langLabel = {en:"Anglais",fr:"Français",es:"Espagnol",de:"Allemand",pt:"Portugais",
  it:"Italien",ja:"Japonais",ko:"Coréen",ar:"Arabe",ru:"Russe",tr:"Turc",nl:"Néerlandais",
  pl:"Polonais",sv:"Suédois",hi:"Hindi"};
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

## Évolution des top 12 genres (1970 – 2025)

```js
const top12genres = [...byGenre.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12).map(d=>d[0]);
const filteredGY = genreYear.filter(d => top12genres.includes(d.genre) && +d.release_year >= 1970);

const palette12 = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
                   "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b"];
const genreColor = Object.fromEntries(top12genres.map((g,i) => [g, palette12[i]]));

display(Plot.plot({
  width,
  height: 340,
  marginLeft: 55,
  marginBottom: 40,
  y: { label: "Titres", grid: true, tickFormat: "s" },
  color: { domain: top12genres, range: top12genres.map(g=>genreColor[g]), legend: true, columns: 4 },
  marks: [
    Plot.areaY(filteredGY, {
      x: d => +d.release_year,
      y: d => +d.track_count,
      fill: "genre",
      order: top12genres,
      curve: "monotone-x",
      tip: true,
      title: d => `${d.genre} · ${d.release_year}\n${Number(d.track_count).toLocaleString()} titres`
    }),
    Plot.ruleY([0])
  ]
}));
```

## Popularité moyenne par langue (1970–2025)

```js
const topLangs = [...byLang.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8).map(d=>d[0]);
const langColors = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c","#16a085","#d35400"];
const lc = Object.fromEntries(topLangs.map((l,i)=>[l,langColors[i]]));

const lyFiltered = langYear.filter(d => topLangs.includes(d.language_code) && +d.release_year >= 1970);

display(Plot.plot({
  width,
  height: 260,
  marginLeft: 55,
  marginBottom: 40,
  y: { label: "Popularité moy.", grid: true },
  color: {
    domain: topLangs,
    range: topLangs.map(l=>lc[l]),
    legend: true,
    tickFormat: l => langLabel[l] ?? l.toUpperCase()
  },
  marks: [
    Plot.line(lyFiltered, {
      x: d => +d.release_year,
      y: d => +d.avg_track_popularity,
      stroke: "language_code",
      curve: "monotone-x",
      strokeWidth: 2,
      tip: true,
      title: d => `${langLabel[d.language_code]??d.language_code} · ${d.release_year}\nPopularité: ${(+d.avg_track_popularity).toFixed(1)}`
    })
  ]
}));
```
