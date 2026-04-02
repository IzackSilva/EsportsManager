import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Em vez de esbuild, configuramos a limpeza diretamente no build
  build: {
    minify: 'terser', // O Terser é ótimo para remover logs
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})