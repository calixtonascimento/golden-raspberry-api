import { database } from '../database/database.js';

interface WinningMovie {
  year: number;
  producers: string;
}

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

function getWinningMovies(): WinningMovie[] {
  return database
    .prepare(`
      SELECT year, producers
      FROM movies
      WHERE winner = 1
      ORDER BY year ASC
    `)
    .all() as unknown as WinningMovie[];
}

function parseProducers(producers: string): string[] {
  return producers
    .split(/\s+and\s+|,\s*/)
    .map((producer) => producer.trim())
    .filter(Boolean);
}

export function getProducerIntervals(): ProducerIntervalResponse {
  const winningMovies = getWinningMovies();

  const winsByProducer = new Map<string, number[]>();

  for (const movie of winningMovies) {
    const producers = parseProducers(movie.producers);

    for (const producer of producers) {
      const wins = winsByProducer.get(producer) ?? [];
      wins.push(movie.year);
      winsByProducer.set(producer, wins);
    }
  }

  const intervals: ProducerInterval[] = [];

  for (const [producer, wins] of winsByProducer.entries()) {
    if (wins.length < 2) {
      continue;
    }

    wins.sort((a, b) => a - b);

    for (let index = 1; index < wins.length; index++) {
      const previousWin = wins[index - 1];
      const followingWin = wins[index];

      if (previousWin === undefined || followingWin === undefined) {
        continue;
      }

      intervals.push({
        producer,
        interval: followingWin - previousWin,
        previousWin,
        followingWin,
      });
    }
  }

    if (intervals.length === 0) {
        return {
            min: [],
            max: [],
        };
    }

    const minInterval = Math.min(...intervals.map((item) => item.interval));
    const maxInterval = Math.max(...intervals.map((item) => item.interval));

    return {
        min: intervals.filter((item) => item.interval === minInterval),
        max: intervals.filter((item) => item.interval === maxInterval),
    };
}