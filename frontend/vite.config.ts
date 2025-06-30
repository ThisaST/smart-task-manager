import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@/modules': '/src/modules',
      '@/shared': '/src/shared', 
      '@/store': '/src/store',
      '@/utils': '/src/utils',
      '@/types': '/src/types',
      '@/components': '/src/components',
    },
  },
})
