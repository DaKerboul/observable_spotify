import { query } from "./_db.js";

const rows = await query(`
  WITH top_genres AS (
    SELECT genre
    FROM (
      SELECT genre, SUM(track_count) AS total
      FROM agg_genre_year
      WHERE release_year BETWEEN 1970 AND 2025
      GROUP BY genre
      ORDER BY total DESC
      LIMIT 30
    ) t
  )
  SELECT
    TRIM(g) AS genre,
    release_year,
    COUNT(*) AS track_count,
    ROUND(AVG(tempo)::numeric, 2)                    AS tempo,
    ROUND(AVG(duration_ms)::numeric, 0) / 60000.0    AS avg_duration_min
  FROM track_details TABLESAMPLE SYSTEM(20),
       LATERAL unnest(string_to_array(genres, ' | ')) AS g
  WHERE genres IS NOT NULL
    AND release_year BETWEEN 1970 AND 2025
    AND TRIM(g) IN (SELECT genre FROM top_genres)
  GROUP BY TRIM(g), release_year
  HAVING COUNT(*) > 5
  ORDER BY genre, release_year
`);

process.stdout.write(JSON.stringify(rows));
