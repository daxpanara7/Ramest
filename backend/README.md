# Ramest Technolabs — Backend (NestJS + Prisma + PostgreSQL)

Enterprise API powering the admin panel, blog CMS, newsletter, and contact
system. This is a **separate deployable** from the Next.js frontend (which stays
on Vercel). NestJS is a long-running Node server and needs a Node host.

## Status

Foundation in progress. The database model (`prisma/schema.prisma`) is the
keystone and is complete. Modules are built against it as infrastructure comes
online — see the checklist below.

## What you need to provision (blocks the build until supplied)

| # | Service | Recommended | Gives us |
|---|---------|-------------|----------|
| 1 | **PostgreSQL** | [Neon](https://neon.tech) free tier | `DATABASE_URL` |
| 2 | **Node host for NestJS** | [Railway](https://railway.app) / Render | Where the API runs |
| 3 | **Email** | [Resend](https://resend.com) | `RESEND_API_KEY` (Task 12 emails) |
| 4 | **reCAPTCHA v3** | Google reCAPTCHA admin | site + secret keys (Task 04) |
| 5 | **Object storage** | Cloudflare R2 / AWS S3 | media uploads (Task 08) |

Put the values in `backend/.env` (copy from `.env.example`). Nothing here runs
without at least #1 (`DATABASE_URL`).

## Local setup (once DATABASE_URL is set)

```bash
cd backend
npm install
npx prisma migrate dev --name init   # creates tables from schema.prisma
npm run seed                          # seeds roles, permissions, first admin
npm run start:dev                     # API on http://localhost:4000
```

## Module build order

Each maps to a task in the brief. Built in dependency order:

- [x] **Database model** — Task 06 (schema.prisma: users, RBAC, blog, newsletter, leads, media, audit; soft-delete + audit fields + indexes throughout)
- [ ] **Core** — config, Prisma service, global validation pipe, security headers, rate limiting
- [ ] **Auth** — Task 07 (JWT + refresh rotation, Argon2id, RBAC guards, 2FA-ready)
- [ ] **Contact leads + email** — Tasks 11, 12 (the highest-value module: connects the live site's form to a real inbox + DB)
- [ ] **Newsletter** — Task 10 (double opt-in, import/export)
- [ ] **Blog CMS** — Task 09 (draft/schedule/publish, categories, tags, SEO fields, media)
- [ ] **Admin panel UI** — Task 08 (separate Next.js app or route group)
- [ ] **SEO command center** — Task 13

## Security posture (Tasks 04, 15)

- Argon2id password hashing, refresh-token rotation with hashed storage
- All input validated server-side via `class-validator` DTOs (never trust the client)
- reCAPTCHA v3 score check + rate limiting on all public endpoints
- CORS + Origin allow-list from `CORS_ORIGINS`
- Helmet security headers, parameterized queries via Prisma (no raw SQL)
- Secrets only via env, never committed; `.env` is git-ignored
