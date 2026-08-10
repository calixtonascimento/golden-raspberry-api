import { createServer } from 'node:http';

import { initializeDatabase } from './database/database.js';
import { loadMovies } from './database/load-movies.js';

const port = 3000;

initializeDatabase();
loadMovies();

const server = createServer((request, response) => {
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });

  response.end(
    JSON.stringify({
      status: 'ok',
    }),
  );
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});