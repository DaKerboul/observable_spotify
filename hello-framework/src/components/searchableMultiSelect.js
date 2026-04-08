/**
 * Searchable multi-select with checkboxes and select-all / deselect-all buttons.
 * Returns an Observable-compatible input element with `.value = string[]`.
 */
export function searchableMultiSelect(items, { label = "", format = (d) => d, value = items } = {}) {
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

  const btnAll   = Object.assign(document.createElement("button"), { textContent: "Tout sélectionner" });
  const btnNone  = Object.assign(document.createElement("button"), { textContent: "Tout désélectionner" });
  const btnReset = Object.assign(document.createElement("button"), { textContent: "Réinitialiser" });
  btnAll.style.cssText   = btnStyle;
  btnNone.style.cssText  = btnStyle;
  btnReset.style.cssText = btnStyle;
  btnRow.append(btnAll, btnNone, btnReset);
  wrapper.appendChild(btnRow);

  const list = document.createElement("div");
  list.style.cssText = "max-height:200px;overflow-y:auto;";

  const checkboxes = items.map((item) => {
    const lbl = document.createElement("label");
    lbl.style.cssText = "display:flex;align-items:center;gap:6px;padding:2px 0;font-size:0.82rem;cursor:pointer;";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = selected.has(item);
    lbl.appendChild(cb);
    lbl.appendChild(document.createTextNode(format(item)));
    lbl.dataset.text = format(item).toLowerCase();
    list.appendChild(lbl);
    return { label: lbl, checkbox: cb, item };
  });
  wrapper.appendChild(list);

  function emit() {
    selected.clear();
    for (const { checkbox, item } of checkboxes) if (checkbox.checked) selected.add(item);
    wrapper.value = [...selected];
    wrapper.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function visibleCheckboxes() {
    const q = search.value.toLowerCase();
    return checkboxes.filter(({ label }) => !q || label.dataset.text.includes(q));
  }

  search.addEventListener("input", () => {
    const q = search.value.toLowerCase();
    for (const { label } of checkboxes) label.style.display = label.dataset.text.includes(q) ? "" : "none";
  });

  for (const { checkbox } of checkboxes) checkbox.addEventListener("change", emit);

  const defaultSet = new Set(value);

  btnAll.addEventListener("click",   () => { for (const { checkbox } of visibleCheckboxes()) checkbox.checked = true;  emit(); });
  btnNone.addEventListener("click",  () => { for (const { checkbox } of visibleCheckboxes()) checkbox.checked = false; emit(); });
  btnReset.addEventListener("click", () => { for (const { checkbox, item } of checkboxes) checkbox.checked = defaultSet.has(item); emit(); });

  wrapper.value = [...selected];
  return wrapper;
}
