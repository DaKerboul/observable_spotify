export const langMeta = {
  en: { label: "Anglais",      color: "#1a75cc" },
  es: { label: "Espagnol",     color: "#e84040" },
  fr: { label: "Français",     color: "#9b59b6" },
  de: { label: "Allemand",     color: "#f5a623" },
  pt: { label: "Portugais",    color: "#e91e8c" },
  ja: { label: "Japonais",     color: "#16a085" },
  it: { label: "Italien",      color: "#d35400" },
  ko: { label: "Coréen",       color: "#2980b9" },
  tr: { label: "Turc",         color: "#8e44ad" },
  ru: { label: "Russe",        color: "#c0392b" },
  pl: { label: "Polonais",     color: "#27ae60" },
  nl: { label: "Néerlandais",  color: "#1abc9c" },
  ar: { label: "Arabe",        color: "#f39c12" },
  sv: { label: "Suédois",      color: "#3498db" },
  hi: { label: "Hindi",        color: "#e74c3c" },
};

export const getLang      = (code) => langMeta[code]?.label ?? code.toUpperCase();
export const getLangColor = (code) => langMeta[code]?.color ?? "#888";

// Flat label map for Inputs.select format helpers
export const langLabel = Object.fromEntries(
  Object.entries(langMeta).map(([k, v]) => [k, v.label])
);
