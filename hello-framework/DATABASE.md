# Database Schema — Spotify Analytics

**Host:** `kerboul.me:15433`  
**Database:** `spotify`  
**User:** `spotify`

---

## Tables

### `track_details` — 9 879 454 rows (~2.4 GB)

Individual track records with audio features and metadata.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `track_id` | text | NO | Unique track identifier |
| `track_name` | text | YES | Track title |
| `artists` | text | YES | Artist name(s) |
| `album_name` | text | YES | Album title |
| `duration_ms` | integer | YES | Duration in milliseconds |
| `track_popularity` | integer | YES | Spotify popularity score (0–100) |
| `genres` | text | YES | Pipe-separated genres: `"pop \| rock \| indie"` |
| `language_code` | text | YES | ISO 639-1 language code (e.g. `en`, `fr`) |
| `release_year` | integer | YES | Year of release |
| `tempo` | real | YES | BPM |
| `danceability` | real | YES | 0.0–1.0 |
| `energy` | real | YES | 0.0–1.0 |
| `acousticness` | real | YES | 0.0–1.0 |
| `valence` | real | YES | 0.0–1.0 (musical positiveness) |
| `loudness` | real | YES | dB (typically –60 to 0) |
| `speechiness` | real | YES | 0.0–1.0 |
| `instrumentalness` | real | YES | 0.0–1.0 |
| `liveness` | real | YES | 0.0–1.0 |
| `key` | integer | YES | Pitch class (0=C … 11=B), –1 = unknown |
| `mode` | integer | YES | 1 = Major, 0 = Minor |
| `time_signature` | integer | YES | Estimated beats per bar |

> **Note:** `genres` contains multiple genres separated by ` | `. Use  
> `LATERAL unnest(string_to_array(genres, ' | '))` to expand.  
> For performance on large scans use `TABLESAMPLE SYSTEM(n)`.

---

### `agg_genre_language_year` — 70 615 rows (~8 MB)

Pre-aggregated counts and averages per (genre, language, year).

| Column | Type | Description |
|--------|------|-------------|
| `genre` | text | Genre name |
| `language_code` | text | ISO 639-1 language code |
| `release_year` | bigint | Year |
| `row_count` | bigint | Number of raw rows aggregated |
| `track_count` | bigint | Number of distinct tracks |
| `avg_duration_ms` | real | Average track duration (ms) |
| `avg_track_popularity` | real | Average Spotify popularity score |

---

### `agg_genre_year` — 28 861 rows (~3 MB)

Pre-aggregated counts and averages per (genre, year) — no language split.

| Column | Type | Description |
|--------|------|-------------|
| `genre` | text | Genre name |
| `release_year` | bigint | Year |
| `row_count` | bigint | Number of raw rows aggregated |
| `track_count` | bigint | Number of distinct tracks |
| `avg_duration_ms` | real | Average track duration (ms) |
| `avg_track_popularity` | real | Average Spotify popularity score |

---

### `agg_language_year` — 337 rows (~88 kB)

Pre-aggregated counts and averages per (language, year).

| Column | Type | Description |
|--------|------|-------------|
| `language_code` | text | ISO 639-1 language code |
| `release_year` | bigint | Year |
| `row_count` | bigint | Number of raw rows aggregated |
| `track_count` | bigint | Number of distinct tracks |
| `avg_duration_ms` | real | Average track duration (ms) |
| `avg_track_popularity` | real | Average Spotify popularity score |

---

## Observable Data Loaders (src/data/)

| File | Source table | Description |
|------|-------------|-------------|
| `genre_language_year.json.js` | `agg_genre_language_year` | Genre × language × year aggregates |
| `genre_year.json.js` | `agg_genre_year` | Genre × year aggregates |
| `language_year.json.js` | `agg_language_year` | Language × year aggregates |
| `audio_features_genre.json.js` | `track_details` (TABLESAMPLE 15%) | Audio feature averages by top genre |
| `audio_features_year.json.js` | `track_details` | Audio feature averages by year |
| `audio_features_lang_year.json.js` | `track_details` | Audio features by language × year |

All loaders import `query()` from `./_db.js`, which reads connection params from the `.env` file at the project root or falls back to hard-coded defaults for the shared server.

---

## Connection (Node.js)

```js
import { query } from "./src/data/_db.js";
const rows = await query("SELECT * FROM agg_language_year LIMIT 10");
```

Or directly via `psql`:
```bash
PGPASSWORD="Sp0tify-DB-2026!Kerboul" psql -h kerboul.me -p 15433 -U spotify -d spotify
```
