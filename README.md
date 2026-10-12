# Internship Records REST API

A beginner-friendly REST API built with Node.js, Express, and SQLite. It provides CRUD operations, request validation, pagination, sample records, and consistent JSON responses.

## Requirements

- Node.js 18 or later
- npm

## Setup

```bash
npm install
npm run seed
npm start
```

The API runs at `http://localhost:3000`. SQLite creates `internships.sqlite` automatically in the project directory. To choose another database directory, set `DATA_DIR` to a writable directory.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/internships?page=1&limit=10` | List records with pagination |
| GET | `/api/internships/:id` | Read one record |
| POST | `/api/internships` | Create a record |
| PUT | `/api/internships/:id` | Replace/update a record |
| DELETE | `/api/internships/:id` | Delete a record |

Pagination defaults to `page=1` and `limit=10`. `limit` must be from 1 to 100.

## Create example

Send `POST /api/internships` with `Content-Type: application/json`:

```json
{
  "title": "Product Analyst Intern",
  "company": "Example Company",
  "location": "Hyderabad, Telangana",
  "mode": "Hybrid",
  "description": "Help analyze product usage data and prepare weekly reports.",
  "application_url": "https://example.com/apply/product-analyst",
  "is_active": true
}
```

The `mode` must be `Remote`, `Hybrid`, or `On-site`. Required fields must be non-empty. URLs must use HTTP or HTTPS. `is_active` accepts a boolean or 0/1.

## Response format

Successful list response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": ["title is required and must be a non-empty string"]
  }
}
```

Status codes: `200` success, `201` created, `400` invalid input, `404` missing record or route, and `500` unexpected server error.

## Try it

With the server running:

```bash
curl http://localhost:3000/health
curl "http://localhost:3000/api/internships?page=1&limit=10"
curl http://localhost:3000/api/internships/1
```

Example create request using curl:

```bash
curl -X POST http://localhost:3000/api/internships \
  -H "Content-Type: application/json" \
  -d '{"title":"QA Intern","company":"Acme","location":"Hyderabad","mode":"Remote","description":"Test web applications and report defects.","application_url":"https://example.com/apply"}'
```

## Tests

```bash
npm test
```

The tests cover input validation. For full integration testing, run the API and exercise each endpoint with curl or an API client.

## Project files

- `server.js` — Express routes and response handling
- `db.js` — SQLite connection and schema initialization
- `schema.sql` — database table definition
- `validation.js` — request validation
- `seed-data.json` — fictional example records
- `seed.js` — inserts sample records without duplicating matching title/company pairs
- `server.test.js` — validation tests

## Deployment notes

Deploy as a Node.js web service, not GitHub Pages. Set the service start command to `npm start` and use the host-provided `PORT`. If the host filesystem is ephemeral, configure persistent storage and set `DATA_DIR` to its mount path so SQLite data survives restarts and redeploys.

## Sample data notice

All organizations and links in `seed-data.json` are fictional examples. The `example.com` URLs are placeholders, not real internship application pages.
