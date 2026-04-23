import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Rutas relativas: necesario para GitHub Pages (https://usuario.github.io/nombre-repo/)
// https://vite.dev/config/shared-options.html#base
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
