import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidCtf from "vite-plugin-solid-ctf";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    solidCtf({
      filter: {
        include: "src/**/*.{tsx,ts,jsx}",
        exclude: "**/*.test.{tsx,jsx,ts}",
      },
    }),
    solid(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  server: {
    allowedHosts: ["frontend.khanhhuy.dev", "fedora-mac-mini.com"],
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
