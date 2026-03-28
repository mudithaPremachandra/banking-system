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

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3001

# Run migrations then start the server
# prisma db push creates/syncs the schema without needing committed migration files.
# Switch to "npx prisma migrate deploy" in production once migrations are committed.
CMD ["sh", "-c", "npx prisma db push && node dist/app.js"]
