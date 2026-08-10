import { createServer, type Server } from 'node:http';

import { getProducerIntervals } from './producers/producer-service.js';

export function createApp(): Server {
  return createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/producers/intervals') {
      const result = getProducerIntervals();

      response.writeHead(200, {
        'Content-Type': 'application/json',
      });

      response.end(JSON.stringify(result));

      return;
    }

    response.writeHead(404, {
      'Content-Type': 'application/json',
    });

    response.end(
      JSON.stringify({
        message: 'Route not found',
      }),
    );
  });
}