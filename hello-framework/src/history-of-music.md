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
.lang-pills { display:flex; flex-wrap:wrap; gap:6px; }
.lang-pill {
  padding:4px 12px; border-radius:16px; cursor:pointer;
  font-size:12px; font-family:var(--sans-serif); border:2px solid;
  transition:all .15s; background:transparent;
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
.hom-charts { display:grid; grid-template-columns:1fr 260px; gap:20px; align-items:start; }
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
// ② Language pills
const selectedLangs = view((() => {
  const defaultOn=["en","fr","es","de"];
  const wrap=document.createElement("div");
  wrap.style.cssText="display:flex;flex-direction:column;gap:6px;";
  wrap.value=[...defaultOn];
  const lbl=document.createElement("div");
  lbl.style.cssText="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--theme-foreground-muted)";
  lbl.textContent="② Langues";
  const row=document.createElement("div"); row.className="lang-pills";
  topLangsQ.forEach(code=>{
    const on=defaultOn.includes(code);
    const pill=document.createElement("button"); pill.className="lang-pill";
    pill.textContent=getLang(code); pill.dataset.code=code; pill.dataset.on=on?"1":"0";
    const col=getLangColor(code);
    const sty=v=>{pill.style.borderColor=col;pill.style.background=v?col:"transparent";pill.style.color=v?"#fff":col;};
    sty(on);
    pill.addEventListener("click",()=>{
      pill.dataset.on=pill.dataset.on==="1"?"0":"1"; sty(pill.dataset.on==="1");
      wrap.value=Array.from(row.querySelectorAll(".lang-pill[data-on='1']")).map(b=>b.dataset.code);
      wrap.dispatchEvent(new Event("input",{bubbles:true}));
    });
    row.appendChild(pill);
  });
  wrap.append(lbl,row); return wrap;
})());
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
  lbl.textContent="③ Genre";
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
  lbl.textContent="④ Affichage";
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
  <div>${selectedLangs}</div>
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

</div>
<div class="hom-card">
<h3>Part des langues · ${yearRange[0]}–${yearRange[1]}</h3>

```js
const PW=220, PH=220, R=80, r=40, cx=PW/2, cy=PH/2;
let cum=-Math.PI/2;
const arcs=langPieData.map(d=>{
  const a=(d.count/pieTotal)*2*Math.PI;
  const a0=cum, a1=cum+a; cum=a1;
  return {...d, a0, a1, mid:(a0+a1)/2, pct:(d.count/pieTotal*100).toFixed(1)};
});
function arcPath(a0,a1,R,r){
  const x0=cx+R*Math.cos(a0),y0=cy+R*Math.sin(a0);
  const x1=cx+R*Math.cos(a1),y1=cy+R*Math.sin(a1);
  const x2=cx+r*Math.cos(a1),y2=cy+r*Math.sin(a1);
  const x3=cx+r*Math.cos(a0),y3=cy+r*Math.sin(a0);
  const lg=(a1-a0)>Math.PI?1:0;
  return `M${x0} ${y0} A${R} ${R} 0 ${lg} 1 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 ${lg} 0 ${x3} ${y3}Z`;
}
const NS="http://www.w3.org/2000/svg";
const svg=document.createElementNS(NS,"svg");
svg.setAttribute("viewBox",`0 0 ${PW} ${PH}`);
svg.setAttribute("width",PW); svg.setAttribute("height",PH);
svg.style.cssText="display:block;margin:0 auto;";
arcs.forEach(a=>{
  const p=document.createElementNS(NS,"path");
  p.setAttribute("d",arcPath(a.a0,a.a1,R,r));
  p.setAttribute("fill",a.color);
  p.setAttribute("stroke",selectedLangs.includes(a.lang)?"#fff":"var(--theme-background)");
  p.setAttribute("stroke-width",selectedLangs.includes(a.lang)?"3":"1.5");
  p.style.opacity=selectedLangs.includes(a.lang)?"1":"0.3";
  const t=document.createElementNS(NS,"title");
  t.textContent=`${a.label}: ${a.pct}% (${a.count.toLocaleString()} titres)`;
  p.appendChild(t); svg.appendChild(p);
  if(a.a1-a.a0>0.3){
    const lx=cx+(R*0.7)*Math.cos(a.mid), ly=cy+(R*0.7)*Math.sin(a.mid);
    const txt=document.createElementNS(NS,"text");
    txt.setAttribute("x",lx); txt.setAttribute("y",ly);
    txt.setAttribute("text-anchor","middle"); txt.setAttribute("dominant-baseline","middle");
    txt.setAttribute("fill","#fff"); txt.setAttribute("font-size","10");
    txt.setAttribute("font-weight","700"); txt.setAttribute("font-family","var(--sans-serif)");
    txt.textContent=a.pct+"%"; svg.appendChild(txt);
  }
});
const ct=document.createElementNS(NS,"text");
ct.setAttribute("x",cx); ct.setAttribute("y",cy-7); ct.setAttribute("text-anchor","middle");
ct.setAttribute("dominant-baseline","middle"); ct.setAttribute("font-size","12");
ct.setAttribute("font-weight","700"); ct.setAttribute("font-family","var(--sans-serif)");
ct.setAttribute("fill","var(--theme-foreground)");
ct.textContent=pieTotal.toLocaleString(); svg.appendChild(ct);
const cs=document.createElementNS(NS,"text");
cs.setAttribute("x",cx); cs.setAttribute("y",cy+10); cs.setAttribute("text-anchor","middle");
cs.setAttribute("font-size","9"); cs.setAttribute("font-family","var(--sans-serif)");
cs.setAttribute("fill","var(--theme-foreground-muted)"); cs.textContent="titres"; svg.appendChild(cs);
display(svg);
```

```js
const leg=document.createElement("div");
leg.style.cssText="margin-top:8px;font-family:var(--sans-serif);font-size:11px;display:flex;flex-direction:column;gap:3px;";
// arcs has pct; langPieData does not — iterate arcs for the legend
arcs.forEach(d=>{
  const row=document.createElement("div"); row.style.cssText="display:flex;align-items:center;gap:6px;";
  const dot=document.createElement("span");
  dot.style.cssText=`width:10px;height:10px;border-radius:2px;background:${d.color};flex-shrink:0;opacity:${selectedLangs.includes(d.lang)?1:0.3};`;
  const info=document.createElement("span");
  info.style.cssText=`color:${selectedLangs.includes(d.lang)?"var(--theme-foreground)":"var(--theme-foreground-muted)"};`;
  info.textContent=`${d.label} — ${d.pct}%`;
  row.append(dot,info); leg.appendChild(row);
});
display(leg);
```

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
    {k:"Langues",v:selectedLangs.map(getLang).join(", ")||"—"},
    {k:"Période",v:`${yearRange[0]} – ${yearRange[1]}`},
    {k:"Genre dominant",v:sorted[0][0]},
    {k:"Part dom.",v:totalSel>0 ? (sorted[0][1]/totalSel*100).toFixed(1)+" %" : "—"},
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

</div>

## Popularité et durée moyenne par langue

```js
const lyFiltered = langYearData.filter(d =>
  selectedLangs.includes(d.language_code) &&
  +d.release_year >= yearRange[0] &&
  +d.release_year <= yearRange[1]
);

const langDomain = selectedLangs;
const langRange  = selectedLangs.map(l => getLangColor(l));

const popChart = Plot.plot({
  width: Math.floor(width/2)-8,
  height: 200, marginLeft: 50, marginBottom: 40,
  x: {label:"Année"},
  y: {label:"Popularité moy.", grid:true},
  color: {domain:langDomain, range:langRange, legend:false,
    tickFormat: l=>getLang(l)},
  marks:[
    Plot.line(lyFiltered,{x:d=>+d.release_year,y:d=>+d.avg_track_popularity,
      stroke:"language_code",strokeWidth:2,curve:"monotone-x",
      tip:true, title:d=>`${getLang(d.language_code)} · ${d.release_year}\nPop: ${(+d.avg_track_popularity).toFixed(1)}`}),
    Plot.dot(lyFiltered,{x:d=>+d.release_year,y:d=>+d.avg_track_popularity,
      stroke:"language_code",r:2})
  ]
});

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
grid.append(popChart,durChart);
display(grid);
```
