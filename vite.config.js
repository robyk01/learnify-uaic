import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    include: ['@supabase/auth-ui-react', '@supabase/auth-ui-shared'],
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})