import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Using a relative base ('./') so the build works when hosted at
// https://<username>.github.io/<repo-name>/ without any extra config.
export default defineConfig({
  plugins: [react()],
  base: './',
})
