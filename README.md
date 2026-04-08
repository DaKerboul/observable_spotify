# Evolution in music production - Observable Framework


Link Observable (Raph) : [https://observablehq.com/d/b649dde58ded7a47](https://observablehq.com/d/b649dde58ded7a47)
(Has a few sketches, and did most of the tests on the first db extract)

Link Observable (Antonin) : [https://observablehq.com/d/7ef3f0147760c7eb](https://observablehq.com/d/7ef3f0147760c7eb)
(Just tried to implement the db and failed miserably, so there is almost nothing, we)
I switched directly to this github project. (https://github.com/arussac-perso/observable_spotify)

Visualization dashboard built with [Observable Framework](https://observablehq.com/framework/) exploring a Spotify dataset (genres, languages, release years).

**Live demo:** https://arussac-perso.github.io/observable_spotify/history-of-music

## Pages
- **Spotify Analytics** - bar charts and stacked area by genre/language with dual-range year filter.
- **History of Music** - stacked area chart + donut chart showing genre evolution over time, filterable by language, period, and genre.

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

**`src`** - This is the “source root” - where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/project-structure#routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

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

## Technical Process Used to Generate the Output Tables

This section describes only how the following four files are generated:

- `agg_genre_language_year.sqlite3`
- `agg_genre_year.sqlite3`
- `agg_language_year.sqlite3`
- `track_details.sqlite3`

### Input Databases Used by the Build Script

The generation script attaches three SQLite sources and runs cross-database SQL joins:

- `spotify_clean.sqlite3` for tracks, albums, artists, track-artist relations, and artist genres
- `spotify_clean_track_files.sqlite3` for language and popularity fields
- `spotify_clean_audio_features.sqlite3` for audio feature metrics

### Shared Preprocessing Before Table Generation

All four outputs are produced from the same filtered and normalized base pipeline:

1. Normalize language values with string cleaning and canonicalization (`lower(trim(...))`).
2. Keep only records with popularity strictly greater than 5.
3. Restrict language values to `en`, `fr`, `ja`, `de`, `es`, and `pl`.
4. Derive `release_year` from album release dates.
5. Keep only years in the interval `[1970, 2025]`.

### Genre-Specific Preparation

For genre-based outputs, the script builds track-genre links with the following logic:

1. Join tracks to artists and artist genres.
2. Normalize genre labels with `lower(trim(genre))`.
3. Rank genres by frequency and keep the top 2000 genres.
4. Build deduplicated `(track_id, genre)` pairs.

### Generation Logic for Each Output File

#### `track_details.sqlite3`

This file is generated as a denormalized track-level table (one row per track). It combines:

- filtered track metadata (`track_id`, name, popularity, language, year)
- concatenated artist names per track
- concatenated genre labels per track (limited to top genres)
- audio features from the audio database (left join)

#### `agg_genre_language_year.sqlite3`

This file is generated by grouping top-genre track pairs by `(genre, language_code, release_year)` and materializing `track_count`.

#### `agg_genre_year.sqlite3`

This file is generated by grouping top-genre track pairs by `(genre, release_year)` and materializing `track_count`.

#### `agg_language_year.sqlite3`

This file is generated from the filtered base track relation (without the genre top-K constraint) by grouping `(language_code, release_year)` and materializing `track_count`.

### Technical Methods Applied in This Generation Step

- SQLite multi-source federation with `ATTACH DATABASE`
- rule-based filtering and normalization
- relational joins across normalized music entities
- top-K pruning for genre dimensionality control
- denormalization for detailed track output
- pre-aggregation for compact trend tables
- indexing and `ANALYZE` to optimize read performance on generated outputs
