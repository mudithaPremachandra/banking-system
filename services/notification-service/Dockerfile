# =============================================================================
# Notification Service Dockerfile
# OWNER: Muditha (DevOps), Geethika (Notification Service Developer)
#
# TODO (Muditha):
# 1. Add wait-for-it script for PostgreSQL
# 2. Add non-root user
# 3. Add HEALTHCHECK
# =============================================================================
FROM node:20-alpine

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

EXPOSE 3003

CMD ["sh", "-c", "npx prisma db push && node dist/app.js"]
