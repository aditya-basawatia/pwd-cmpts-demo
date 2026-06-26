import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'PWD Field — Chhattisgarh',
        short_name: 'PWD Field',
        description: 'PWD Chhattisgarh field app: hierarchy directory and on-site, geo-tagged work progress capture.',
        theme_color: '#0a6b3d',
        background_color: '#0a6b3d',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen', 'minimal-ui'],
        orientation: 'portrait',
        // Launch straight into the app experience when installed.
        start_url: './#/app',
        scope: './',
        categories: ['government', 'productivity', 'utilities'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Capture Progress', short_name: 'Capture', url: './#/app/capture' },
          { name: 'Hierarchy', short_name: 'Hierarchy', url: './#/app/hierarchy' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  base: process.env.GITHUB_PAGES ? '/pwd-cmpts-demo/' : './',
});
