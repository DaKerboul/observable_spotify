import { query } from "./_db.js";

// Get top 20 genres first from the agg table (fast), then aggregate audio features from track_details
const rows = await query(`
  WITH top_genres AS (
    SELECT genre
    FROM (
      SELECT genre, SUM(track_count) AS total
      FROM agg_genre_year
      WHERE release_year >= 1970
      GROUP BY genre
      ORDER BY total DESC
      LIMIT 20
    ) t
  )
  SELECT
    TRIM(g) AS genre,
    COUNT(*) AS track_count,
    ROUND(AVG(danceability)::numeric, 4) AS danceability,
    ROUND(AVG(energy)::numeric, 4) AS energy,
    ROUND(AVG(valence)::numeric, 4) AS valence,
    ROUND(AVG(tempo)::numeric, 2) AS tempo,
    ROUND(AVG(acousticness)::numeric, 4) AS acousticness,
    ROUND(AVG(loudness)::numeric, 3) AS loudness,
    ROUND(AVG(speechiness)::numeric, 4) AS speechiness,
    ROUND(AVG(instrumentalness)::numeric, 4) AS instrumentalness
  FROM track_details,
       LATERAL unnest(string_to_array(genres, ' | ')) AS g
  WHERE genres IS NOT NULL
    AND release_year >= 1970
    AND TRIM(g) IN (SELECT genre FROM top_genres)
  GROUP BY TRIM(g)
  ORDER BY track_count DESC
`);

process.stdout.write(JSON.stringify(rows));
