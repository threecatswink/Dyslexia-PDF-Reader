import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  base: '/Dyslexia-PDF-Reader/',
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://threecatswink.github.io/Dyslexia-PDF-Reader/',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'Dyslexia PDF Reader',
        short_name: 'Dyslexia Reader',
        start_url: '/Dyslexia-PDF-Reader/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      srcDir: 'src',
      filename: 'sw.js',
      scope: '/Dyslexia-PDF-Reader/',
      strategies: 'generateSW',
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-lib': ['pdfjs-dist'],
        },
      },
    },
  },
});
