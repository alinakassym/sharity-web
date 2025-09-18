// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/sharity-web/',
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
})
