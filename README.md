# Evolution in music production - Observable Framework


Link Observable (Raph) : [https://observablehq.com/d/b649dde58ded7a47](https://observablehq.com/d/b649dde58ded7a47)
(Has a few sketches, and did most of the tests on the first db extract)

Link Observable (Antonin) : [https://observablehq.com/d/7ef3f0147760c7eb](https://observablehq.com/d/7ef3f0147760c7eb)
(Just tried to implement the db and failed miserably, so there is almost nothing, we)
I switched directly to this github project. (https://github.com/arussac-perso/observable_spotify)

Visualization dashboard built with [Observable Framework](https://observablehq.com/framework/) exploring a Spotify dataset (genres, languages, release years).

**Live demo:** https://arussac-perso.github.io/observable_spotify/history-of-music

## Pages
- **Spotify Analytics** — bar charts and stacked area by genre/language with dual-range year filter.
- **History of Music** — stacked area chart + donut chart showing genre evolution over time, filterable by language, period, and genre.

## Run locally
```
npm install
npm run dev
# → http://localhost:3000
```

## Project structure

A typical Framework project looks like this:

```ini
.
├─ src
│  ├─ components
│  │  └─ timeline.js           # an importable module
│  ├─ data
│  │  ├─ launches.csv.js       # a data loader
│  │  └─ events.json           # a static data file
│  ├─ example-dashboard.md     # a page
│  ├─ example-report.md        # another page
│  └─ index.md                 # the home page
├─ .gitignore
├─ observablehq.config.js      # the app config file
├─ package.json
└─ README.md
```

**`src`** - This is the “source root” — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/project-structure#routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`src/index.md`** - This is the home page for your app. You can have as many additional pages as you’d like, but you should always have a home page, too.

**`src/data`** - You can put [data loaders](https://observablehq.com/framework/data-loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`src/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [app configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the app’s title.

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`            | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run deploy`     | Deploy your app to Observable                            |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |


