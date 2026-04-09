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

/* ── Popup analyse approfondie ─────────────────────────────────────────── */
.audio-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.52);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn .15s ease;
}
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
.audio-modal {
  background: var(--theme-background);
  border-radius: 16px; padding: 28px 28px 20px;
  width: min(92vw, 820px); max-height: 88vh; overflow: auto;
  box-shadow: 0 12px 48px rgba(0,0,0,0.4);
  position: relative;
}
.audio-modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.audio-modal-title { font-weight: 800; font-size: 1.08rem; margin: 0; font-family: var(--sans-serif); }
.audio-modal-sub { font-size: 0.78rem; color: var(--theme-foreground-muted); margin-top: 3px; font-family: var(--sans-serif); }
.audio-close-btn {
  background: none; border: none; font-size: 1.5rem; line-height: 1;
  cursor: pointer; color: var(--theme-foreground-muted); padding: 0 4px;
  flex-shrink: 0;
}
.audio-close-btn:hover { color: var(--theme-foreground); }
.audio-body { display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start; }
.audio-metric-list { display: flex; flex-direction: column; gap: 5px; }
.audio-metric-btn {
  text-align: left; padding: 7px 12px; border-radius: 8px;
  border: 1.5px solid var(--theme-foreground-faint, #ddd);
  background: var(--theme-background-alt);
  color: var(--theme-foreground-muted);
  font-size: 0.8rem; font-weight: 600; font-family: var(--sans-serif);
  cursor: pointer; transition: all .12s; line-height: 1.3;
}
.audio-metric-btn:hover:not(.active) { border-color: #1DB95488; color: var(--theme-foreground); }
.audio-metric-btn.active { background: #1DB954; border-color: #1DB954; color: #fff; }
.chart-zoomable { cursor: zoom-in; }

/* ── Storytelling / Visite guidée ─────────────────────────────────────── */
.story-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 8888;
  background: var(--theme-background);
  border-top: 2.5px solid #1DB954;
  box-shadow: 0 -6px 32px rgba(0,0,0,0.18);
  transform: translateY(100%);
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--sans-serif);
}
.story-bar.active { transform: translateY(0); }

.story-bar-inner {
  max-width: 880px; margin: 0 auto;
  padding: 18px 28px 16px;
}
.story-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.story-step-label {
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.09em; color: #1DB954;
}
.story-close {
  background: none; border: none; font-size: 1.3rem; cursor: pointer;
  color: var(--theme-foreground-muted); padding: 0 4px; line-height: 1;
}
.story-close:hover { color: var(--theme-foreground); }

.story-title {
  font-size: 1.2rem; font-weight: 800; margin: 0 0 5px;
  opacity: 0; transform: translateY(10px);
  animation: storySlideIn 0.45s 0.08s ease forwards;
}
.story-text {
  font-size: 0.88rem; line-height: 1.55; margin: 0;
  color: var(--theme-foreground-muted);
  opacity: 0; transform: translateY(10px);
  animation: storySlideIn 0.45s 0.22s ease forwards;
}
.story-text .story-overlay-link {
  color: #1DB954; cursor: pointer; text-decoration: underline;
  font-weight: 600;
}
.story-text .story-overlay-link:hover { color: #17a34a; }

@keyframes storySlideIn {
  to { opacity: 1; transform: translateY(0); }
}

.story-nav {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 14px;
}
.story-dots { display: flex; gap: 8px; align-items: center; }
.story-dot {
  width: 10px; height: 10px; border-radius: 50%; padding: 0;
  border: 2px solid #1DB954; background: transparent;
  cursor: pointer; transition: all 0.2s;
}
.story-dot.active { background: #1DB954; transform: scale(1.25); }
.story-dot:hover:not(.active) { background: #1DB95444; }

.story-nav-btn {
  padding: 6px 18px; border-radius: 8px;
  border: 1.5px solid #1DB954; background: transparent; color: #1DB954;
  font-size: 0.8rem; font-weight: 700; font-family: var(--sans-serif);
  cursor: pointer; transition: all 0.15s;
}
.story-nav-btn:hover { background: #1DB954; color: #fff; }
.story-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.story-nav-btn:disabled:hover { background: transparent; color: #1DB954; }

.story-start-wrap {
  position: fixed; bottom: 24px; right: 24px; z-index: 8887;
}
.story-start-btn {
  padding: 11px 24px; border-radius: 24px;
  background: #1DB954; color: #fff; border: none;
  font-size: 0.86rem; font-weight: 700; font-family: var(--sans-serif);
  cursor: pointer; box-shadow: 0 4px 18px rgba(29,185,84,0.35);
  transition: all 0.2s; display: flex; align-items: center; gap: 8px;
}
.story-start-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(29,185,84,0.5); }
.story-start-btn.hidden { display: none; }
</style>

```js
// ── Imports ──────────────────────────────────────────────────────────────
import { yearSlider }            from "./components/yearSlider.js";
import { searchableMultiSelect } from "./components/searchableMultiSelect.js";
import { langPieChart }          from "./components/langPieChart.js";
import { langMeta, getLang, getLangColor, langLabel } from "./utils/langMeta.js";
import { PRESETS }               from "./components/storyPresets.js";
```

```js
// ── Chargement des données ──────────────────────────────────────────────
const genreLangYear      = await FileAttachment("data/genre_language_year.json").json();
const audioFeatGenreYear = await FileAttachment("data/audio_features_genre_year.json").json();
const audioFeatLangYear  = await FileAttachment("data/audio_features_lang_year.json").json();
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
// Expose getters/setters for the storytelling engine (avoids reactive dependency)
window.__getSelectedLangs = () => selectedLangs.value;
window.__setSelectedLangs = (langs) => { selectedLangs.value = langs; };
window.__getAllLangs = () => [...topLangs];
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
// Expose for the storytelling engine (avoids reactive dependency)
window.__setGenres = (genres) => genreFilterEl.setValue(genres);
window.__getAllGenres = () => [...allGenres];
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
  wrap.id = "ctrl-decoupage";
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
  wrap.id = "ctrl-diviser";
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
    btn.dataset.value = value;
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
  wrap.id = "ctrl-normaliser";
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
// ── Fonction popup "analyse approfondie" ────────────────────────────────
function openAudioPopup({ decoupage, selectedGenres, selectedLangs, evoYearRange }) {
  // Métriques disponibles selon le découpage
  const METRICS_GENRE = [
    { key: "tempo",            label: "Tempo (BPM)",   fmt: v => v.toFixed(1) },
    { key: "avg_duration_min", label: "Durée (min)",   fmt: v => v.toFixed(2) },
  ];
  const METRICS_LANG = [
    { key: "danceability", label: "Dansabilité",   fmt: v => v.toFixed(3) },
    { key: "energy",       label: "Énergie",        fmt: v => v.toFixed(3) },
    { key: "valence",      label: "Valence",        fmt: v => v.toFixed(3) },
    { key: "tempo",        label: "Tempo (BPM)",   fmt: v => v.toFixed(1)  },
    { key: "acousticness", label: "Acoustique",    fmt: v => v.toFixed(3) },
    { key: "loudness",     label: "Volume (dB)",   fmt: v => v.toFixed(1)  },
  ];
  const metrics = decoupage === "langue" ? METRICS_LANG : METRICS_GENRE;
  let activeMetric = metrics[0];

  // ── Overlay + modal ────────────────────────────────────────────────────
  const overlay = document.createElement("div");
  overlay.className = "audio-overlay";

  const modal = document.createElement("div");
  modal.className = "audio-modal";
  modal.addEventListener("click", e => e.stopPropagation());

  // Header
  const header = document.createElement("div");
  header.className = "audio-modal-header";
  const titleWrap = document.createElement("div");
  const title = document.createElement("div");
  title.className = "audio-modal-title";
  title.textContent = "Caractéristiques audio";
  // Résumé complet des filtres actifs – toujours affiché
  const filterRows = [
    ["Période",    `${evoYearRange[0]} – ${evoYearRange[1]}`],
    ["Découpage",  decoupage === "genre" ? "Par genre" : decoupage === "langue" ? "Par langue" : "Aucun"],
    ["Genres",     selectedGenres.join(", ")],
    ["Langues",    selectedLangs.map(getLang).join(", ")],
  ];
  const filterSummary = document.createElement("div");
  filterSummary.style.cssText = "margin-top:8px;display:flex;flex-direction:column;gap:2px;";
  filterRows.forEach(([k, v]) => {
    const row = document.createElement("div");
    row.className = "audio-modal-sub";
    row.style.cssText = "display:flex;gap:6px;";
    const keyEl = document.createElement("span");
    keyEl.style.cssText = "font-weight:700;min-width:70px;flex-shrink:0;";
    keyEl.textContent = k + " :";
    const valEl = document.createElement("span");
    valEl.style.cssText = "color:var(--theme-foreground);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:520px;";
    valEl.title = v;
    valEl.textContent = v;
    row.append(keyEl, valEl);
    filterSummary.appendChild(row);
  });
  titleWrap.append(title, filterSummary);
  const closeBtn = document.createElement("button");
  closeBtn.className = "audio-close-btn";
  closeBtn.textContent = "×";
  closeBtn.onclick = () => overlay.remove();
  header.append(titleWrap, closeBtn);
  modal.appendChild(header);

  // Body = metric list + chart area
  const body = document.createElement("div");
  body.className = "audio-body";

  const metricList = document.createElement("div");
  metricList.className = "audio-metric-list";

  const chartArea = document.createElement("div");

  // ── Construction du graphe ligne ───────────────────────────────────────
  function buildChart() {
    chartArea.innerHTML = "";
    const W = Math.min(window.innerWidth * 0.55, 570);
    const { key, label, fmt } = activeMetric;

    let data, colorDomain, colorRange, strokeField, tickFmt;

    if (decoupage === "genre") {
      data = audioFeatGenreYear
        .filter(d => selectedGenres.includes(d.genre)
          && +d.release_year >= evoYearRange[0]
          && +d.release_year <= evoYearRange[1])
        .map(d => ({ key: d.genre, release_year: +d.release_year, value: +d[key] }));
      const order = genreGlobalOrder.filter(g => selectedGenres.includes(g));
      const ext = d3.quantize(d3.interpolateRainbow, Math.max(order.length, 2));
      colorDomain = order;
      colorRange  = order.map((g, i) => i < palette12.length ? palette12[i] : ext[i]);
      strokeField = "key";
      tickFmt = d => d;
    } else if (decoupage === "langue") {
      data = audioFeatLangYear
        .filter(d => selectedLangs.includes(d.language_code)
          && +d.release_year >= evoYearRange[0]
          && +d.release_year <= evoYearRange[1])
        .map(d => ({ key: d.language_code, release_year: +d.release_year, value: +d[key] }));
      colorDomain = topLangs.filter(l => selectedLangs.includes(l));
      colorRange  = colorDomain.map(l => getLangColor(l));
      strokeField = "key";
      tickFmt = c => getLang(c);
    } else {
      // Aucun découpage : agrégé (moyenne pondérée sur genres sélectionnés)
      data = [...d3.rollup(
        audioFeatGenreYear.filter(d => selectedGenres.includes(d.genre)
          && +d.release_year >= evoYearRange[0]
          && +d.release_year <= evoYearRange[1]),
        v => d3.mean(v, d => +d[key]),
        d => +d.release_year
      )].map(([year, val]) => ({ release_year: year, value: val }))
        .filter(d => isFinite(d.value));  // éliminer les NaN/null qui cassent la ligne
      colorDomain = null;
      strokeField = null;
    }

    // Pour le cas "aucun", trier + Plot.line (pas lineY) pour éviter tout groupement implicite
    const marks = [];
    if (strokeField) {
      marks.push(Plot.lineY(data, {
        x: "release_year", y: "value", stroke: strokeField,
        curve: "monotone-x", tip: true,
        title: d => `${tickFmt(d.key)} · ${d.release_year}\n${fmt(+d.value)} ${label}`
      }));
    } else {
      const sorted = data.slice().sort((a, b) => a.release_year - b.release_year);
      marks.push(Plot.line(sorted, {
        x: "release_year", y: "value",
        stroke: "#1DB954", strokeWidth: 2, curve: "monotone-x"
      }));
      marks.push(Plot.dot(sorted, {
        x: "release_year", y: "value",
        fill: "#1DB954", r: 2, tip: true,
        title: d => `${d.release_year}\n${fmt(+d.value)} ${label}`
      }));
    }
    marks.push(Plot.ruleY([0]));

    const plot = Plot.plot({
      width: W, height: 280, marginLeft: 55, marginBottom: 36,
      y: { label, grid: true },
      ...(colorDomain ? { color: { domain: colorDomain, range: colorRange, legend: true, columns: 3, tickFormat: tickFmt } } : {}),
      marks
    });
    chartArea.appendChild(plot);
  }

  // ── Boutons métriques ──────────────────────────────────────────────────
  metrics.forEach(m => {
    const btn = document.createElement("button");
    btn.className = "audio-metric-btn" + (m === activeMetric ? " active" : "");
    btn.textContent = m.label;
    btn.onclick = () => {
      activeMetric = m;
      metricList.querySelectorAll(".audio-metric-btn").forEach(b => b.classList.toggle("active", b === btn));
      buildChart();
    };
    metricList.appendChild(btn);
  });

  body.append(metricList, chartArea);
  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.onclick = () => overlay.remove();
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", esc); }
  });
  document.body.appendChild(overlay);
  buildChart();
}
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

  // Wrapper cliquable → popup analyse approfondie
  const chartWrap = document.createElement("div");
  chartWrap.className = "chart-zoomable";
  chartWrap.title = "Cliquer pour analyser les caractéristiques audio";
  chartWrap.appendChild(Plot.plot(plotCfg));
  chartWrap.addEventListener("click", () => openAudioPopup({
    decoupage, selectedGenres, selectedLangs, evoYearRange
  }));
  display(chartWrap);
}
```

```js
const yearSliderEl = yearSlider({min: 1970, max: 2025, label: "Période"});
yearSliderEl.id = "ctrl-year-slider";
const evoYearRange = view(yearSliderEl);
```

*Encoding note (rough): data item = one genre-year pair (aggregated across selected languages). Mark used = stacked area, chosen to show continuous change over time while also showing part-to-whole composition at each year. Visual variables: x-position maps year, y-height/area maps track count, and color hue maps genre identity.*

```js
// ── Visite guidée : moteur + UI ─────────────────────────────────────────
{
  // Cleanup previous instance (Observable cell re-execution)
  document.getElementById("story-bar")?.remove();
  document.getElementById("story-start-wrap")?.remove();

  let currentStep = -1;

  // ── Apply a preset config to the controls via DOM ──────────────────────
  function applyPreset(preset) {
    const cfg = preset.config;

    // Genres filter (null = tout sélectionner)
    window.__setGenres?.(cfg.genres ?? window.__getAllGenres?.() ?? []);

    // Langs filter (null = tout sélectionner)
    window.__setSelectedLangs?.(cfg.langs ?? window.__getAllLangs?.() ?? []);

    // Year range
    const slider = document.getElementById("ctrl-year-slider");
    if (slider && slider.setRange) slider.setRange(cfg.yearRange[0], cfg.yearRange[1]);

    // Découpage
    const decBtn = document.querySelector(`#ctrl-decoupage [data-value="${cfg.decoupage}"]`);
    if (decBtn && !decBtn.classList.contains("active")) decBtn.click();

    // Normaliser
    const normWrap = document.getElementById("ctrl-normaliser");
    if (normWrap) {
      const isOn = normWrap.querySelector(".tab-btn.active") !== null;
      if (isOn !== cfg.normaliser) normWrap.querySelector(".tab-btn").click();
    }

    // Diviser par (dépend du découpage, donc petit délai pour laisser le DOM se reconstruire)
    const targetDiv = cfg.diviserPar || "aucun";
    setTimeout(() => {
      const divBtn = document.querySelector(`#ctrl-diviser [data-value="${targetDiv}"]`);
      if (divBtn && !divBtn.classList.contains("active")) divBtn.click();
    }, 80);
  }

  // ── Parse text with {overlay}...{/overlay} links ───────────────────────
  function parseStoryText(raw, preset) {
    const p = document.createElement("p");
    p.className = "story-text";
    const parts = raw.split(/\{overlay\}(.*?)\{\/overlay\}/);
    parts.forEach((part, i) => {
      if (i % 2 === 0) {
        p.appendChild(document.createTextNode(part));
      } else {
        const link = document.createElement("span");
        link.className = "story-overlay-link";
        link.textContent = part;
        link.onclick = () => openAudioPopup({
          decoupage: preset.config.decoupage,
          selectedGenres: genreFilterEl.value,
          selectedLangs: window.__getSelectedLangs?.() || [],
          evoYearRange: preset.config.yearRange
        });
        p.appendChild(link);
      }
    });
    return p;
  }

  // ── Build the story bar ────────────────────────────────────────────────
  const bar = document.createElement("div");
  bar.className = "story-bar";
  bar.id = "story-bar";

  function renderStep(idx) {
    currentStep = idx;
    const preset = PRESETS[idx];

    bar.innerHTML = "";
    const inner = document.createElement("div");
    inner.className = "story-bar-inner";

    // Header
    const header = document.createElement("div");
    header.className = "story-header";
    const stepLabel = document.createElement("span");
    stepLabel.className = "story-step-label";
    stepLabel.textContent = `Étape ${idx + 1} sur ${PRESETS.length}`;
    const closeBtn = document.createElement("button");
    closeBtn.className = "story-close";
    closeBtn.textContent = "✕";
    closeBtn.title = "Quitter la visite";
    closeBtn.onclick = () => closeStory();
    header.append(stepLabel, closeBtn);

    // Title (animated)
    const title = document.createElement("h3");
    title.className = "story-title";
    title.textContent = preset.title;

    // Text (animated, with possible overlay link)
    const text = parseStoryText(preset.text, preset);

    // Navigation
    const nav = document.createElement("div");
    nav.className = "story-nav";

    const prevBtn = document.createElement("button");
    prevBtn.className = "story-nav-btn";
    prevBtn.textContent = "← Précédent";
    prevBtn.disabled = idx === 0;
    prevBtn.onclick = () => goToStep(idx - 1);

    const dots = document.createElement("div");
    dots.className = "story-dots";
    PRESETS.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "story-dot" + (i === idx ? " active" : "");
      dot.title = PRESETS[i].title;
      dot.onclick = () => goToStep(i);
      dots.appendChild(dot);
    });

    const nextBtn = document.createElement("button");
    nextBtn.className = "story-nav-btn";
    nextBtn.textContent = idx === PRESETS.length - 1 ? "Terminer ✓" : "Suivant →";
    nextBtn.onclick = () => {
      if (idx === PRESETS.length - 1) closeStory();
      else goToStep(idx + 1);
    };

    nav.append(prevBtn, dots, nextBtn);
    inner.append(header, title, text, nav);
    bar.appendChild(inner);

    bar.classList.add("active");
    startBtn.classList.add("hidden");

    // Apply the config
    applyPreset(preset);

    // Scroll chart into view
    document.querySelector(".chart-zoomable")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function goToStep(idx) {
    if (idx < 0 || idx >= PRESETS.length) return;
    renderStep(idx);
  }

  function closeStory() {
    bar.classList.remove("active");
    startBtn.classList.remove("hidden");
    currentStep = -1;
  }

  // ── Start button (floating) ────────────────────────────────────────────
  const startWrap = document.createElement("div");
  startWrap.className = "story-start-wrap";
  startWrap.id = "story-start-wrap";
  const startBtn = document.createElement("button");
  startBtn.className = "story-start-btn";
  startBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Visite guidée`;
  startBtn.onclick = () => goToStep(0);
  startWrap.appendChild(startBtn);

  document.body.appendChild(bar);
  document.body.appendChild(startWrap);

  // ── Keyboard navigation ────────────────────────────────────────────────
  const keyHandler = (e) => {
    if (currentStep < 0) return;
    if (document.querySelector(".audio-overlay")) return; // don't interfere with modal
    if (e.key === "ArrowRight") { e.preventDefault(); goToStep(currentStep + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); goToStep(currentStep - 1); }
    if (e.key === "Escape")     closeStory();
  };
  document.addEventListener("keydown", keyHandler);

  // Cleanup on cell disposal
  invalidation.then(() => {
    bar.remove();
    startWrap.remove();
    document.removeEventListener("keydown", keyHandler);
  });
}
```
