/**
 * Language distribution donut/pie chart.
 *
 * @param {Array}    langPieData   - [{lang, label, count, color}, ...]
 * @param {number}   pieTotal      - sum of all counts
 * @param {string[]} selectedLangs - currently selected language codes
 * @param {Function} toggleLang    - (langCode: string) => void
 * @returns {HTMLElement}
 */
export function langPieChart(langPieData, pieTotal, selectedLangs, toggleLang) {
  const PW = 300, PH = 310, cx = 150, cy = 145;
  const R_sel = 141, R_out = 133, R_in = 97, R_sep = 94, R_grv = 91, R_lbl = 36, R_hole = 15;
  const NS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${PW} ${PH}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", PH);
  svg.style.overflow = "visible";

  // ── Defs ──────────────────────────────────────────────────────────────────
  const defs = document.createElementNS(NS, "defs");

  const rg = document.createElementNS(NS, "radialGradient");
  rg.id = "idx-cdGrv";
  rg.setAttribute("cx", "40%"); rg.setAttribute("cy", "35%"); rg.setAttribute("r", "65%");
  for (const [offset, color] of [["0%", "#2e2e45"], ["45%", "#0f0f1c"], ["100%", "#070710"]]) {
    const s = document.createElementNS(NS, "stop");
    s.setAttribute("offset", offset);
    s.setAttribute("stop-color", color);
    rg.appendChild(s);
  }
  defs.appendChild(rg);

  const iridStops = [
    [0,   "#ff004408", "#ffaa0012", "#00ff4408", "#0044ff08"],
    [72,  "#0044ff08", "#aa00ff10", "#ff004408", "#00ffaa08"],
    [144, "#00ffaa08", "#ffff0010", "#ff00aa08", "#44aaff08"],
  ];
  iridStops.forEach(([ang, ...stops], i) => {
    const lg = document.createElementNS(NS, "linearGradient");
    lg.id = `idx-ird${i}`;
    lg.setAttribute("x1", "0%"); lg.setAttribute("y1", "0%"); lg.setAttribute("x2", "100%"); lg.setAttribute("y2", "100%");
    lg.setAttribute("gradientTransform", `rotate(${ang},0.5,0.5)`);
    stops.forEach((col, j) => {
      const s = document.createElementNS(NS, "stop");
      s.setAttribute("offset", `${j / (stops.length - 1) * 100}%`);
      s.setAttribute("stop-color", col);
      lg.appendChild(s);
    });
    defs.appendChild(lg);
  });

  const cp  = document.createElementNS(NS, "clipPath"); cp.id = "idx-grpClip";
  const cpc = document.createElementNS(NS, "circle");
  cpc.setAttribute("cx", cx); cpc.setAttribute("cy", cy); cpc.setAttribute("r", R_grv);
  cp.appendChild(cpc);
  defs.appendChild(cp);
  svg.appendChild(defs);

  // ── Outer ring body ────────────────────────────────────────────────────────
  const body = document.createElementNS(NS, "circle");
  body.setAttribute("cx", cx); body.setAttribute("cy", cy);
  body.setAttribute("r", R_sel + 3); body.setAttribute("fill", "#aeb3b8");
  svg.appendChild(body);

  // ── Arc path helper ────────────────────────────────────────────────────────
  function arcPath(a0, a1, Ro, Ri) {
    const x0 = cx + Ro * Math.cos(a0), y0 = cy + Ro * Math.sin(a0);
    const x1 = cx + Ro * Math.cos(a1), y1 = cy + Ro * Math.sin(a1);
    const x2 = cx + Ri * Math.cos(a1), y2 = cy + Ri * Math.sin(a1);
    const x3 = cx + Ri * Math.cos(a0), y3 = cy + Ri * Math.sin(a0);
    const lf = (a1 - a0) > Math.PI ? 1 : 0;
    return `M${x0},${y0}A${Ro},${Ro} 0 ${lf},1 ${x1},${y1}L${x2},${y2}A${Ri},${Ri} 0 ${lf},0 ${x3},${y3}Z`;
  }

  // ── Pie segments ───────────────────────────────────────────────────────────
  let cum = -Math.PI / 2;
  const arcData = langPieData.map((d) => {
    const span = (2 * Math.PI) / langPieData.length;
    const a0 = cum, a1 = cum + span;
    cum = a1;
    return { ...d, a0, a1, mid: (a0 + a1) / 2, pct: (d.count / pieTotal * 100).toFixed(1) };
  });

  arcData.forEach((a) => {
    const on = selectedLangs.includes(a.lang);
    const Ro = on ? R_sel : R_out;
    const g  = document.createElementNS(NS, "g"); g.style.cursor = "pointer";
    const p  = document.createElementNS(NS, "path");
    p.setAttribute("d", arcPath(a.a0, a.a1, Ro, R_in));
    p.setAttribute("fill", a.color);
    p.setAttribute("stroke", "rgba(255,255,255,0.55)");
    p.setAttribute("stroke-width", "1.2");
    p.style.opacity = on ? "1" : "0.2";
    const tip = document.createElementNS(NS, "title");
    tip.textContent = `${a.label}: ${a.pct}% · ${a.count.toLocaleString()} titres`;
    p.appendChild(tip);
    g.appendChild(p);

    if (a.a1 - a.a0 > 0.26) {
      const mr = (Ro + R_in) / 2;
      const t  = document.createElementNS(NS, "text");
      t.setAttribute("x", cx + mr * Math.cos(a.mid));
      t.setAttribute("y", cy + mr * Math.sin(a.mid));
      t.setAttribute("text-anchor", "middle"); t.setAttribute("dominant-baseline", "middle");
      t.setAttribute("fill", "#fff"); t.setAttribute("font-size", "8"); t.setAttribute("font-weight", "800");
      t.setAttribute("font-family", "var(--sans-serif)"); t.style.pointerEvents = "none";
      t.textContent = a.lang.toUpperCase();
      g.appendChild(t);
    }

    g.addEventListener("click", () => toggleLang(a.lang));
    svg.appendChild(g);
  });

  // ── Vinyl groove decoration ────────────────────────────────────────────────
  const sep = document.createElementNS(NS, "circle");
  sep.setAttribute("cx", cx); sep.setAttribute("cy", cy); sep.setAttribute("r", R_sep); sep.setAttribute("fill", "#c8cdd4");
  svg.appendChild(sep);

  const grv = document.createElementNS(NS, "circle");
  grv.setAttribute("cx", cx); grv.setAttribute("cy", cy); grv.setAttribute("r", R_grv); grv.setAttribute("fill", "url(#idx-cdGrv)");
  svg.appendChild(grv);

  for (let i = 0; i < 3; i++) {
    const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", cx - R_grv); r.setAttribute("y", cy - R_grv);
    r.setAttribute("width", R_grv * 2); r.setAttribute("height", R_grv * 2);
    r.setAttribute("fill", `url(#idx-ird${i})`); r.setAttribute("clip-path", "url(#idx-grpClip)");
    svg.appendChild(r);
  }

  for (let rr = R_lbl + 5; rr < R_grv - 1; rr += 3.2) {
    const ring = document.createElementNS(NS, "circle");
    ring.setAttribute("cx", cx); ring.setAttribute("cy", cy); ring.setAttribute("r", rr);
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", `rgba(255,255,255,${0.022 + ((rr * 7) % 9) / 700})`);
    ring.setAttribute("stroke-width", "0.65");
    svg.appendChild(ring);
  }

  const hi = document.createElementNS(NS, "path");
  hi.setAttribute("d", arcPath(-1.9, -0.45, R_grv - 5, R_lbl + 7));
  hi.setAttribute("fill", "rgba(255,255,255,0.055)");
  svg.appendChild(hi);

  // ── Center label disk ──────────────────────────────────────────────────────
  const lblDisk = document.createElementNS(NS, "circle");
  lblDisk.setAttribute("cx", cx); lblDisk.setAttribute("cy", cy); lblDisk.setAttribute("r", R_lbl); lblDisk.setAttribute("fill", "#1DB954");
  svg.appendChild(lblDisk);

  const ct = document.createElementNS(NS, "text");
  ct.setAttribute("x", cx); ct.setAttribute("y", cy - 5);
  ct.setAttribute("text-anchor", "middle"); ct.setAttribute("dominant-baseline", "middle");
  ct.setAttribute("font-size", "10"); ct.setAttribute("font-weight", "700");
  ct.setAttribute("font-family", "var(--sans-serif)"); ct.setAttribute("fill", "#fff");
  ct.textContent = pieTotal.toLocaleString();
  //svg.appendChild(ct);

  const cst = document.createElementNS(NS, "text");
  cst.setAttribute("x", cx); cst.setAttribute("y", cy + 8);
  cst.setAttribute("text-anchor", "middle"); cst.setAttribute("font-size", "7");
  cst.setAttribute("font-family", "var(--sans-serif)"); cst.setAttribute("fill", "rgba(255,255,255,0.75)");
  //cst.textContent = "titres";
  svg.appendChild(cst);

  const hole = document.createElementNS(NS, "circle");
  hole.setAttribute("cx", cx); hole.setAttribute("cy", cy); hole.setAttribute("r", R_hole);
  hole.setAttribute("fill", "var(--theme-background)"); hole.setAttribute("stroke", "#666"); hole.setAttribute("stroke-width", "0.5");
  svg.appendChild(hole);

  // ── Legend ────────────────────────────────────────────────────────────────
  const legend = document.createElement("div");
  legend.style.cssText = "margin-top:8px;font-family:var(--sans-serif);font-size:10px;display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;";

  arcData.forEach((d) => {
    const on  = selectedLangs.includes(d.lang);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:4px;cursor:pointer;padding:2px;";

    const dot = document.createElement("span");
    dot.style.cssText = `width:7px;height:7px;border-radius:2px;background:${d.color};flex-shrink:0;opacity:${on ? 1 : 0.35};`;

    const info = document.createElement("span");
    info.style.cssText = `color:${on ? "var(--theme-foreground)" : "var(--theme-foreground-muted)"};`;
    info.textContent   = `${d.label} ${d.pct}%`;

    row.append(dot, info);
    row.addEventListener("click", () => toggleLang(d.lang));
    legend.appendChild(row);
  });

  const wrap = document.createElement("div");
  wrap.append(svg, legend);
  return wrap;
}
