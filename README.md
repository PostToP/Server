# PostTop Server

Backend service for PostTop. Provides REST APIs, WebSocket support, PostgreSQL access, and Swagger docs.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL + Kysely
- WebSocket (`ws`)
- Swagger (`/docs`)

## Requirements

- Node.js 20+
- PostgreSQL

## Environment Variables

Create a `.env` file in the project root.


- `DATABASE_URL` - PostgreSQL connection string
- `JWT_TOKEN` - JWT signing secret
- `AI_MODEL_URL` - Is-Music Classifier model endpoint
- `AI_MODEL_URL_NER` - NER model endpoint
- `AI_MODEL_URL_GENRE` - genre model endpoint
- `YT_API_KEY` - YouTube API key
- `LOG_LEVEL` - logger level (default: `debug`)

## Run

```bash
bun install
bun run dev
```

Server starts on `http://localhost:8000`.

## Now Playing Badge

`GET /user/:handle/now-playing.svg` returns an SVG card of what the user is currently listening to,
for embedding in a GitHub profile README:

```markdown
![Now Playing](https://<your-host>/user/<handle>/now-playing.svg)
```

Add `?transparent` (or `?transparent=1` / `?transparent=true`) to drop the background and border,
so the card sits directly on the page behind it.

The card reads live WebSocket state, so it only shows a track while the user has an active session.
The progress bar and the elapsed clock are SMIL animations extrapolated from the playback position at
render time, so the card keeps ticking while it is on screen; they freeze when the track would end.

GitHub proxies README images through its own cache, so a new track appears within a few minutes, not
instantly - and a cached card starts its animation from the position it had when it was generated.

## Scripts

- `bun run dev` - run in development with `bun --watch`
- `bun run build` - typecheck with `tsgo` (Bun runs the TypeScript sources directly)
- `bun run serve` - run the server
- `npm run seed` - run TypeScript DB seed script (local/dev)
- `npm run seed:prod` - run compiled DB seed script (Docker/production)
- `bun run lint` - run Biome checks
- `bun run format` - format code with Biome
- `bun run kysely` - generate Kysely types

## Database Seeding

The seeder is idempotent and can be run multiple times safely.

It currently seeds:

- `role` (`Admin`, `User`)
- `main_category` (core YouTube main categories)
- `category` (common YouTube categories)
- baseline `model` rows for each AI model type if missing

Optional admin bootstrap:

- set `SEED_CREATE_ADMIN=true`
- set `SEED_ADMIN_PASSWORD=<your password>`
- optional: `SEED_ADMIN_USERNAME` (default: `admin`)
- optional: `SEED_ADMIN_EMAIL` (default: `admin@posttop.local`)

Run locally:

```bash
npm run seed
```

## Docker

```bash
docker build -t posttop-server .
docker run --env-file .env -p 8000:8000 posttop-server
```

Run the seeder in Docker (against the same DB from your `.env`):

```bash
docker run --rm --env-file .env posttop-server npm run seed:prod
```

If your database is another container, make sure both containers are on the same Docker network and use the DB container name as host in `DATABASE_URL`.