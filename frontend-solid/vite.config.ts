import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { getSolidImports } from "./auto-imports.ts";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: getSolidImports(),
      dts: false,
      include: [/\.[tj]sx?$/],
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
