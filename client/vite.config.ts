import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from 'path';

export default defineConfig({
  server: {
    host: true, // This will allow network access
    port: 5173
  },
  plugins: [svgr(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            return 'vendors';
          }

          // SVG chunks based on directories
          if (id.includes('src/assets/')) {
            if (id.includes('src/assets/games/')) {
              return 'svg-games';
            }
            if (id.includes('src/assets/casino/')) {
              return 'svg-casino';
            }
            if (id.includes('src/assets/media/')) {
              return 'svg-media';
            }
            if (id.includes('src/assets/music/')) {
              return 'svg-music';
            }
            if (id.includes('src/assets/icons/')) {
              return 'svg-icons';
            }
          }

          // Other app code
          if (id.includes('src/')) {
            if (id.includes('src/components/') || id.includes('src/context/')) {
              return 'ui-components';
            }
            if (id.includes('src/lib/')) {
              return 'utils';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});