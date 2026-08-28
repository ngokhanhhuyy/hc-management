import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    allowedHosts: ["frontend.khanhhuy.dev", "frontend-workstation.khanhhuy.dev", "frontend-wsl.khanhhuy.dev"],
    strictPort: true,
    port: 5173,
    host: "::",
    headers: {
      "Allow-Control-Allow-Origin": "*",
      "Allow-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Allow-Control-Allow-Headers": "Content-Type,Authorization",
    },
    proxy: {
      "^/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
