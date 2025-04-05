
// Vite 基于 Node.js 的 process.env，但它会注入自己的逻辑。
// cross-env 可以在 package.json的脚本里加
/**
 * 
 * "scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "cross-env NODE_ENV=test vite --mode test"
}
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'node:path';
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer'; // 新增打包分析工具

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      iconDirs:[path.resolve(process.cwd(),'src/assets/icon')],
      symbolId:'icon-[dir]-[name]',
      
    }),
    tailwindcss(),
    visualizer({ open: true, gzipSize: true }), // 可视化打包分析
  ],
  resolve: {
    alias: {
      '@': path.resolve (__dirname,"./src"),
    },
  },
  // build: {  
  //   rollupOptions: {
  //     external: [
  //       /src\/.*\/_tests_\/.*/,
  //       /src\/onlyTestCom\/.*/
  //     ], // 排除测试文件
  //   },
  // },
});
