# Golden Raspberry Awards API

RESTful API developed with Node.js and TypeScript to retrieve the producers with the shortest and longest intervals between consecutive Golden Raspberry Awards in the Worst Picture category.

## Requirements

- Node.js 24+
- npm

No external database installation is required. The application uses an embedded SQLite database running entirely in memory.

## Installation

Clone the repository using one of the following options:

**HTTPS**

```bash
git clone https://github.com/calixtonascimento/golden-raspberry-api.git
````

**SSH**

```bash
git clone git@github.com:calixtonascimento/golden-raspberry-api.git
```

Then navigate to the project directory:

```bash
cd golden-raspberry-api
```

Install the dependencies:

```bash
npm install
```

## Running the application

Build the application:

```bash
npm run build
```

Start the server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

When the application starts, the dataset located at:

```text
data/Movielist.csv
```

is automatically loaded into the in-memory SQLite database.

## API

### Get producer award intervals

```http
GET /producers/intervals
```

Returns the producers with the shortest and longest intervals between two consecutive awards.

### Response

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

## Running the integration tests

Run:

```bash
npm test
```

The integration test:

* initializes the in-memory database;
* loads the movies from `data/Movielist.csv`;
* starts the HTTP server on an available port;
* performs an HTTP request to the producer intervals endpoint;
* validates the response against the provided dataset.