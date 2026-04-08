---
toc: false
---

<style>
.hom-title { font-family:var(--sans-serif); text-align:center; margin:2rem 0 0.25rem; }
.hom-title h1 {
  font-size:2.6rem; font-weight:900; margin:0;
  background:linear-gradient(90deg,#1DB954,#1a75cc);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.hom-title p { color:var(--theme-foreground-muted); font-size:.9rem; margin:.3rem 0 1.5rem; }
.hom-controls {
  display:flex; flex-wrap:wrap; gap:18px; align-items:flex-start;
  background:var(--theme-background-alt); border-radius:12px;
  padding:16px 20px; margin-bottom:20px;
  font-family:var(--sans-serif); font-size:13px;
}
.hom-ctrl-group { display:flex; flex-direction:column; gap:6px; }
.hom-ctrl-label {
  font-weight:700; font-size:11px; text-transform:uppercase;
  letter-spacing:.05em; color:var(--theme-foreground-muted);
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
.mode-btns {
  display:flex; border-radius:8px; overflow:hidden; border:1.5px solid #1DB954;
}
.mode-btn {
  padding:4px 14px; border:none; background:transparent; cursor:pointer;
  font-size:12px; font-family:inherit; color:#1DB954; transition:all .15s;
}
.mode-btn[data-on="1"] { background:#1DB954; color:#fff; }
.mode-btn:not(:first-child) { border-left:1.5px solid #1DB954; }
.hom-charts { display:grid; grid-template-columns:1fr 320px; gap:20px; align-items:start; }
@media(max-width:860px){ .hom-charts{grid-template-columns:1fr;} }
.hom-card {
  background:var(--theme-background-alt); border-radius:12px; padding:16px;
}
.hom-card h3 {
  font-size:11px; font-weight:700; text-transform:uppercase;
  letter-spacing:.05em; color:var(--theme-foreground-muted); margin:0 0 10px;
}
.hom-detail { background:var(--theme-background-alt); border-radius:12px; padding:16px 20px; margin-top:16px; }
.hom-detail h3 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); margin:0 0 10px; }
.detail-grid { display:flex; flex-wrap:wrap; gap:10px 28px; }
.detail-item { display:flex; flex-direction:column; gap:2px; }
.detail-key { font-size:10px; color:var(--theme-foreground-muted); text-transform:uppercase; letter-spacing:.04em; }
.detail-val { font-size:14px; font-weight:700; }
.mini-charts { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:14px; }
@media(max-width:700px){ .mini-charts{grid-template-columns:1fr;} }
</style>

<div class="hom-title">
  <h1>History of Music</h1>
  <p>Évolution des genres musicaux par langue · données Spotify · Anna's Archive 2025</p>
</div>

```js
const rawData = await FileAttachment("data/genre_language_year.json").json();
const langYearData = await FileAttachment("data/language_year.json").json();

const topGenresQ = [...d3.rollup(rawData, v => d3.sum(v, d=>+d.track_count), d=>d.genre).entries()]
  .sort((a,b)=>b[1]-a[1]).slice(0,12).map(d=>d[0]);

// Discover top languages from data
const topLangsQ = [...d3.rollup(rawData, v=>d3.sum(v,d=>+d.track_count), d=>d.language_code).entries()]
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
};
const getLang = code => langMeta[code]?.label ?? code.toUpperCase();
const getLangColor = code => langMeta[code]?.color ?? "#888";
```

```js
// ① Year range slider
const yearRange = view((() => {
  const min=1970, max=2025;
  const c = document.createElement("div");
  c.style.cssText="display:flex;flex-direction:column;gap:4px;min-width:240px;max-width:320px;font-family:var(--sans-serif);font-size:13px;";
  const top = document.createElement("div");
  top.style.cssText="display:flex;justify-content:space-between;align-items:center;";
  const lbl=document.createElement("span");
  lbl.style.cssText="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--theme-foreground-muted)";
  lbl.textContent="① Période";
  const out=document.createElement("span");
  out.style.cssText="font-weight:600;color:#1DB954;font-size:13px;";
  out.textContent=`${min} – ${max}`;
  top.append(lbl,out);
  const tw=document.createElement("div"); tw.className="drs-wrap";
  const track=document.createElement("div"); track.className="drs-track";
  const fill=document.createElement("div"); fill.className="drs-fill";
  const lo=document.createElement("input"); lo.type="range"; lo.min=min; lo.max=max; lo.value=min;
  const hi=document.createElement("input"); hi.type="range"; hi.min=min; hi.max=max; hi.value=max;
  function upd(){
    const l=Math.min(+lo.value,+hi.value), h=Math.max(+lo.value,+hi.value);
    fill.style.left=(l-min)/(max-min)*100+"%"; fill.style.width=(h-l)/(max-min)*100+"%";
    out.textContent=`${l} – ${h}`; c.value=[l,h]; c.dispatchEvent(new Event("input",{bubbles:true}));
  }
  lo.addEventListener("input",()=>{if(+lo.value>+hi.value)lo.value=hi.value;upd();});
  hi.addEventListener("input",()=>{if(+hi.value<+lo.value)hi.value=lo.value;upd();});
  tw.append(track,fill,lo,hi); c.append(top,tw); upd(); return c;
})());
```

```js
// ② Langues - sélection gérée par le CD interactif ci-dessous
const selectedLangs = Mutable(["en","fr","es","de"]);
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
// ③ Genre filter
const genreFilter = view((() => {
  const opts=["Tous",...topGenresQ];
  const sel=document.createElement("select");
  sel.style.cssText="padding:4px 10px;border-radius:8px;border:1.5px solid #ccc;font-family:var(--sans-serif);font-size:12px;background:var(--theme-background);color:var(--theme-foreground);cursor:pointer;";
  opts.forEach(g=>{
    const opt=document.createElement("option");
    opt.value=g; opt.textContent=g==="Tous"?"Tous les genres":g; sel.appendChild(opt);
  });
  const wrap=document.createElement("div"); wrap.style.cssText="display:flex;flex-direction:column;gap:6px;";
  const lbl=document.createElement("div");
  lbl.style.cssText="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--theme-foreground-muted)";
  lbl.textContent="② Genre";
  sel.addEventListener("change",()=>{wrap.value=sel.value;wrap.dispatchEvent(new Event("input",{bubbles:true}));});
  wrap.value="Tous"; wrap.append(lbl,sel); return wrap;
})());
```

```js
// ④ Display mode
const normalised = view((() => {
  const wrap=document.createElement("div"); wrap.style.cssText="display:flex;flex-direction:column;gap:6px;"; wrap.value=false;
  const lbl=document.createElement("div");
  lbl.style.cssText="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--theme-foreground-muted)";
  lbl.textContent="③ Affichage";
  const btns=document.createElement("div"); btns.className="mode-btns";
  const b1=document.createElement("button"); b1.className="mode-btn"; b1.textContent="Absolu"; b1.dataset.on="1";
  const b2=document.createElement("button"); b2.className="mode-btn"; b2.textContent="Normalisé (%)"; b2.dataset.on="0";
  b1.addEventListener("click",()=>{b1.dataset.on="1";b2.dataset.on="0";wrap.value=false;wrap.dispatchEvent(new Event("input",{bubbles:true}));});
  b2.addEventListener("click",()=>{b1.dataset.on="0";b2.dataset.on="1";wrap.value=true; wrap.dispatchEvent(new Event("input",{bubbles:true}));});
  btns.append(b1,b2); wrap.append(lbl,btns); return wrap;
})());
```

<div class="hom-controls">
  <div>${yearRange}</div>
  <div>${genreFilter}</div>
  <div>${normalised}</div>
</div>

```js
const raw = rawData;
const filtered = raw.filter(d =>
  selectedLangs.includes(d.language_code) &&
  +d.release_year >= yearRange[0] &&
  +d.release_year <= yearRange[1] &&
  (genreFilter === "Tous" ? topGenresQ.includes(d.genre) : d.genre === genreFilter)
);

// Aggregate by genre + year
const areaMap = new Map();
const yearsSet = new Set();
const genresPresent = new Set();
for (const d of filtered) {
  const key = `${d.genre}|${d.release_year}`;
  areaMap.set(key, (areaMap.get(key) ?? 0) + +d.track_count);
  yearsSet.add(+d.release_year);
  genresPresent.add(d.genre);
}

const genreList = genreFilter==="Tous"
  ? topGenresQ.filter(g=>genresPresent.has(g))
  : [genreFilter];

const palette = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
                 "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b"];
const gColor = Object.fromEntries(genreList.map((g,i)=>[g,palette[i%palette.length]]));

let plotData = [];
for (const year of [...yearsSet].sort((a,b)=>a-b)) {
  for (const genre of genresPresent) {
    plotData.push({ year, genre, count: areaMap.get(`${genre}|${year}`) ?? 0 });
  }
}
if (normalised) {
  const yt = new Map();
  for (const d of plotData) yt.set(d.year,(yt.get(d.year)??0)+d.count);
  plotData = plotData.map(d=>({...d, count: yt.get(d.year)>0 ? d.count/yt.get(d.year)*100 : 0}));
}

// Pie data
const langPieData = topLangsQ.map(code => {
  const total = raw.filter(d=>d.language_code===code && +d.release_year>=yearRange[0] && +d.release_year<=yearRange[1])
                   .reduce((s,d)=>s+(+d.track_count),0);
  return {lang:code, label:getLang(code), count:total, color:getLangColor(code)};
}).filter(d=>d.count>0);
const pieTotal = langPieData.reduce((s,d)=>s+d.count,0);
```

<div class="hom-charts">
<div class="hom-card">
<h3>Évolution des genres${normalised ? " (normalisé, %)" : " (nombre de titres)"}</h3>

```js
display(Plot.plot({
  width: Math.max(400, width - 320),
  height: 380,
  marginLeft: 55,
  marginBottom: 45,
  x: { label: "Année →", tickFormat: d=>String(d) },
  y: {
    label: normalised ? "Part (%)" : "Nombre de titres →",
    grid: true,
    tickFormat: normalised ? d=>d.toFixed(0)+"%" : "s"
  },
  color: {
    domain: genreList,
    range: genreList.map(g=>gColor[g]),
    legend: true, columns: 4
  },
  marks: [
    Plot.areaY(plotData, {
      x: "year", y: "count", fill: "genre", order: genreList,
      curve: "monotone-x", tip: true,
      title: d=>`${d.genre} · ${d.year}\n${normalised ? d.count.toFixed(1)+"%" : Number(d.count).toLocaleString()+" titres"}`
    }),
    Plot.ruleY([0])
  ]
}));
```

*Encoding note (rough): data item = one genre-year aggregate after filters. Mark used = stacked area, chosen because it combines temporal continuity with part-to-whole composition in a single view. Visual variables: x-position maps year, y-height maps track count (or share when normalized), and color hue maps genre.*

</div>
<div class="hom-card">
<h3>② Langues · cliquer les segments pour sélectionner · ${yearRange[0]}–${yearRange[1]}</h3>

```js
// CD interactif - Language selector
{
  const PW=300, PH=310, cx=150, cy=145;
  const R_sel=141, R_out=133, R_in=97, R_sep=94, R_grv=91, R_lbl=36, R_hole=15;
  const NS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${PW} ${PH}`);
  svg.setAttribute("width","100%"); svg.setAttribute("height",PH);
  svg.style.overflow="visible";

  const defs=document.createElementNS(NS,"defs");

  // Groove radial gradient
  const rg=document.createElementNS(NS,"radialGradient"); rg.id="hom-cdGrv";
  rg.setAttribute("cx","40%"); rg.setAttribute("cy","35%"); rg.setAttribute("r","65%");
  [["0%","#2e2e45"],["45%","#0f0f1c"],["100%","#070710"]].forEach(([o,c])=>{
    const s=document.createElementNS(NS,"stop"); s.setAttribute("offset",o); s.setAttribute("stop-color",c); rg.appendChild(s);
  });
  defs.appendChild(rg);

  // Iridescent gradients (rainbow sheen on grooves)
  [[0,"#ff004408","#ffaa0012","#00ff4408","#0044ff08"],
   [72,"#0044ff08","#aa00ff10","#ff004408","#00ffaa08"],
   [144,"#00ffaa08","#ffff0010","#ff00aa08","#44aaff08"]].forEach(([ang,...stops],i)=>{
    const lg=document.createElementNS(NS,"linearGradient"); lg.id=`hom-ird${i}`;
    lg.setAttribute("x1","0%"); lg.setAttribute("y1","0%"); lg.setAttribute("x2","100%"); lg.setAttribute("y2","100%");
    lg.setAttribute("gradientTransform",`rotate(${ang},0.5,0.5)`);
    stops.forEach((col,j)=>{
      const s=document.createElementNS(NS,"stop"); s.setAttribute("offset",`${j/(stops.length-1)*100}%`); s.setAttribute("stop-color",col); lg.appendChild(s);
    });
    defs.appendChild(lg);
  });

  // Clip path for groove disc
  const cp=document.createElementNS(NS,"clipPath"); cp.id="hom-grpClip";
  const cpc=document.createElementNS(NS,"circle"); cpc.setAttribute("cx",cx); cpc.setAttribute("cy",cy); cpc.setAttribute("r",R_grv); cp.appendChild(cpc); defs.appendChild(cp);
  svg.appendChild(defs);

  // Outer silver body
  const body=document.createElementNS(NS,"circle"); body.setAttribute("cx",cx); body.setAttribute("cy",cy); body.setAttribute("r",R_sel+3); body.setAttribute("fill","#aeb3b8"); svg.appendChild(body);

  // Arc path helper
  function ap(a0,a1,Ro,Ri){
    const x0=cx+Ro*Math.cos(a0),y0=cy+Ro*Math.sin(a0),x1=cx+Ro*Math.cos(a1),y1=cy+Ro*Math.sin(a1);
    const x2=cx+Ri*Math.cos(a1),y2=cy+Ri*Math.sin(a1),x3=cx+Ri*Math.cos(a0),y3=cy+Ri*Math.sin(a0);
    const f=(a1-a0)>Math.PI?1:0;
    return `M${x0},${y0}A${Ro},${Ro} 0 ${f},1 ${x1},${y1}L${x2},${y2}A${Ri},${Ri} 0 ${f},0 ${x3},${y3}Z`;
  }

  // Compute pie data
  const pieTotal=langPieData.reduce((s,d)=>s+d.count,0);
  let cum=-Math.PI/2;
  const arcData=langPieData.map(d=>{
    const a=(d.count/pieTotal)*2*Math.PI, a0=cum, a1=cum+a; cum=a1;
    return {...d,a0,a1,mid:(a0+a1)/2,pct:(d.count/pieTotal*100).toFixed(1)};
  });

  // Language segments - outer ring (clickable)
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

  // Silver separator ring
  const sep=document.createElementNS(NS,"circle"); sep.setAttribute("cx",cx); sep.setAttribute("cy",cy); sep.setAttribute("r",R_sep); sep.setAttribute("fill","#c8cdd4"); svg.appendChild(sep);

  // Groove base disc
  const grv=document.createElementNS(NS,"circle"); grv.setAttribute("cx",cx); grv.setAttribute("cy",cy); grv.setAttribute("r",R_grv); grv.setAttribute("fill","url(#hom-cdGrv)"); svg.appendChild(grv);

  // Iridescent sheen overlays
  [0,1,2].forEach(i=>{
    const r=document.createElementNS(NS,"rect"); r.setAttribute("x",cx-R_grv); r.setAttribute("y",cy-R_grv); r.setAttribute("width",R_grv*2); r.setAttribute("height",R_grv*2);
    r.setAttribute("fill",`url(#hom-ird${i})`); r.setAttribute("clip-path","url(#hom-grpClip)"); svg.appendChild(r);
  });

  // Concentric groove rings
  for(let rr=R_lbl+5;rr<R_grv-1;rr+=3.2){
    const ring=document.createElementNS(NS,"circle"); ring.setAttribute("cx",cx); ring.setAttribute("cy",cy); ring.setAttribute("r",rr);
    ring.setAttribute("fill","none"); ring.setAttribute("stroke",`rgba(255,255,255,${0.022+((rr*7)%9)/700})`); ring.setAttribute("stroke-width","0.65"); svg.appendChild(ring);
  }

  // Light glint arc
  const hi=document.createElementNS(NS,"path"); hi.setAttribute("d",ap(-1.9,-0.45,R_grv-5,R_lbl+7)); hi.setAttribute("fill","rgba(255,255,255,0.055)"); svg.appendChild(hi);

  // Center label disc (Spotify green)
  const lblDisk=document.createElementNS(NS,"circle"); lblDisk.setAttribute("cx",cx); lblDisk.setAttribute("cy",cy); lblDisk.setAttribute("r",R_lbl); lblDisk.setAttribute("fill","#1DB954"); svg.appendChild(lblDisk);
  const ct=document.createElementNS(NS,"text"); ct.setAttribute("x",cx); ct.setAttribute("y",cy-5); ct.setAttribute("text-anchor","middle"); ct.setAttribute("dominant-baseline","middle"); ct.setAttribute("font-size","10"); ct.setAttribute("font-weight","700"); ct.setAttribute("font-family","var(--sans-serif)"); ct.setAttribute("fill","#fff"); ct.textContent=pieTotal.toLocaleString(); svg.appendChild(ct);
  const cst=document.createElementNS(NS,"text"); cst.setAttribute("x",cx); cst.setAttribute("y",cy+8); cst.setAttribute("text-anchor","middle"); cst.setAttribute("font-size","7"); cst.setAttribute("font-family","var(--sans-serif)"); cst.setAttribute("fill","rgba(255,255,255,0.75)"); cst.textContent="titres"; svg.appendChild(cst);

  // Center hole
  const hole=document.createElementNS(NS,"circle"); hole.setAttribute("cx",cx); hole.setAttribute("cy",cy); hole.setAttribute("r",R_hole); hole.setAttribute("fill","var(--theme-background)"); hole.setAttribute("stroke","#666"); hole.setAttribute("stroke-width","0.5"); svg.appendChild(hole);

  // Legend (2 columns, also clickable)
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

  const wrap=document.createElement("div"); wrap.append(svg,leg); display(wrap);
}
```

*Encoding note (rough): data item = one language aggregate in the selected period. Mark used = radial ring segments (custom SVG, CD metaphor), chosen to match the music theme and to let users compare composition shares while directly interacting with language segments. Visual variables: angular span maps share/volume, hue maps language, and opacity indicates selected vs non-selected languages.*

</div>
</div>

<div class="hom-detail">
<h3>Synthèse · sélection courante</h3>

```js
const byG = new Map();
for (const d of filtered) byG.set(d.genre,(byG.get(d.genre)??0)+(+d.track_count));
const sorted=[...byG.entries()].sort((a,b)=>b[1]-a[1]);
const totalSel=sorted.reduce((s,[,v])=>s+v,0);

if(sorted.length>0){
  const detailDiv=document.createElement("div"); detailDiv.className="detail-grid";
  [
    {k:"Langues",v:selectedLangs.map(getLang).join(", ")||"-"},
    {k:"Période",v:`${yearRange[0]} – ${yearRange[1]}`},
    {k:"Genre dominant",v:sorted[0][0]},
    {k:"Part dom.",v:totalSel>0 ? (sorted[0][1]/totalSel*100).toFixed(1)+" %" : "-"},
    {k:"Titres (dom.)",v:sorted[0][1].toLocaleString()},
    {k:"Total titres",v:totalSel.toLocaleString()},
  ].forEach(({k,v})=>{
    const it=document.createElement("div"); it.className="detail-item";
    const kk=document.createElement("span"); kk.className="detail-key"; kk.textContent=k;
    const vv=document.createElement("span"); vv.className="detail-val"; vv.textContent=v;
    it.append(kk,vv); detailDiv.appendChild(it);
  });

  const barDiv=document.createElement("div"); barDiv.style.cssText="width:100%;margin-top:12px;";
  const bt=document.createElement("div");
  bt.style.cssText="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--theme-foreground-muted);margin-bottom:6px;";
  bt.textContent="Top 5 genres"; barDiv.appendChild(bt);
  sorted.slice(0,5).forEach(([g,cnt],i)=>{
    const row=document.createElement("div"); row.style.cssText="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:11px;";
    const nm=document.createElement("span"); nm.style.cssText="min-width:120px;"; nm.textContent=g;
    const bw=document.createElement("div"); bw.style.cssText="flex:1;background:#eee;border-radius:3px;height:8px;overflow:hidden;";
    const b=document.createElement("div");
    const barPct = sorted[0][1] > 0 ? (cnt/sorted[0][1]*100).toFixed(1) : "0";
    b.style.cssText=`width:${barPct}%;height:100%;background:${gColor[g]??palette[i%palette.length]};border-radius:3px;`;
    bw.appendChild(b);
    const cs=document.createElement("span"); cs.style.cssText="min-width:55px;text-align:right;color:var(--theme-foreground-muted);"; cs.textContent=cnt.toLocaleString();
    row.append(nm,bw,cs); barDiv.appendChild(row);
  });
  display(detailDiv); display(barDiv);
} else {
  const p=document.createElement("p"); p.style.cssText="color:var(--theme-foreground-muted);font-style:italic;margin:0;";
  p.textContent="Aucune donnée. Sélectionnez au moins une langue."; display(p);
}
```

*Encoding note (rough): data item = one genre aggregate in the current selection. Mark used = inline horizontal bars in an HTML table-like list, chosen because bars make rank and magnitude comparison immediate in compact summary space. Visual variables: bar length maps relative volume versus the top genre, text labels carry exact counts, and bar color maps genre.*

</div>

## Durée moyenne par langue

```js
const lyFiltered = langYearData.filter(d =>
  selectedLangs.includes(d.language_code) &&
  +d.release_year >= yearRange[0] &&
  +d.release_year <= yearRange[1]
);

const langDomain = selectedLangs;
const langRange  = selectedLangs.map(l => getLangColor(l));


const durChart = Plot.plot({
  width: Math.floor(width/2)-8,
  height: 200, marginLeft: 58, marginBottom: 40,
  x: {label:"Année"},
  y: {label:"Durée moy. (min)", grid:true},
  color: {domain:langDomain, range:langRange,
    tickFormat: l=>getLang(l), legend:true, columns:4},
  marks:[
    Plot.line(lyFiltered,{x:d=>+d.release_year,y:d=>+d.avg_duration_ms/60000,
      stroke:"language_code",strokeWidth:2,curve:"monotone-x",
      tip:true, title:d=>`${getLang(d.language_code)} · ${d.release_year}\nDurée: ${(+d.avg_duration_ms/60000).toFixed(2)} min`}),
    Plot.dot(lyFiltered,{x:d=>+d.release_year,y:d=>+d.avg_duration_ms/60000,
      stroke:"language_code",r:2})
  ]
});

const grid=document.createElement("div");
grid.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:16px;";
grid.append(durChart);
display(grid);
```

*Encoding note (rough): data item = one language-year record. Mark used = multi-series line + dots, chosen because lines emphasize continuous evolution and dots keep individual yearly observations readable. Visual variables: x-position maps year, y-position maps average duration (minutes), and color hue maps language.*
