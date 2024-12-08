import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'date-fns',
      'zustand',
      '@supabase/supabase-js',
      '@supabase/postgrest-js'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    watch: {
      usePolling: true
    },
    hmr: {
      overlay: true
    }
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['clsx', 'tailwind-merge', 'date-fns'],
          supabase: ['@supabase/supabase-js', '@supabase/postgrest-js']
        }
      }
    }
  }
});
