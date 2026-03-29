# =============================================================================
# API Gateway Dockerfile
# OWNER: Muditha (DevOps)
#
# TODO (Muditha):
# 1. Add a non-root user for security
# 2. Add HEALTHCHECK instruction
# 3. Consider using a wait-for-it script to wait for backend services
# =============================================================================
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]
