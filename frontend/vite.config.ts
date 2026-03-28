/**
 * Vite Configuration
 * OWNER: Muditha (Frontend / DevOps)
 *
 * TODO (Muditha):
 * 1. The proxy config below forwards /api requests to the Gateway during development.
 *    This avoids CORS issues when running the frontend outside Docker.
 * 2. In production (Docker), the frontend is served by nginx and the proxy is handled
 *    by nginx config instead — see the Dockerfile.
 * 3. Add path aliases if needed (e.g., @ -> src/)
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
