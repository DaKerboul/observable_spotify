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
.drs-wrap { position:relative; height:36px; width:100%; min-width:220px; }
.drs-track { position:absolute; left:0; right:0; top:17px; height:2px; background:#ccc; border-radius:2px; }
.drs-fill  { position:absolute; top:17px; height:2px; background:#1DB954; }
.drs-wrap input[type=range] {
  -webkit-appearance:none; appearance:none;
  position:absolute; left:0; width:100%; top:0;
  background:transparent; pointer-events:none; margin:0; height:36px;
}
.drs-wrap input[type=range]::-webkit-slider-thumb {
  -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
  background:#1DB954; cursor:pointer; pointer-events:all;
  border:none; box-shadow:0 1px 4px #0003; margin-top:-7px;
}
.drs-wrap input[type=range]::-moz-range-thumb {
  width:16px; height:16px; border-radius:50%;
  background:#1DB954; cursor:pointer; pointer-events:all; border:none;
}
.evo-controls {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 320px);
  gap: 18px;
  align-items: start;
  margin: 1rem 0 1.75rem;
}
.evo-controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.evo-controls-disk {
  display: flex;
  justify-content: center;
}
.evo-disk-card {
  width: 100%;
  max-width: 320px;
  padding: 14px;
  border-radius: 12px;
  background: var(--theme-background-alt);
}
.evo-disk-title {
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--theme-foreground-muted);
}
@media (max-width: 900px) {
  .evo-controls {
    grid-template-columns: 1fr;
  }
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
  <a class="nav-card" href="./plus">
    <span class="nav-card-icon">+</span>
    <span class="nav-card-title">Analyses complementaires</span>
    <span class="nav-card-desc">Ouvrir la page plus pour explorer des vues supplementaires.</span>
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

// Reusable double-range year slider
function yearSlider({min = 1970, max = 2025, label = "Période"} = {}) {
  const c = document.createElement("div");
  c.style.cssText = "display:flex;flex-direction:column;gap:4px;min-width:240px;font-family:var(--sans-serif);font-size:13px;";
  const top = document.createElement("div");
  top.style.cssText = "display:flex;justify-content:space-between;align-items:center;";
  const lbl = document.createElement("span");
  lbl.style.cssText = "font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--theme-foreground-muted)";
  lbl.textContent = label;
  const out = document.createElement("span");
  out.style.cssText = "font-weight:600;color:#1DB954;font-size:13px;";
  out.textContent = `${min} – ${max}`;
  top.append(lbl, out);
  const tw = document.createElement("div"); tw.className = "drs-wrap";
  const track = document.createElement("div"); track.className = "drs-track";
  const fill = document.createElement("div"); fill.className = "drs-fill";
  const lo = document.createElement("input"); lo.type = "range"; lo.min = min; lo.max = max; lo.value = min;
  const hi = document.createElement("input"); hi.type = "range"; hi.min = min; hi.max = max; hi.value = max;
  function upd() {
    const l = Math.min(+lo.value, +hi.value), h = Math.max(+lo.value, +hi.value);
    fill.style.left = (l - min) / (max - min) * 100 + "%";
    fill.style.width = (h - l) / (max - min) * 100 + "%";
    out.textContent = `${l} – ${h}`;
    c.value = [l, h];
    c.dispatchEvent(new Event("input", {bubbles: true}));
  }
  lo.addEventListener("input", () => { if (+lo.value > +hi.value) lo.value = hi.value; upd(); });
  hi.addEventListener("input", () => { if (+hi.value < +lo.value) hi.value = lo.value; upd(); });
  tw.append(track, fill, lo, hi);
  c.append(top, tw);
  upd();
  return c;
}
```

## Évolution des genres (1970 – 2025)

```js
const genreLangYear = await FileAttachment("data/genre_language_year.json").json();
```

```js
const allGenresEvo   = [...new Set(genreLangYear.map(d => d.genre))].sort();
const defaultGenresEvo = [...d3.rollup(genreLangYear, v => d3.sum(v, d => +d.track_count), d => d.genre)]
  .sort((a,b) => b[1]-a[1]).slice(0, 12).map(d => d[0]);

const topLangsEvo = [...d3.rollup(genreLangYear, v=>d3.sum(v,d=>+d.track_count), d=>d.language_code).entries()]
  .sort((a,b)=>b[1]-a[1]).slice(0,10).map(d=>d[0]);

const langMeta = {
  en:{label:"Anglais",   color:"#1a75cc"},
  es:{label:"Espagnol",  color:"#e84040"},
  fr:{label:"Français",  color:"#9b59b6"},
  de:{label:"Allemand",  color:"#f5a623"},
  pt:{label:"Portugais", color:"#e91e8c"},
  ja:{label:"Japonais",  color:"#16a085"},
  it:{label:"Italien",   color:"#d35400"},
  ko:{label:"Coréen",    color:"#2980b9"},
  tr:{label:"Turc",      color:"#8e44ad"},
  ru:{label:"Russe",     color:"#c0392b"},
  pl:{label:"Polonais",  color:"#27ae60"},
  nl:{label:"Néerlandais",color:"#1abc9c"},
  ar:{label:"Arabe",     color:"#f39c12"},
  sv:{label:"Suédois",   color:"#3498db"},
  hi:{label:"Hindi",     color:"#e74c3c"},
};
const getLang = code => langMeta[code]?.label ?? code.toUpperCase();
const getLangColor = code => langMeta[code]?.color ?? "#888";
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

<p style="font-size:0.85rem;color:var(--theme-foreground-muted);margin:0 0 1rem;">Sélectionnez les genres à afficher. Cliquez sur les segments du disque pour filtrer par langue.</p>


```js
const evoGenreFilter = view(searchableMultiSelect(allGenresEvo, {
  label: "Genres",
  value: defaultGenresEvo
}));
```

```js
// Compute pie data from genreLangYear within the evo year range
const langPieData = topLangsEvo.map(code => {
  const total = genreLangYear
    .filter(d => d.language_code === code && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1])
    .reduce((s, d) => s + (+d.track_count), 0);
  return {lang: code, label: getLang(code), count: total, color: getLangColor(code)};
}).filter(d => d.count > 0);
const pieTotal = langPieData.reduce((s, d) => s + d.count, 0);
```

```js
const evoLangDisk = (() => {
  const PW=300, PH=310, cx=150, cy=145;
  const R_sel=141, R_out=133, R_in=97, R_sep=94, R_grv=91, R_lbl=36, R_hole=15;
  const NS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${PW} ${PH}`);
  svg.setAttribute("width","100%"); svg.setAttribute("height",PH);
  svg.style.overflow="visible";

  const defs=document.createElementNS(NS,"defs");

  const rg=document.createElementNS(NS,"radialGradient"); rg.id="idx-cdGrv";
  rg.setAttribute("cx","40%"); rg.setAttribute("cy","35%"); rg.setAttribute("r","65%");
  [["0%","#2e2e45"],["45%","#0f0f1c"],["100%","#070710"]].forEach(([o,c])=>{
    const s=document.createElementNS(NS,"stop"); s.setAttribute("offset",o); s.setAttribute("stop-color",c); rg.appendChild(s);
  });
  defs.appendChild(rg);

  [[0,"#ff004408","#ffaa0012","#00ff4408","#0044ff08"],
   [72,"#0044ff08","#aa00ff10","#ff004408","#00ffaa08"],
   [144,"#00ffaa08","#ffff0010","#ff00aa08","#44aaff08"]].forEach(([ang,...stops],i)=>{
    const lg=document.createElementNS(NS,"linearGradient"); lg.id=`idx-ird${i}`;
    lg.setAttribute("x1","0%"); lg.setAttribute("y1","0%"); lg.setAttribute("x2","100%"); lg.setAttribute("y2","100%");
    lg.setAttribute("gradientTransform",`rotate(${ang},0.5,0.5)`);
    stops.forEach((col,j)=>{
      const s=document.createElementNS(NS,"stop"); s.setAttribute("offset",`${j/(stops.length-1)*100}%`); s.setAttribute("stop-color",col); lg.appendChild(s);
    });
    defs.appendChild(lg);
  });

  const cp=document.createElementNS(NS,"clipPath"); cp.id="idx-grpClip";
  const cpc=document.createElementNS(NS,"circle"); cpc.setAttribute("cx",cx); cpc.setAttribute("cy",cy); cpc.setAttribute("r",R_grv); cp.appendChild(cpc); defs.appendChild(cp);
  svg.appendChild(defs);

  const body=document.createElementNS(NS,"circle"); body.setAttribute("cx",cx); body.setAttribute("cy",cy); body.setAttribute("r",R_sel+3); body.setAttribute("fill","#aeb3b8"); svg.appendChild(body);

  function ap(a0,a1,Ro,Ri){
    const x0=cx+Ro*Math.cos(a0),y0=cy+Ro*Math.sin(a0),x1=cx+Ro*Math.cos(a1),y1=cy+Ro*Math.sin(a1);
    const x2=cx+Ri*Math.cos(a1),y2=cy+Ri*Math.sin(a1),x3=cx+Ri*Math.cos(a0),y3=cy+Ri*Math.sin(a0);
    const f=(a1-a0)>Math.PI?1:0;
    return `M${x0},${y0}A${Ro},${Ro} 0 ${f},1 ${x1},${y1}L${x2},${y2}A${Ri},${Ri} 0 ${f},0 ${x3},${y3}Z`;
  }

  // Enforce a minimum arc of 10px at the midpoint radius so tiny slices stay visible
  const minAng = 10 / ((R_in + R_out) / 2);
  const naturalAngles = langPieData.map(d => (d.count / pieTotal) * 2 * Math.PI);
  const clampedAngles = naturalAngles.map(a => Math.max(a, minAng));
  const clampedTotal = clampedAngles.reduce((s, a) => s + a, 0);
  const finalAngles = clampedAngles.map(a => (a / clampedTotal) * 2 * Math.PI);

  let cum=-Math.PI/2;
  const arcData=langPieData.map((d,i)=>{
    const a=finalAngles[i], a0=cum, a1=cum+a; cum=a1;
    return {...d,a0,a1,mid:(a0+a1)/2,pct:(d.count/pieTotal*100).toFixed(1)};
  });

  arcData.forEach(a=>{
    const on=selectedLangs.includes(a.lang);
    const Ro=on?R_sel:R_out;
    const g=document.createElementNS(NS,"g"); g.style.cursor="pointer";
    const p=document.createElementNS(NS,"path");
    p.setAttribute("d",ap(a.a0,a.a1,Ro,R_in));
    p.setAttribute("fill",a.color); p.setAttribute("stroke","rgba(255,255,255,0.55)"); p.setAttribute("stroke-width","1.2");
    p.style.opacity=on?"1":"0.2";
    const tip=document.createElementNS(NS,"title"); tip.textContent=`${a.label}: ${a.pct}% · ${a.count.toLocaleString()} titres`; p.appendChild(tip); g.appendChild(p);
    if(a.a1-a.a0>0.26){
      const mr=(Ro+R_in)/2, tx=cx+mr*Math.cos(a.mid), ty=cy+mr*Math.sin(a.mid);
      const t=document.createElementNS(NS,"text"); t.setAttribute("x",tx); t.setAttribute("y",ty);
      t.setAttribute("text-anchor","middle"); t.setAttribute("dominant-baseline","middle");
      t.setAttribute("fill","#fff"); t.setAttribute("font-size","8"); t.setAttribute("font-weight","800");
      t.setAttribute("font-family","var(--sans-serif)"); t.style.pointerEvents="none"; t.textContent=a.lang.toUpperCase(); g.appendChild(t);
    }
    g.addEventListener("click",()=>toggleLang(a.lang));
    svg.appendChild(g);
  });

  const sep=document.createElementNS(NS,"circle"); sep.setAttribute("cx",cx); sep.setAttribute("cy",cy); sep.setAttribute("r",R_sep); sep.setAttribute("fill","#c8cdd4"); svg.appendChild(sep);
  const grv=document.createElementNS(NS,"circle"); grv.setAttribute("cx",cx); grv.setAttribute("cy",cy); grv.setAttribute("r",R_grv); grv.setAttribute("fill","url(#idx-cdGrv)"); svg.appendChild(grv);

  [0,1,2].forEach(i=>{
    const r=document.createElementNS(NS,"rect"); r.setAttribute("x",cx-R_grv); r.setAttribute("y",cy-R_grv); r.setAttribute("width",R_grv*2); r.setAttribute("height",R_grv*2);
    r.setAttribute("fill",`url(#idx-ird${i})`); r.setAttribute("clip-path","url(#idx-grpClip)"); svg.appendChild(r);
  });

  for(let rr=R_lbl+5;rr<R_grv-1;rr+=3.2){
    const ring=document.createElementNS(NS,"circle"); ring.setAttribute("cx",cx); ring.setAttribute("cy",cy); ring.setAttribute("r",rr);
    ring.setAttribute("fill","none"); ring.setAttribute("stroke",`rgba(255,255,255,${0.022+((rr*7)%9)/700})`); ring.setAttribute("stroke-width","0.65"); svg.appendChild(ring);
  }

  const hi=document.createElementNS(NS,"path"); hi.setAttribute("d",ap(-1.9,-0.45,R_grv-5,R_lbl+7)); hi.setAttribute("fill","rgba(255,255,255,0.055)"); svg.appendChild(hi);

  const lblDisk=document.createElementNS(NS,"circle"); lblDisk.setAttribute("cx",cx); lblDisk.setAttribute("cy",cy); lblDisk.setAttribute("r",R_lbl); lblDisk.setAttribute("fill","#1DB954"); svg.appendChild(lblDisk);
  const ct=document.createElementNS(NS,"text"); ct.setAttribute("x",cx); ct.setAttribute("y",cy-5); ct.setAttribute("text-anchor","middle"); ct.setAttribute("dominant-baseline","middle"); ct.setAttribute("font-size","10"); ct.setAttribute("font-weight","700"); ct.setAttribute("font-family","var(--sans-serif)"); ct.setAttribute("fill","#fff"); ct.textContent=pieTotal.toLocaleString(); svg.appendChild(ct);
  const cst=document.createElementNS(NS,"text"); cst.setAttribute("x",cx); cst.setAttribute("y",cy+8); cst.setAttribute("text-anchor","middle"); cst.setAttribute("font-size","7"); cst.setAttribute("font-family","var(--sans-serif)"); cst.setAttribute("fill","rgba(255,255,255,0.75)"); cst.textContent="titres"; svg.appendChild(cst);

  const hole=document.createElementNS(NS,"circle"); hole.setAttribute("cx",cx); hole.setAttribute("cy",cy); hole.setAttribute("r",R_hole); hole.setAttribute("fill","var(--theme-background)"); hole.setAttribute("stroke","#666"); hole.setAttribute("stroke-width","0.5"); svg.appendChild(hole);

  const leg=document.createElement("div");
  leg.style.cssText="margin-top:8px;font-family:var(--sans-serif);font-size:10px;display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;";
  arcData.forEach(d=>{
    const on=selectedLangs.includes(d.lang);
    const row=document.createElement("div"); row.style.cssText="display:flex;align-items:center;gap:4px;cursor:pointer;padding:2px;";
    const dot=document.createElement("span"); dot.style.cssText=`width:7px;height:7px;border-radius:2px;background:${d.color};flex-shrink:0;opacity:${on?1:0.35};`;
    const info=document.createElement("span"); info.style.cssText=`color:${on?"var(--theme-foreground)":"var(--theme-foreground-muted)"};`;
    info.textContent=`${d.label} ${d.pct}%`;
    row.append(dot,info);
    row.addEventListener("click",()=>toggleLang(d.lang));
    leg.appendChild(row);
  });

  const wrap=document.createElement("div");
  wrap.append(svg,leg);
  return wrap;
})();
```

<div style="margin-bottom:14px;">${evoYearRange}</div>

<div class="evo-controls">
  <div class="evo-controls-panel">
    <div>${evoGenreFilter}</div>
  </div>
  <div class="evo-controls-disk">
    <div class="evo-disk-card">
      <div class="evo-disk-title">Langues</div>
      ${evoLangDisk}
    </div>
  </div>
</div>

```js
// Aggregate: sum track_count by genre+year after filtering on selected genres & languages
const evoData = d3.rollups(
  genreLangYear.filter(d => evoGenreFilter.includes(d.genre) && selectedLangs.includes(d.language_code) && +d.release_year >= evoYearRange[0] && +d.release_year <= evoYearRange[1]),
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

```js
const evoYearRange = view(yearSlider({min: 1970, max: 2025, label: "Période"}));
```

*Encoding note (rough): data item = one genre-year pair (aggregated across selected languages). Mark used = stacked area, chosen to show continuous change over time while also showing part-to-whole composition at each year. Visual variables: x-position maps year, y-height/area maps track count, and color hue maps genre identity.*
