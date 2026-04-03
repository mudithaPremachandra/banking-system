# =============================================================================
# Auth Service Dockerfile
# OWNER: Muditha (DevOps), Sandun (Auth Service Developer)
#
# TODO (Muditha):
# 1. Add a wait-for-it script to ensure PostgreSQL is ready before starting
# 2. Add non-root user for security
# 3. Add HEALTHCHECK instruction
# 4. Consider running prisma migrate deploy in production
# =============================================================================
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/root/.cache/prisma \
    npm config set fetch-timeout 600000 && npm install

COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.cache/prisma \
    npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3001

# Run migrations then start the server
# prisma db push creates/syncs the schema without needing committed migration files.
# Switch to "npx prisma migrate deploy" in production once migrations are committed.
CMD ["sh", "-c", "npx prisma db push && npx ts-node prisma/seed.ts && node dist/app.js"]
