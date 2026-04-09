// See https://observablehq.com/framework/config for documentation.
export default {
  title: "Spotify Analytics",

  pages: [
    { name: "Vue d'ensemble", path: "/" },
    { name: "History of Music", path: "/history-of-music" },
    { name: "Tendances par Langue", path: "/language-trends" },
    { name: "Audio Features", path: "/audio-features" },
    { name: "Analyses complementaires", path: "/plus" },
  ],

  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  root: "src",

  // Base path for GitHub Pages deployment
  base: "/observable_spotify/",
};
