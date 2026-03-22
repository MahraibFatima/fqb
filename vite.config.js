import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-router-dom'],
        }
      }
    },
    // Optimize images during build
    assetsDir: 'assets',
  },
  optimizeDeps: {
    include: ['react', 'react-router-dom', 'react-router-dom'],
  }
})

