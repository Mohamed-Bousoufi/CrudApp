import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
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
