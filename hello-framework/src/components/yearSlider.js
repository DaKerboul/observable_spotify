// Inject CSS once per page load (handles the double-range track/fill/thumb styles)
const STYLE_ID = "year-slider-style";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
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
}`;
  document.head.appendChild(s);
}

/**
 * Double-range year slider.
 * Returns an Observable-compatible input element with `.value = [lo, hi]`.
 */
export function yearSlider({ min = 1970, max = 2025, label = "Période" } = {}) {
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

  const tw    = document.createElement("div"); tw.className = "drs-wrap";
  const track = document.createElement("div"); track.className = "drs-track";
  const fill  = document.createElement("div"); fill.className = "drs-fill";
  const lo    = document.createElement("input"); lo.type = "range"; lo.min = min; lo.max = max; lo.value = min;
  const hi    = document.createElement("input"); hi.type = "range"; hi.min = min; hi.max = max; hi.value = max;

  function update() {
    const l = Math.min(+lo.value, +hi.value);
    const h = Math.max(+lo.value, +hi.value);
    fill.style.left  = ((l - min) / (max - min) * 100) + "%";
    fill.style.width = ((h - l)   / (max - min) * 100) + "%";
    out.textContent  = `${l} – ${h}`;
    c.value = [l, h];
    c.dispatchEvent(new Event("input", { bubbles: true }));
  }

  lo.addEventListener("input", () => { if (+lo.value > +hi.value) lo.value = hi.value; update(); });
  hi.addEventListener("input", () => { if (+hi.value < +lo.value) hi.value = lo.value; update(); });

  tw.append(track, fill, lo, hi);
  c.append(top, tw);

  // Programmatic setter for presets / storytelling
  c.setRange = (newLo, newHi) => {
    lo.value = newLo;
    hi.value = newHi;
    update();
  };

  update();
  return c;
}
