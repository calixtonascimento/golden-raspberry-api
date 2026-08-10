import { DatabaseSync } from 'node:sqlite';

export const database = new DatabaseSync(':memory:');

export function initializeDatabase(): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      studios TEXT NOT NULL,
      producers TEXT NOT NULL,
      winner INTEGER NOT NULL DEFAULT 0
    );
  `);
}