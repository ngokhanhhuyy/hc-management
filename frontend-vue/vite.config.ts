import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import vuegularTemplate from 'vuegular-template';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuegularTemplate({ lang: 'custom' }),
    tailwindcss()
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '#': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: ['frontend.khanhhuy.dev', 'fedora-mac-mini.com'],
    strictPort: true,
    port: 5173,
    host: '::',
    headers: {
      'Allow-Control-Allow-Origin': '*',
      'Allow-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Allow-Control-Allow-Headers': 'Content-Type,Authorization',
    },
    proxy: {
      '^/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
