import { query } from "./_db.js";

const rows = await query(`
  SELECT genre, release_year, track_count, avg_duration_ms, avg_track_popularity
  FROM agg_genre_year
  WHERE release_year BETWEEN 1970 AND 2025
  ORDER BY release_year, genre
`);

process.stdout.write(JSON.stringify(rows));
