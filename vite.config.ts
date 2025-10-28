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

  worker: {
    format: 'es',
  },


  build: {
 
    rollupOptions: {
      output: {
        manualChunks: {

          'react-vendor': ['react', 'react-dom'],
          'recharts-vendor': ['recharts'],


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

    // Compress output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    chunkSizeWarningLimit: 500,
  },


  server: {
    port: 5173,

    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
});
