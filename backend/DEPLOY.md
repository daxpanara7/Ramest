# Deploying the backend to Render — complete guide

You never upload files to Render manually. Render connects to your **GitHub
repo** and deploys from it automatically on every push to `main` — the same
way Vercel already deploys the frontend.

```
GitHub (daxpanara7/Ramest)
   ├── push → Vercel  → builds the Next.js site  → www.ramesttechnolabs.com
   └── push → Render  → builds backend/Dockerfile → your-api.onrender.com
```

The repo already contains everything Render needs:
- `render.yaml` (repo root) — the Blueprint: defines the API service + a
  managed PostgreSQL, wired together
- `backend/Dockerfile` — multi-stage build; runs migrations on boot
- `backend/.dockerignore`, health check at `/api/health`, fail-fast env
  validation

---

## Step 1 — Create the services (one time, ~5 minutes)

1. Go to https://dashboard.render.com → **New +** → **Blueprint**
2. Connect your GitHub account and pick the **Ramest** repo
3. Render reads `render.yaml` and shows what it will create:
   - Web service **ramest-backend** (Docker, root dir `backend`)
   - PostgreSQL **ramest-postgres** (database `ramest_tech`)
4. Before applying, it asks for the secrets marked `sync: false`:

   | Key | Value |
   |---|---|
   | `JWT_ACCESS_SECRET` | run `openssl rand -base64 48` locally, paste result |
   | `JWT_REFRESH_SECRET` | run it again — must be a *different* value |
   | `RESEND_API_KEY` | leave empty for now (emails just log) |
   | `RECAPTCHA_SECRET_KEY` | leave empty for now (captcha skipped) |

5. **Apply.** First build takes a few minutes. The service is healthy when
   `https://<your-service>.onrender.com/api/health` returns `{"status":"ok","db":"up"}`.

`DATABASE_URL` is injected automatically from the created Postgres — you
never handle it for the deployed service.

## Step 2 — Seed the production database (one time)

Migrations run automatically on every boot (`prisma migrate deploy` in the
Dockerfile). The **seed** (permissions, roles, first admin) is deliberately
manual so you control the admin password:

1. In Render: ramest-postgres → **Info** → copy the **External Database URL**
2. On your machine:

```bash
cd backend
DATABASE_URL="<external-url>" \
ADMIN_EMAIL="admin@ramesttechnolabs.com" \
ADMIN_INITIAL_PASSWORD="<a strong password — NOT Admin@12345>" \
npx ts-node prisma/seed.ts
```

Re-runnable safely (idempotent upserts).

## Step 3 — Point the frontend at the API

In **Vercel** → your project → Settings → Environment Variables:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<your-service>.onrender.com/api` |

Redeploy the frontend. `/admin` on the live site now talks to Render.

## Step 4 — REQUIRED for login to survive reloads: custom domain

The refresh cookie is `sameSite=strict`. `www.ramesttechnolabs.com` and
`*.onrender.com` are **different sites**, so the browser will not send the
cookie cross-site — login works, but the session drops on page reload.

Fix (no code change needed): give the API a subdomain of your own domain —
subdomains are the *same site*, so strict cookies flow.

1. Render → ramest-backend → **Settings → Custom Domains** → add
   `api.ramesttechnolabs.com`
2. At your DNS provider, add the **CNAME** record Render shows
   (`api` → `<your-service>.onrender.com`)
3. Update Vercel `NEXT_PUBLIC_API_URL` to `https://api.ramesttechnolabs.com/api`
   and redeploy

## Ongoing management

- **Deploys**: `git push` to `main` → Render rebuilds automatically. Nothing
  else to do.
- **Logs**: Render service → Logs tab (startup, requests, mail-skipped
  notices, errors)
- **Env changes**: service → Environment tab → edit → auto-redeploys
- **DB browsing**: use the External Database URL in Adminer/TablePlus, or
  `DATABASE_URL="<external-url>" npx prisma studio` from `backend/`
- **Rollback**: service → Events → previous deploy → Rollback

## Honest caveats (read before going live)

1. **Free Postgres is deleted after 30 days** on Render's free tier — it is
   for evaluation only. For real data, upgrade the DB to Starter (~$7/mo) or
   use Neon's free Postgres instead (then set `DATABASE_URL` yourself in the
   service env and delete the Render DB from `render.yaml`).
2. **Free web services sleep** after 15 min idle — first request after that
   takes ~30–60s to wake. Starter removes this.
3. **Media uploads are ephemeral**: the media library currently writes to
   local disk, which Render wipes on every deploy. Fine for testing; real
   media needs S3/R2 (the storage service already has the seam — it activates
   when `STORAGE_*` env vars are set, implementation stub documented).
4. Emails only send once `RESEND_API_KEY` is set; reCAPTCHA only enforces once
   `RECAPTCHA_SECRET_KEY` is set. Both no-op cleanly until then.
