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
