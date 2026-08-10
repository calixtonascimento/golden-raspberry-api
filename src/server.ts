import { createApp } from './app.js';
import { initializeDatabase } from './database/database.js';
import { loadMovies } from './database/load-movies.js';

const port = 3000;

initializeDatabase();
loadMovies();

const server = createApp();

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});