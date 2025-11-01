import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    cors: true,
    strictPort: false, // Try next port if 5173 is busy
    allowedHosts : ['.local', 'aman.akhterlabs.site'],
  },
})
