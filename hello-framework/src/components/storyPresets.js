/**
 * Presets de la visite guidée.
 *
 * config :
 *   yearRange   – [min, max]
 *   decoupage   – "genre" | "langue" | "aucun"
 *   normaliser  – true | false
 *   diviserPar  – "aucun" | "genre" | "langue"  (défaut: "aucun")
 *   genres      – string[] | null   (null = ne pas toucher)
 *   langs       – string[] | null   (null = ne pas toucher)
 *   openOverlay – true  → lien cliquable vers la popup audio
 *
 * {overlay}…{/overlay} dans le texte = lien vers la popup.
 */
export const PRESETS = [
  {
    title: "Étape 1",
    text: "",
    config: {
      yearRange: [1970, 2000],
      decoupage: "genre",
      diviserPar: "aucun",
      normaliser: false,
      genres: null,
      langs: null
    }
  },
  {
    title: "Étape 2",
    text: "",
    config: {
      yearRange: [1988, 2025],
      decoupage: "genre",
      diviserPar: "aucun",
      normaliser: false,
      genres: null,
      langs: null
    }
  },
  {
    title: "Étape 3",
    text: "",
    config: {
      yearRange: [1970, 2025],
      decoupage: "genre",
      diviserPar: "aucun",
      normaliser: true,
      genres: null,
      langs: null
    }
  },
  {
    title: "Étape 4",
    text: "",
    config: {
      yearRange: [2000, 2025],
      decoupage: "langue",
      diviserPar: "aucun",
      normaliser: false,
      genres: null,
      langs: null
    }
  },
  {
    title: "Étape 5",
    text: "",
    config: {
      yearRange: [1970, 2025],
      decoupage: "genre",
      diviserPar: "langue",
      normaliser: false,
      genres: ["pop", "hip hop", "rock"],
      langs: null
    }
  },
  {
    title: "Étape 6 – Overlay",
    text: "{overlay}Ouvrir l'analyse détaillée{/overlay}",
    config: {
      yearRange: [1970, 2025],
      decoupage: "genre",
      diviserPar: "aucun",
      normaliser: false,
      genres: null,
      langs: null,
      openOverlay: true
    }
  }
];
