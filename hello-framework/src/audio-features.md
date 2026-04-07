---
toc: false
---

<style>
.page-title { font-family:var(--sans-serif); text-align:center; margin:2rem 0 1.5rem; }
.page-title h1 {
  font-size:2.2rem; font-weight:900; margin:0 0 .3rem;
  background:linear-gradient(90deg,#e84040,#f5a623,#1DB954);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.page-title p { color:var(--theme-foreground-muted); font-size:.88rem; margin:0; }
.chart-card { background:var(--theme-background-alt); border-radius:12px; padding:16px; margin-bottom:16px; }
.chart-card h3 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); margin:0 0 12px; }
.feat-legend {
  display:flex; flex-wrap:wrap; gap:8px 20px;
  font-family:var(--sans-serif); font-size:12px; margin-top:10px;
}
.feat-legend-item { display:flex; align-items:center; gap:6px; }
.feat-dot { width:12px; height:4px; border-radius:2px; flex-shrink:0; }
.controls-bar {
  display:flex; flex-wrap:wrap; gap:14px; align-items:flex-start;
  background:var(--theme-background-alt); border-radius:12px;
  padding:12px 16px; margin-bottom:18px;
  font-family:var(--sans-serif); font-size:12px;
}
.ctrl-label {
  font-weight:700; font-size:10px; text-transform:uppercase;
  letter-spacing:.06em; color:var(--theme-foreground-muted); margin-bottom:4px;
}
.drs-wrap { position:relative; height:34px; width:100%; min-width:200px; }
.drs-track { position:absolute; left:0; right:0; top:16px; height:2px; background:#ccc; }
.drs-fill  { position:absolute; top:16px; height:2px; background:#f5a623; }
.drs-wrap input[type=range] {
  -webkit-appearance:none; position:absolute; left:0; width:100%; top:0;
  background:transparent; pointer-events:none; margin:0; height:34px;
}
.drs-wrap input[type=range]::-webkit-slider-thumb {
  -webkit-appearance:none; width:15px; height:15px; border-radius:50%;
  background:#f5a623; cursor:pointer; pointer-events:all; border:none; margin-top:-6.5px;
}
.drs-wrap input[type=range]::-moz-range-thumb {
  width:15px; height:15px; border-radius:50%; background:#f5a623;
  cursor:pointer; pointer-events:all; border:none;
}
</style>

<div class="page-title">
  <h1>Audio Features</h1>
  <p>DNA sonore de la musique Spotify · danceability, energy, valence, acousticness, tempo…</p>
</div>

```js
const audioYear  = await FileAttachment("data/audio_features_year.json").json();
const audioLang  = await FileAttachment("data/audio_features_lang_year.json").json();
const audioGenre = await FileAttachment("data/audio_features_genre.json").json();
```

## Évolution globale du son (1970–2025)

Les 4 axes principaux de l'identité sonore d'un titre, moyennés sur l'ensemble du catalogue.

<div class="chart-card">
<h3>Danceability · Energy · Valence · Acousticness — index 0→1</h3>

```js
const features4 = [
  {key:"danceability", label:"Danceability", color:"#1DB954"},
  {key:"energy",       label:"Energy",       color:"#e84040"},
  {key:"valence",      label:"Valence",       color:"#f5a623"},
  {key:"acousticness", label:"Acousticness",  color:"#1a75cc"},
];

const flat4 = audioYear.flatMap(d =>
  features4.map(f => ({year:+d.release_year, feature:f.label, value:+d[f.key]}))
);
const f4colors = features4.map(f=>f.color);
const f4domain = features4.map(f=>f.label);

display(Plot.plot({
  width, height:300, marginLeft:50, marginBottom:40,
  x:{label:"Année"},
  y:{label:"Valeur (0–1)", grid:true, domain:[0,1]},
  color:{domain:f4domain, range:f4colors, legend:true, columns:4},
  marks:[
    Plot.line(flat4,{
      x:"year", y:"value", stroke:"feature",
      strokeWidth:2, curve:"monotone-x",
      tip:true, title:d=>`${d.feature} · ${d.year}\n${d.value.toFixed(3)}`
    }),
    Plot.ruleY([0.5],{stroke:"#ccc",strokeDasharray:"4"})
  ]
}));
```

*Encoding note (rough): data item = one feature-year value for the global catalog. Mark used = line chart, chosen because it best reveals continuity and long-term trends in time series. Visual variables: x-position maps year, y-position maps feature value (0-1), and color hue maps feature name.*

</div>

<div class="chart-card">
<h3>Speechiness · Instrumentalness · Liveness</h3>

```js
const features3 = [
  {key:"speechiness",      label:"Speechiness",      color:"#8e44ad"},
  {key:"instrumentalness", label:"Instrumentalness",  color:"#16a085"},
  {key:"liveness",         label:"Liveness",          color:"#d35400"},
];

const flat3 = audioYear.flatMap(d =>
  features3.map(f => ({year:+d.release_year, feature:f.label, value:+d[f.key]}))
);

display(Plot.plot({
  width, height:240, marginLeft:50, marginBottom:40,
  x:{label:"Année"},
  y:{label:"Valeur (0–1)", grid:true},
  color:{domain:features3.map(f=>f.label), range:features3.map(f=>f.color), legend:true, columns:3},
  marks:[
    Plot.line(flat3,{
      x:"year", y:"value", stroke:"feature",
      strokeWidth:2, curve:"monotone-x",
      tip:true, title:d=>`${d.feature} · ${d.year}\n${d.value.toFixed(3)}`
    })
  ]
}));
```

*Encoding note (rough): data item = one feature-year value for speechiness/instrumentalness/liveness. Mark used = line chart, chosen because it makes it easy to compare smooth temporal evolutions across multiple features. Visual variables: x-position maps year, y-position maps feature value, and color hue maps feature.*

</div>

<div class="chart-card">
<h3>Tempo moyen (BPM)</h3>

```js
display(Plot.plot({
  width, height:200, marginLeft:55, marginBottom:40,
  x:{label:"Année"},
  y:{label:"Tempo (BPM)", grid:true},
  marks:[
    Plot.line(audioYear,{
      x:d=>+d.release_year, y:d=>+d.tempo,
      stroke:"#f5a623", strokeWidth:2.5, curve:"monotone-x"
    }),
    Plot.dot(audioYear,{
      x:d=>+d.release_year, y:d=>+d.tempo,
      fill:"#f5a623", r:3, tip:true,
      title:d=>`${d.release_year}\nTempo: ${(+d.tempo).toFixed(1)} BPM`
    }),
    Plot.ruleY([120],{stroke:"#ccc",strokeDasharray:"4"})
  ]
}));
```

*Encoding note (rough): data item = one year aggregate for tempo. Marks used = line + dots + reference rule, chosen because the line shows continuity, dots confirm discrete yearly observations, and the rule provides a stable benchmark for interpretation. Visual variables: x-position maps year, y-position maps tempo in BPM, color highlights tempo series, and dashed rule gives a baseline at 120 BPM.*

</div>

## Comparaison par genre (top 20)

```js
const genres = audioGenre.map(d=>d.genre);
const gPalette = ["#1DB954","#1a75cc","#e84040","#f5a623","#9b59b6","#e91e8c",
  "#16a085","#d35400","#2980b9","#27ae60","#8e44ad","#c0392b",
  "#17a589","#d68910","#884ea0","#2e86c1","#a93226","#1e8449",
  "#117a65","#6e2f1a"];
const gColor = Object.fromEntries(genres.map((g,i)=>[g,gPalette[i%gPalette.length]]));
```

<div class="chart-card">
<h3>Scatter : Energy vs Danceability (bulles = volume de titres)</h3>

```js
display(Plot.plot({
  width, height:420, marginLeft:55, marginBottom:50,
  x:{label:"Danceability →", grid:true, domain:[0,1]},
  y:{label:"Energy →", grid:true, domain:[0,1]},
  color:{domain:genres, range:genres.map(g=>gColor[g]), legend:true, columns:4},
  r:{range:[4,28]},
  marks:[
    Plot.dot(audioGenre,{
      x:d=>+d.danceability, y:d=>+d.energy,
      r:d=>+d.track_count, fill:"genre", fillOpacity:0.7,
      stroke:"white", strokeWidth:0.5,
      tip:true,
      title:d=>`${d.genre}\nDanceability: ${(+d.danceability).toFixed(3)}\nEnergy: ${(+d.energy).toFixed(3)}\nTitres: ${Number(d.track_count).toLocaleString()}`
    }),
    Plot.text(audioGenre,{
      x:d=>+d.danceability, y:d=>+d.energy,
      text:"genre", fontSize:9, fill:"var(--theme-foreground)", fontWeight:"600",
      dy:-12
    })
  ]
}));
```

*Encoding note (rough): data item = one genre aggregate. Mark used = bubble scatterplot with labels, chosen because scatterplots show relationships between two quantitative dimensions while bubble size adds a third quantitative variable. Visual variables: x-position maps danceability, y-position maps energy, bubble size maps track volume, and color hue maps genre.*

</div>

<div class="chart-card">
<h3>Valence vs Acousticness (humeur × acoustique)</h3>

```js
display(Plot.plot({
  width, height:400, marginLeft:55, marginBottom:50,
  x:{label:"Acousticness →", grid:true, domain:[0,1]},
  y:{label:"Valence (positivité) →", grid:true, domain:[0,1]},
  color:{domain:genres, range:genres.map(g=>gColor[g]), legend:false},
  r:{range:[4,26]},
  marks:[
    Plot.dot(audioGenre,{
      x:d=>+d.acousticness, y:d=>+d.valence,
      r:d=>+d.track_count, fill:"genre", fillOpacity:0.75,
      stroke:"white", strokeWidth:0.5,
      tip:true,
      title:d=>`${d.genre}\nAcousticness: ${(+d.acousticness).toFixed(3)}\nValence: ${(+d.valence).toFixed(3)}\nTitres: ${Number(d.track_count).toLocaleString()}`
    }),
    Plot.text(audioGenre,{
      x:d=>+d.acousticness, y:d=>+d.valence,
      text:"genre", fontSize:9, fill:"var(--theme-foreground)", fontWeight:"600", dy:-11
    }),
    Plot.ruleX([0.5],{stroke:"#ccc",strokeDasharray:"4"}),
    Plot.ruleY([0.5],{stroke:"#ccc",strokeDasharray:"4"})
  ]
}));
```

*Encoding note (rough): data item = one genre aggregate. Mark used = bubble scatterplot with labels and quadrant rules, chosen to compare two continuous variables while using guide rules to quickly separate interpretive zones. Visual variables: x-position maps acousticness, y-position maps valence, bubble size maps track volume, and color hue maps genre.*

</div>

## Audio features par langue (1970–2025)

```js
const langMeta = {
  en:{label:"Anglais",  color:"#1a75cc"}, es:{label:"Espagnol",  color:"#e84040"},
  fr:{label:"Français", color:"#9b59b6"}, de:{label:"Allemand",  color:"#f5a623"},
  pt:{label:"Portugais",color:"#e91e8c"}, ja:{label:"Japonais",  color:"#16a085"},
  it:{label:"Italien",  color:"#d35400"}, ko:{label:"Coréen",    color:"#2980b9"},
};
const mainLangs = Object.keys(langMeta);
const getLang  = c => langMeta[c]?.label ?? c.toUpperCase();
const getColor = c => langMeta[c]?.color ?? "#888";
```

```js
// Year slider
const yr = view((() => {
  const min=1970,max=2025;
  const c=document.createElement("div"); c.style.cssText="display:flex;flex-direction:column;gap:4px;max-width:300px;font-family:var(--sans-serif);font-size:12px;";
  const top=document.createElement("div"); top.style.cssText="display:flex;justify-content:space-between;";
  const lbl=document.createElement("span"); lbl.style.cssText="font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--theme-foreground-muted)"; lbl.textContent="Période";
  const out=document.createElement("span"); out.style.cssText="font-weight:600;color:#f5a623;font-size:12px;"; out.textContent=`${min} – ${max}`; top.append(lbl,out);
  const tw=document.createElement("div"); tw.className="drs-wrap";
  const tr=document.createElement("div"); tr.className="drs-track";
  const fi=document.createElement("div"); fi.className="drs-fill";
  const lo=document.createElement("input"); lo.type="range"; lo.min=min; lo.max=max; lo.value=min;
  const hi=document.createElement("input"); hi.type="range"; hi.min=min; hi.max=max; hi.value=max;
  function u(){const l=Math.min(+lo.value,+hi.value),h=Math.max(+lo.value,+hi.value);fi.style.left=(l-min)/(max-min)*100+"%";fi.style.width=(h-l)/(max-min)*100+"%";out.textContent=`${l} – ${h}`;c.value=[l,h];c.dispatchEvent(new Event("input",{bubbles:true}));}
  lo.addEventListener("input",()=>{if(+lo.value>+hi.value)lo.value=hi.value;u();});
  hi.addEventListener("input",()=>{if(+hi.value<+lo.value)hi.value=lo.value;u();});
  tw.append(tr,fi,lo,hi); c.append(top,tw); u(); return c;
})());
```

```js
// Feature selector
const selFeature = view(Inputs.select(
  ["danceability","energy","valence","acousticness","loudness","tempo"],
  {label:"Feature", value:"danceability",
   format:f=>({danceability:"Danceability",energy:"Energy",valence:"Valence",acousticness:"Acousticness",loudness:"Loudness (dB)",tempo:"Tempo (BPM)"})[f]??f}
));
```

<div class="controls-bar">
  <div class="ctrl-label" style="align-self:center;margin-bottom:0;">Filtres :</div>
  <div><div class="ctrl-label">Période</div>${yr}</div>
  <div><div class="ctrl-label">Feature</div>${selFeature}</div>
</div>

<div class="chart-card">
<h3>${selFeature} par langue · ${yr[0]}–${yr[1]}</h3>

```js
const filtLang = audioLang.filter(d =>
  mainLangs.includes(d.language_code) &&
  +d.release_year >= yr[0] &&
  +d.release_year <= yr[1]
);

const yLabel = {
  danceability:"Danceability", energy:"Energy", valence:"Valence",
  acousticness:"Acousticness", loudness:"Loudness (dB)", tempo:"Tempo (BPM)"
}[selFeature] ?? selFeature;

display(Plot.plot({
  width, height:300, marginLeft:58, marginBottom:40,
  x:{label:"Année"},
  y:{label:yLabel, grid:true},
  color:{
    domain:mainLangs, range:mainLangs.map(getColor),
    legend:true, tickFormat:getLang, columns:4
  },
  marks:[
    Plot.line(filtLang,{
      x:d=>+d.release_year, y:d=>+d[selFeature], stroke:"language_code",
      strokeWidth:2, curve:"monotone-x",
      tip:true, title:d=>`${getLang(d.language_code)} · ${d.release_year}\n${yLabel}: ${(+d[selFeature]).toFixed(3)}`
    })
  ]
}));
```

*Encoding note (rough): data item = one language-year record for the selected feature. Mark used = multi-series line chart, chosen because it supports direct comparison of temporal trajectories between languages. Visual variables: x-position maps year, y-position maps selected feature value, and color hue maps language.*

</div>

## Profil radar par genre (top 8)

```js
// Radar chart — manual SVG (Observable Plot ne supporte pas nativement le radar)
const radarGenres = audioGenre.slice(0,8);
const radarFeats = ["danceability","energy","valence","acousticness","speechiness","instrumentalness"];
const radarLabels = ["Dance","Energy","Valence","Acoustic","Speech","Instrumental"];

const rW=480, rH=420, rCx=rW/2, rCy=rH/2-10, rR=140;
const NS="http://www.w3.org/2000/svg";
const svg=document.createElementNS(NS,"svg");
svg.setAttribute("viewBox",`0 0 ${rW} ${rH}`);
svg.setAttribute("width",Math.min(width,rW)); svg.setAttribute("height",rH);
svg.style.display="block";

// Grid circles
[0.25,0.5,0.75,1].forEach(r=>{
  const c=document.createElementNS(NS,"circle");
  c.setAttribute("cx",rCx); c.setAttribute("cy",rCy);
  c.setAttribute("r",rR*r);
  c.setAttribute("fill","none"); c.setAttribute("stroke","#ddd"); c.setAttribute("stroke-width","1");
  svg.appendChild(c);
});

// Axes + labels
radarFeats.forEach((feat,i)=>{
  const angle=-Math.PI/2 + (i/radarFeats.length)*2*Math.PI;
  const x=rCx+rR*Math.cos(angle), y=rCy+rR*Math.sin(angle);
  const line=document.createElementNS(NS,"line");
  line.setAttribute("x1",rCx); line.setAttribute("y1",rCy);
  line.setAttribute("x2",x); line.setAttribute("y2",y);
  line.setAttribute("stroke","#ddd"); line.setAttribute("stroke-width","1");
  svg.appendChild(line);
  const lx=rCx+(rR+18)*Math.cos(angle), ly=rCy+(rR+18)*Math.sin(angle);
  const txt=document.createElementNS(NS,"text");
  txt.setAttribute("x",lx); txt.setAttribute("y",ly);
  txt.setAttribute("text-anchor","middle"); txt.setAttribute("dominant-baseline","middle");
  txt.setAttribute("font-size","11"); txt.setAttribute("font-weight","700");
  txt.setAttribute("font-family","var(--sans-serif)"); txt.setAttribute("fill","var(--theme-foreground-muted)");
  txt.textContent=radarLabels[i]; svg.appendChild(txt);
});

// Genre polygons
radarGenres.forEach((g,gi)=>{
  const col=gColor[g.genre]??gPalette[gi%gPalette.length];
  const pts=radarFeats.map((feat,i)=>{
    const angle=-Math.PI/2+(i/radarFeats.length)*2*Math.PI;
    const val=Math.min(1,Math.max(0,+g[feat]));
    return [rCx+rR*val*Math.cos(angle), rCy+rR*val*Math.sin(angle)];
  });
  const poly=document.createElementNS(NS,"polygon");
  poly.setAttribute("points",pts.map(p=>p.join(",")).join(" "));
  poly.setAttribute("fill",col); poly.setAttribute("fill-opacity","0.15");
  poly.setAttribute("stroke",col); poly.setAttribute("stroke-width","2");
  const t=document.createElementNS(NS,"title");
  t.textContent=g.genre+"\n"+radarFeats.map((f,i)=>`${radarLabels[i]}: ${(+g[f]).toFixed(3)}`).join("\n");
  poly.appendChild(t); svg.appendChild(poly);
});

// Legend
const legY=rH-80;
radarGenres.forEach((g,i)=>{
  const col=gColor[g.genre]??gPalette[i%gPalette.length];
  const x=(i%4)*120+20, y=legY+Math.floor(i/4)*20;
  const r=document.createElementNS(NS,"rect");
  r.setAttribute("x",x); r.setAttribute("y",y-7);
  r.setAttribute("width",12); r.setAttribute("height",5);
  r.setAttribute("fill",col); r.setAttribute("rx","2");
  const t=document.createElementNS(NS,"text");
  t.setAttribute("x",x+16); t.setAttribute("y",y);
  t.setAttribute("font-size","10"); t.setAttribute("font-family","var(--sans-serif)");
  t.setAttribute("fill","var(--theme-foreground)"); t.setAttribute("dominant-baseline","middle");
  t.textContent=g.genre.length>14?g.genre.slice(0,13)+"…":g.genre;
  svg.appendChild(r); svg.appendChild(t);
});

display(svg);
```

*Encoding note (rough): data item = one genre profile across several audio features. Mark used = radar polygons (custom SVG), chosen because it gives an at-a-glance shape profile for multivariate comparison across genres. Visual variables: radial distance maps feature value (0-1), angle maps feature dimension, and color hue maps genre.*
