import { query } from "./_db.js";

// TABLESAMPLE SYSTEM(15) for speed — averages are statistically stable at this scale
const rows = await query(`
  SELECT
    language_code,
    release_year,
    COUNT(*) AS track_count,
    ROUND(AVG(danceability)::numeric, 4) AS danceability,
    ROUND(AVG(energy)::numeric, 4)       AS energy,
    ROUND(AVG(valence)::numeric, 4)      AS valence,
    ROUND(AVG(tempo)::numeric, 2)        AS tempo,
    ROUND(AVG(acousticness)::numeric, 4) AS acousticness,
    ROUND(AVG(loudness)::numeric, 3)     AS loudness
  FROM track_details TABLESAMPLE SYSTEM(15)
  WHERE release_year BETWEEN 1970 AND 2025
    AND language_code IN ('en','fr','es','de','pt','ja','it','ko','tr','ru','pl','nl','ar','sv','hi')
  GROUP BY language_code, release_year
  HAVING COUNT(*) > 5
  ORDER BY language_code, release_year
`);

process.stdout.write(JSON.stringify(rows));
