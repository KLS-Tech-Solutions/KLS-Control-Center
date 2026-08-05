import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // `@/...` resolves to `src/...` so imports stay stable as the tree grows.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
