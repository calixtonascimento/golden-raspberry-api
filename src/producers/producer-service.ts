import { database } from '../database/database.js';

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervalResponse {
  min: ProducerInterval[];
  max: ProducerInterval[];
}

interface IntervalQueryRow extends ProducerInterval {
  category: 'min' | 'max';
}

export function getProducerIntervals(): ProducerIntervalResponse {
  const rows = database
    .prepare(
      `
      WITH producer_wins AS (
        SELECT
          mp.producer,
          m.year,
          LAG(m.year) OVER (
            PARTITION BY mp.producer
            ORDER BY m.year
          ) AS previousWin
        FROM movies m
        INNER JOIN movie_producers mp
          ON mp.movie_id = m.id
        WHERE m.winner = 1
      ),
      intervals AS (
        SELECT
          producer,
          year - previousWin AS interval,
          previousWin,
          year AS followingWin
        FROM producer_wins
        WHERE previousWin IS NOT NULL
      ),
      bounds AS (
        SELECT
          MIN(interval) AS minInterval,
          MAX(interval) AS maxInterval
        FROM intervals
      )
      SELECT
        'min' AS category,
        producer,
        interval,
        previousWin,
        followingWin
      FROM intervals, bounds
      WHERE interval = minInterval

      UNION ALL

      SELECT
        'max' AS category,
        producer,
        interval,
        previousWin,
        followingWin
      FROM intervals, bounds
      WHERE interval = maxInterval
    `,
    )
    .all() as unknown as IntervalQueryRow[];

  return rows.reduce<ProducerIntervalResponse>(
    (result, { category, ...interval }) => {
      result[category].push(interval);
      return result;
    },
    { min: [], max: [] },
  );
}
