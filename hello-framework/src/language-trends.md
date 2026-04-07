---
toc: false
---

<style>
.page-title { font-family:var(--sans-serif); text-align:center; margin:2rem 0 1.5rem; }
.page-title h1 {
  font-size:2.2rem; font-weight:900; margin:0 0 0.3rem;
  background:linear-gradient(90deg,#1a75cc,#1DB954);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.page-title p { color:var(--theme-foreground-muted); font-size:.88rem; margin:0; }
.controls-bar {
  display:flex; flex-wrap:wrap; gap:16px; align-items:flex-start;
  background:var(--theme-background-alt); border-radius:12px;
  padding:14px 18px; margin-bottom:20px;
  font-family:var(--sans-serif); font-size:12px;
}
.ctrl-group { display:flex; flex-direction:column; gap:5px; }
.ctrl-label {
  font-weight:700; font-size:10px; text-transform:uppercase;
  letter-spacing:.06em; color:var(--theme-foreground-muted);
}
.lang-pills { display:flex; flex-wrap:wrap; gap:5px; }
.lang-pill {
  padding:3px 11px; border-radius:14px; cursor:pointer;
  font-size:11px; font-family:var(--sans-serif); border:2px solid;
  transition:all .15s;
}
.drs-wrap { position:relative; height:34px; width:100%; min-width:200px; }
.drs-track { position:absolute; left:0; right:0; top:16px; height:2px; background:#ccc; border-radius:2px; }
.drs-fill  { position:absolute; top:16px; height:2px; background:#1a75cc; }
.drs-wrap input[type=range] {
  -webkit-appearance:none; appearance:none;
  position:absolute; left:0; width:100%; top:0;
  background:transparent; pointer-events:none; margin:0; height:34px;
}
.drs-wrap input[type=range]::-webkit-slider-thumb {
  -webkit-appearance:none; width:15px; height:15px; border-radius:50%;
  background:#1a75cc; cursor:pointer; pointer-events:all; border:none; margin-top:-6.5px;
}
.drs-wrap input[type=range]::-moz-range-thumb {
  width:15px; height:15px; border-radius:50%; background:#1a75cc;
  cursor:pointer; pointer-events:all; border:none;
}
.chart-card { background:var(--theme-background-alt); border-radius:12px; padding:16px; margin-bottom:16px; }
.chart-card h3 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); margin:0 0 12px; }
.stats-table {
  width:100%; border-collapse:collapse;
  font-family:var(--sans-serif); font-size:12px;
}
.stats-table th {
  text-align:left; padding:6px 10px;
  font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
  color:var(--theme-foreground-muted); border-bottom:1.5px solid var(--theme-background-alt);
}
.stats-table td {
  padding:6px 10px; border-bottom:1px solid var(--theme-background-alt);
  color:var(--theme-foreground);
}
.stats-table tr:last-child td { border-bottom:none; }
.bar-inline {
  display:inline-block; height:8px; border-radius:2px; vertical-align:middle; margin-right:6px;
}
</style>

<div class="page-title">
  <h1>Tendances par Langue</h1>
  <p>Évolution du volume, de la popularité et de la durée moyenne par langue · 1970–2025</p>
</div>

```js
const langYear = await FileAttachment("data/language_year.json").json();

const langMeta = {
  en:{label:"Anglais",    color:"#1a75cc"},
  es:{label:"Espagnol",   color:"#e84040"},
  fr:{label:"Français",   color:"#9b59b6"},
  de:{label:"Allemand",   color:"#f5a623"},
  pt:{label:"Portugais",  color:"#e91e8c"},
  ja:{label:"Japonais",   color:"#16a085"},
  it:{label:"Italien",    color:"#d35400"},
  ko:{label:"Coréen",     color:"#2980b9"},
  tr:{label:"Turc",       color:"#8e44ad"},
  ru:{label:"Russe",      color:"#c0392b"},
  pl:{label:"Polonais",   color:"#27ae60"},
  nl:{label:"Néerlandais",color:"#1abc9c"},
  ar:{label:"Arabe",      color:"#f39c12"},
  sv:{label:"Suédois",    color:"#3498db"},
  hi:{label:"Hindi",      color:"#e74c3c"},
};
const getLang = c => langMeta[c]?.label ?? c.toUpperCase();
const getColor = c => langMeta[c]?.color ?? "#888";

// All languages sorted by total
const allLangs = [...d3.rollup(langYear, v=>d3.sum(v,d=>+d.track_count), d=>d.language_code).entries()]
  .sort((a,b)=>b[1]-a[1]).map(d=>d[0]);
```

```js
// Year slider
const yearRange = view((() => {
  const min=1970, max=2025;
  const c=document.createElement("div");
  c.style.cssText="display:flex;flex-direction:column;gap:4px;min-width:220px;max-width:300px;";
  const top=document.createElement("div"); top.style.cssText="display:flex;justify-content:space-between;";
  const lbl=document.createElement("span");
  lbl.style.cssText="font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--theme-foreground-muted)";
  lbl.textContent="① Période";
  const out=document.createElement("span"); out.style.cssText="font-weight:600;color:#1a75cc;font-size:12px;";
  out.textContent=`${min} – ${max}`; top.append(lbl,out);
  const tw=document.createElement("div"); tw.className="drs-wrap";
  const tr=document.createElement("div"); tr.className="drs-track";
  const fi=document.createElement("div"); fi.className="drs-fill";
  const lo=document.createElement("input"); lo.type="range"; lo.min=min; lo.max=max; lo.value=min;
  const hi=document.createElement("input"); hi.type="range"; hi.min=min; hi.max=max; hi.value=max;
  function u(){
    const l=Math.min(+lo.value,+hi.value), h=Math.max(+lo.value,+hi.value);
    fi.style.left=(l-min)/(max-min)*100+"%"; fi.style.width=(h-l)/(max-min)*100+"%";
    out.textContent=`${l} – ${h}`; c.value=[l,h]; c.dispatchEvent(new Event("input",{bubbles:true}));
  }
  lo.addEventListener("input",()=>{if(+lo.value>+hi.value)lo.value=hi.value;u();});
  hi.addEventListener("input",()=>{if(+hi.value<+lo.value)hi.value=lo.value;u();});
  tw.append(tr,fi,lo,hi); c.append(top,tw); u(); return c;
})());
```

```js
// Language pills (top 12)
const selectedLangs = view((() => {
  const top12=allLangs.slice(0,12);
  const def=["en","fr","es","de","pt","ja"];
  const wrap=document.createElement("div"); wrap.style.cssText="display:flex;flex-direction:column;gap:5px;"; wrap.value=[...def];
  const lbl=document.createElement("div");
  lbl.style.cssText="font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--theme-foreground-muted)";
  lbl.textContent="② Langues";
  const row=document.createElement("div"); row.className="lang-pills";
  top12.forEach(code=>{
    const on=def.includes(code);
    const pill=document.createElement("button"); pill.className="lang-pill";
    pill.textContent=getLang(code); pill.dataset.code=code; pill.dataset.on=on?"1":"0";
    const col=getColor(code);
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

<div class="controls-bar">
  <div>${yearRange}</div>
  <div>${selectedLangs}</div>
</div>

```js
const filtered = langYear.filter(d =>
  selectedLangs.includes(d.language_code) &&
  +d.release_year >= yearRange[0] &&
  +d.release_year <= yearRange[1]
);

const langDomain = selectedLangs;
const langColors  = selectedLangs.map(getColor);
```

<div class="chart-card">
<h3>Volume de titres par langue (absolu)</h3>

```js
display(Plot.plot({
  width, height:300, marginLeft:58, marginBottom:40,
  x:{label:"Année"},
  y:{label:"Nombre de titres", grid:true, tickFormat:"s"},
  color:{domain:langDomain, range:langColors, legend:true,
    tickFormat:getLang, columns:6},
  marks:[
    Plot.line(filtered,{
      x:d=>+d.release_year, y:d=>+d.track_count, stroke:"language_code",
      strokeWidth:2, curve:"monotone-x",
      tip:true, title:d=>`${getLang(d.language_code)} · ${d.release_year}\n${Number(d.track_count).toLocaleString()} titres`
    }),
    Plot.dot(filtered,{x:d=>+d.release_year,y:d=>+d.track_count,stroke:"language_code",r:2})
  ]
}));
```

</div>

<div class="chart-card">
<h3>Part relative par langue (normalisée, %)</h3>

```js
// Compute share per year
const yearTotals = d3.rollup(
  langYear.filter(d=>+d.release_year>=yearRange[0]&&+d.release_year<=yearRange[1]),
  v=>d3.sum(v,d=>+d.track_count), d=>+d.release_year
);
const filteredPct = filtered.map(d=>({
  ...d,
  pct: yearTotals.get(+d.release_year) > 0
    ? +d.track_count / yearTotals.get(+d.release_year) * 100
    : 0
}));

display(Plot.plot({
  width, height:300, marginLeft:50, marginBottom:40,
  x:{label:"Année"},
  y:{label:"Part (%)", grid:true, tickFormat:d=>d.toFixed(0)+"%"},
  color:{domain:langDomain, range:langColors, legend:false},
  marks:[
    Plot.areaY(filteredPct,{
      x:d=>+d.release_year, y:"pct", fill:"language_code",
      order:langDomain, curve:"monotone-x",
      tip:true, title:d=>`${getLang(d.language_code)} · ${d.release_year}\n${d.pct.toFixed(1)}%`
    }),
    Plot.ruleY([0])
  ]
}));
```

</div>

<div class="chart-card">
<h3>Popularité moyenne & durée moyenne par langue</h3>

```js
const popPlot = Plot.plot({
  width:Math.floor(width/2)-8, height:220, marginLeft:52, marginBottom:40,
  x:{label:"Année"},
  y:{label:"Popularité moy.", grid:true},
  color:{domain:langDomain, range:langColors, legend:false},
  marks:[
    Plot.line(filtered,{
      x:d=>+d.release_year, y:d=>+d.avg_track_popularity,
      stroke:"language_code", strokeWidth:2, curve:"monotone-x",
      tip:true, title:d=>`${getLang(d.language_code)} · ${d.release_year}\nPop: ${(+d.avg_track_popularity).toFixed(1)}`
    })
  ]
});
const durPlot = Plot.plot({
  width:Math.floor(width/2)-8, height:220, marginLeft:58, marginBottom:40,
  x:{label:"Année"},
  y:{label:"Durée moy. (min)", grid:true},
  color:{domain:langDomain, range:langColors, legend:true, tickFormat:getLang, columns:4},
  marks:[
    Plot.line(filtered,{
      x:d=>+d.release_year, y:d=>+d.avg_duration_ms/60000,
      stroke:"language_code", strokeWidth:2, curve:"monotone-x",
      tip:true, title:d=>`${getLang(d.language_code)} · ${d.release_year}\nDurée: ${(+d.avg_duration_ms/60000).toFixed(2)} min`
    })
  ]
});
const g=document.createElement("div");
g.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:16px;";
g.append(popPlot,durPlot); display(g);
```

</div>

## Tableau récapitulatif · ${yearRange[0]}–${yearRange[1]}

```js
const summary = allLangs.slice(0,15).map(code => {
  const rows = langYear.filter(d=>d.language_code===code && +d.release_year>=yearRange[0] && +d.release_year<=yearRange[1]);
  if (!rows.length) return null;
  const total = d3.sum(rows, d=>+d.track_count);
  const avgPop = d3.mean(rows, d=>+d.avg_track_popularity);
  const avgDur = d3.mean(rows, d=>+d.avg_duration_ms);
  const popTrend = rows.length > 4
    ? (+(rows[rows.length-1].avg_track_popularity) - +(rows[0].avg_track_popularity)).toFixed(1)
    : "—";
  return {code, label:getLang(code), total, avgPop, avgDur, popTrend, color:getColor(code)};
}).filter(Boolean);

const maxTotal = Math.max(...summary.map(d=>d.total));

const table = document.createElement("table");
table.className="stats-table";
table.innerHTML=`<thead><tr>
  <th>Langue</th><th>Total titres</th><th>Pop. moy.</th><th>Durée moy.</th><th>Tendance pop.</th>
</tr></thead>`;
const tbody=document.createElement("tbody");
summary.forEach(d=>{
  const tr=document.createElement("tr");
  tr.innerHTML=`
    <td><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${d.color};margin-right:6px;vertical-align:middle;"></span>${d.label}</td>
    <td><span class="bar-inline" style="width:${(d.total/maxTotal*100).toFixed(0)}px;background:${d.color};"></span>${d.total.toLocaleString()}</td>
    <td>${d.avgPop ? d.avgPop.toFixed(1) : "—"}</td>
    <td>${d.avgDur ? (d.avgDur/60000).toFixed(2)+" min" : "—"}</td>
    <td style="color:${d.popTrend>0?"#1DB954":d.popTrend<0?"#e84040":"var(--theme-foreground-muted)"}">${d.popTrend!=="—"?(d.popTrend>0?"+":"")+d.popTrend:d.popTrend}</td>
  `;
  tbody.appendChild(tr);
});
table.appendChild(tbody);
display(table);
```
