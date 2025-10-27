import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ✅ OPTIMIZE 1: Web Worker config
  worker: {
    format: 'es',
  },

  // ✅ OPTIMIZE 2: Build optimizations
  build: {
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'recharts-vendor': ['recharts'],

          // Common components
          'common-components': [
            './src/components/common/Button',
            './src/components/common/Card',
            './src/components/common/Badge',
            './src/components/common/Input',
            './src/components/common/Loading',
            './src/components/common/Modal',
          ],
        },
      },
    },

    // ✅ Compress output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // ✅ Chunk size warnings
    chunkSizeWarningLimit: 500, // Warn if chunk > 500KB
  },

  // ✅ OPTIMIZE 3: Server optimizations
  server: {
    port: 5173,
    // Enable compression
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
});
