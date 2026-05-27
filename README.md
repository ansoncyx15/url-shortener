# URL Shortener

URL shortener: turn long URLs into short, shareable links and get redirects back to the original destination. Supports user accounts and anonymous guest sessions, optional custom aliases, link expiry, and a per-user log of active links.

## Tech stack

**Front-end**
- Next.js + React
- Tailwind CSS, React Hook Form

**Back-end**
- Ruby on Rails
- MongoDB
- Redis

**Tooling**
- Docker Compose for local development

## How it works

- **Shorten** (`POST /api/urls`): the URL is saved to MongoDB and the
  `short_code → long_url` mapping is cached into Redis.
- **Redirect** (`GET /:short_code`): for low latency, redis will be checked first;
  MongoDB is only hit on a cache miss, then the result is cached. The redirect
  is a 302 so visit counting and expiry stay enforceable.
- **Auth**: login/signup and guest both return a token and stored in
  Redis.

## Quick start

You'll need Docker Desktop running. Everything else (Node, Ruby, MongoDB,
Redis) runs inside the containers.

From the repo root, the first time:

```bash
docker compose up --build
```

After that, just bring it back up — no rebuild needed:

```bash
docker compose up
```

And to stop everything:

```bash
docker compose down
```

Once it's up:

- Front-end: http://localhost:3000
- Backend API: http://localhost:3001

Source directories are bind-mounted, so editing `url-shortener-client/` or
`url-shortener-api/` hot-reloads the running container — you don't rebuild for
code changes. You only need `--build` again when you add a dependency (an npm
package or a gem).

## API surface

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | none | `{ email, password }` → `{ token, email }` |
| POST | `/api/auth/login` | none | `{ email, password }` → `{ token, email }` |
| POST | `/api/auth/guest` | none | Anonymous session token |
| GET | `/api/urls` | bearer (user or guest) | Active links log for the current user or guest |
| POST | `/api/urls` | bearer (user or guest) | `{ long_url, custom_alias?, expires_in? }` → short link |
| GET | `/:short_code` | none | 302 redirect to the original URL |

Quick check that the backend is up — mint a guest token, then shorten a URL with it:

```bash
TOKEN=$(curl -s -X POST localhost:3001/api/auth/guest | sed -E 's/.*"token":"([^"]+)".*/\1/')

curl -s -X POST localhost:3001/api/urls \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"long_url":"https://example.com/some/very/long/path"}'
```
