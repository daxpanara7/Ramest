# Backend — local testing guide

Everything below runs on your machine against the local `ramest_tech` Postgres.
Nothing is deployed. Nothing external is touched.

## 1. Start the backend

```bash
cd backend
npm run start:prod        # or: node dist/main.js   (server on :4000)
```

To rebuild after code changes: `npm run build` then start again.
(Watch mode `npm run start:dev` also works once dist exists.)

Health check — open in a browser or curl:
- http://localhost:4000/api/health  → `{"status":"ok","db":"up"}`

## 2. Two ways to explore it

### A) Swagger UI — the easy, visual way  ★
Open **http://localhost:4000/api/docs**

1. Click **Authorize** (top right).
2. First get a token: expand `POST /api/auth/login` → **Try it out** → use the
   admin credentials below → **Execute** → copy the `accessToken` from the
   response.
3. Click **Authorize** again, paste the token, **Authorize**, close.
4. Now every locked endpoint is tryable — click any, **Try it out**, **Execute**.

### B) Adminer — see the data
You already have Adminer open. Login: server `localhost`, user `root`,
password `root`, database `ramest_tech`. After you create posts / leads /
subscribers via the API, refresh the tables to see the rows.

## 3. Test credentials (local dev only)

| What | Value |
|---|---|
| Admin email | `admin@ramesttechnolabs.com` |
| Admin password | `Admin@12345` |
| Roles seeded | `admin` (all 20 perms), `editor`, `viewer` |

These come from `backend/.env` (`ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD`).
Re-seed anytime with `npm run seed` (idempotent).
**Change these before any real deployment.**

## 4. Quick curl walkthrough (copy-paste)

```bash
# 1) Login -> capture the access token
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ramesttechnolabs.com","password":"Admin@12345"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['accessToken'])")

# 2) Who am I
curl -s http://localhost:4000/api/auth/me -H "Authorization: Bearer $TOKEN"

# 3) Dashboard stats
curl -s http://localhost:4000/api/dashboard -H "Authorization: Bearer $TOKEN"

# 4) Create a blog post (draft)
curl -s -X POST http://localhost:4000/api/blog/posts \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"My First Post","contentHtml":"<p>Hello world</p>"}'

# 5) List posts
curl -s "http://localhost:4000/api/blog/posts" -H "Authorization: Bearer $TOKEN"

# 6) Public contact form (no auth — what the website calls)
curl -s -X POST http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@acme.com","message":"I need a quote please."}'

# 7) See the leads in the admin API
curl -s "http://localhost:4000/api/leads" -H "Authorization: Bearer $TOKEN"
```

## 5. Endpoint map (62 routes)

- **Auth**: `POST /auth/login · /refresh · /logout`, `GET /auth/me`
- **Dashboard**: `GET /dashboard`
- **Users**: `GET /users`, `GET /users/:id`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`
- **Roles**: `GET /roles`, `GET /roles/:id`, `POST /roles`, `PATCH /roles/:id`, `DELETE /roles/:id`, `GET /permissions`
- **Activity**: `GET /activity`
- **Blog**: `GET/POST /blog/posts`, `GET/PATCH/DELETE /blog/posts/:id`, `POST /blog/posts/:id/publish · /unpublish`, `GET /blog/posts/:id/preview`, `GET /blog/public/posts`, `GET /blog/public/posts/:slug`, `blog/categories`, `blog/tags`
- **Newsletter**: `POST /newsletter/subscribe`, `GET /newsletter/verify`, `GET /newsletter/unsubscribe`, `GET /newsletter/subscribers`, `PATCH/DELETE /newsletter/subscribers/:id`, `GET /newsletter/export`, `POST /newsletter/import`
- **Leads**: `POST /leads` (public), `GET /leads`, `GET /leads/:id`, `PATCH/DELETE /leads/:id`, `GET /leads/export`, `GET /leads/stats`
- **Media**: `POST /media/upload`, `GET /media`, `GET /media/file/:key`, `PATCH/DELETE /media/:id`
- **SEO**: `GET /seo/overview · /content · /metadata-coverage · /schema-status · /technical · /geo · /aeo`

## 6. What to look for while testing

- Log in as admin → everything works.
- Create a `viewer` user (POST /users with the viewer role) → log in as them →
  they can read blog/leads but get **403** on any write. That's RBAC working.
- Every write shows up in `GET /activity` (audit log).
- Deleting a post/lead/subscriber sets `deletedAt` — the row stays in Adminer
  (soft delete), it just disappears from the API lists.

## Notes
- **Emails** are logged to the server console, not sent (no `RESEND_API_KEY`).
  Watch the terminal after a newsletter subscribe or a lead submit.
- **reCAPTCHA** is skipped locally (no key) — the contact form still works.
- Swagger is only exposed in dev, or in prod when `ENABLE_SWAGGER=true`.
