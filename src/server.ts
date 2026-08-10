import { createServer } from 'node:http';

const port = 3000;

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