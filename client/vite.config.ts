import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from 'path';

export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  plugins: [svgr(), react()],
  build: {
    sourcemap: process.env.NODE_ENV !== 'production', // Only include sourcemaps in dev
    rollupOptions: {
      output: {
        manualChunks: {
          // Group React and related packages together
          'react-vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
            'react-redux',
            '@reduxjs/toolkit',
            'react-ga4'
          ],
          // Other vendor dependencies
          'ui-libs': [
            'axios',
            'clsx',
            'tailwind-merge',
            'lodash'
          ]
        },
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Explicitly define external deps to ensure consistent React version
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});