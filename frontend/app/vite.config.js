import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    // Allow connections from nginx container
    allowedHosts: ['localhost', 'frontend', 'nginx'],
    // HMR configuration for Docker
    hmr: {
      host: 'localhost',
      port: 8000,
      protocol: 'ws',
    },
  },
})
