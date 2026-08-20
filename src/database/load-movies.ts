import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'csv-parse/sync';

import { database } from './database.js';

interface MovieCsvRow {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string;
}

function parseProducers(producers: string): string[] {
  return producers
    .split(/\s+and\s+|,\s*/)
    .map((producer) => producer.trim())
    .filter(Boolean);
}

export function loadMovies(): void {
  const csvPath = resolve('data', 'Movielist.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');

  const movies = parse(csvContent, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true,
  }) as MovieCsvRow[];

  const insertMovie = database.prepare(`
    INSERT INTO movies (year, title, studios, producers, winner)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertProducer = database.prepare(`
    INSERT INTO movie_producers (movie_id, producer)
    VALUES (?, ?)
  `);

  for (const movie of movies) {
    const result = insertMovie.run(
      Number(movie.year),
      movie.title,
      movie.studios,
      movie.producers,
      movie.winner.toLowerCase() === 'yes' ? 1 : 0,
    );

    const producers = [...new Set(parseProducers(movie.producers))];

    for (const producer of producers) {
      insertProducer.run(result.lastInsertRowid, producer);
    }
  }
}
