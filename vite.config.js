import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative paths, so the build works at a domain root or in a sub-folder (GitHub Pages)
  base: './',
  plugins: [react(), tailwindcss()],
})
