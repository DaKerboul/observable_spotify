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
