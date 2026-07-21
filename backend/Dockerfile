# syntax=docker/dockerfile:1
# Multi-stage build for the NestJS backend. Final image ships only production
# deps + compiled dist + the Prisma engine — no source, no dev tooling.

# ---- deps: install ALL deps (dev included) for the build ----
FROM node:20-slim AS deps
WORKDIR /app
# argon2 is a native addon: its install script runs node-gyp-build, which
# compiles from source whenever no prebuilt binary matches this image. Without
# python3/make/g++ that compile fails and `npm ci` exits 1. These stay in the
# build-only stage — the runtime image below is unaffected.
RUN apt-get update -y && apt-get install -y --no-install-recommends \
      openssl python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: generate Prisma client + compile TypeScript ----
FROM node:20-slim AS build
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build
# Strip dev dependencies, then regenerate the Prisma client: prune can drop
# the generated .prisma folder, and the runtime `prisma migrate deploy` needs
# the pinned v6 CLI (prisma is a PROD dependency for exactly this reason —
# if it were pruned, npx would fetch latest v7 at boot, which rejects our
# schema and crash-loops the container).
RUN npm prune --omit=dev && npx prisma generate

# ---- runtime: minimal image, non-root ----
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Run as the built-in unprivileged "node" user, never root.
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/package.json ./package.json
USER node

EXPOSE 4000
# Apply pending migrations, then start. `migrate deploy` is safe and idempotent.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
