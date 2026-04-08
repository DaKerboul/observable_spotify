import { query } from "./_db.js";

// TABLESAMPLE SYSTEM(15) : ~1.5M rows instead of 9.8M - statistically equivalent averages
const rows = await query(`
  SELECT
    release_year,
    COUNT(*) AS track_count,
    ROUND(AVG(danceability)::numeric, 4)      AS danceability,
    ROUND(AVG(energy)::numeric, 4)            AS energy,
    ROUND(AVG(valence)::numeric, 4)           AS valence,
    ROUND(AVG(tempo)::numeric, 2)             AS tempo,
    ROUND(AVG(acousticness)::numeric, 4)      AS acousticness,
    ROUND(AVG(loudness)::numeric, 3)          AS loudness,
    ROUND(AVG(speechiness)::numeric, 4)       AS speechiness,
    ROUND(AVG(instrumentalness)::numeric, 4)  AS instrumentalness,
    ROUND(AVG(liveness)::numeric, 4)          AS liveness
  FROM track_details TABLESAMPLE SYSTEM(15)
  WHERE release_year BETWEEN 1970 AND 2025
  GROUP BY release_year
  HAVING COUNT(*) > 10
  ORDER BY release_year
`);

process.stdout.write(JSON.stringify(rows));
