import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/shared': '/src/shared',
      '@/modules': '/src/modules',
      '@/store': '/src/store',
      '@/utils': '/src/utils',
    },
  },
  define: {
    // Add default environment variables
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://localhost:3002/api'),
  },
  server: {
    port: 3000,
  },
})
