import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      iconDirs:[path.resolve(process.cwd(),'src/assets/icon')],
      symbolId:'icon-[dir]-[name]',
    }) 
  ],
  resolve: {
    alias: {
      '@': path.resolve (__dirname,"./src")
    },
  },
})
