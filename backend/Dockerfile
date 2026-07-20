# syntax=docker/dockerfile:1
# Multi-stage build for the NestJS backend. Final image ships only production
# deps + compiled dist + the Prisma engine — no source, no dev tooling.

# ---- deps: install ALL deps (dev included) for the build ----
FROM node:20-slim AS deps
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: generate Prisma client + compile TypeScript ----
FROM node:20-slim AS build
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build
# Strip dev dependencies from node_modules for the runtime image
RUN npm prune --omit=dev

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
