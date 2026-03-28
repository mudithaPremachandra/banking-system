# =============================================================================
# Frontend Dockerfile — Multi-stage build
# OWNER: Muditha (DevOps)
#
# Stage 1: Build the React app with Vite
# Stage 2: Serve the static files with nginx
#
# TODO (Muditha):
# 1. Create an nginx.conf file for SPA routing (fallback to index.html)
# 2. Add non-root user for security
# 3. Configure nginx to proxy /api to the gateway container
# =============================================================================

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
