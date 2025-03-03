

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'node:path';
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      iconDirs:[path.resolve(process.cwd(),'src/assets/icon')],
      symbolId:'icon-[dir]-[name]',
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve (__dirname,"./src")
    },
  },
  build: {
    rollupOptions: {
      external: [/src\/.*\/_tests_\/.*/], // 排除测试文件
    },
  },
});
