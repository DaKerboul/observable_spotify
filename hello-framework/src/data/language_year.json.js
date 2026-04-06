import { query } from "./_db.js";

const rows = await query(`
  SELECT language_code, release_year, track_count, avg_duration_ms, avg_track_popularity
  FROM agg_language_year
  WHERE release_year BETWEEN 1960 AND 2025
  ORDER BY release_year, language_code
`);

process.stdout.write(JSON.stringify(rows));
