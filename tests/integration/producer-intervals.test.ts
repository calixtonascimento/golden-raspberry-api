import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

import { createApp } from '../../src/app.js';
import { initializeDatabase } from '../../src/database/database.js';
import { loadMovies } from '../../src/database/load-movies.js';

let server: Server;
let baseUrl: string;

before(async () => {
  initializeDatabase();
  loadMovies();

  server = createApp();

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address() as AddressInfo;

  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});

test('returns producers with minimum and maximum award intervals', async () => {
  const response = await fetch(`${baseUrl}/producers/intervals`);

  assert.equal(response.status, 200);

  const body = await response.json();

  assert.deepEqual(body, {
    min: [
      {
        producer: 'Joel Silver',
        interval: 1,
        previousWin: 1990,
        followingWin: 1991,
      },
    ],
    max: [
      {
        producer: 'Matthew Vaughn',
        interval: 13,
        previousWin: 2002,
        followingWin: 2015,
      },
    ],
  });
});