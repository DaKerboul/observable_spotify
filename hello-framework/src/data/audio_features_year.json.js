import { query } from "./_db.js";

const rows = await query(`
  SELECT
    release_year,
    COUNT(*) AS track_count,
    ROUND(AVG(danceability)::numeric, 4) AS danceability,
    ROUND(AVG(energy)::numeric, 4) AS energy,
    ROUND(AVG(valence)::numeric, 4) AS valence,
    ROUND(AVG(tempo)::numeric, 2) AS tempo,
    ROUND(AVG(acousticness)::numeric, 4) AS acousticness,
    ROUND(AVG(loudness)::numeric, 3) AS loudness,
    ROUND(AVG(speechiness)::numeric, 4) AS speechiness,
    ROUND(AVG(instrumentalness)::numeric, 4) AS instrumentalness,
    ROUND(AVG(liveness)::numeric, 4) AS liveness
  FROM track_details
  WHERE release_year BETWEEN 1970 AND 2025
  GROUP BY release_year
  ORDER BY release_year
`);

process.stdout.write(JSON.stringify(rows));
