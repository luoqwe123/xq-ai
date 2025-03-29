
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
      svgoOptions: {
        plugins: [
          { name: 'preset-default' }, // 压缩 SVG
          { name: 'removeViewBox', active: false }, // 保留 viewBox   
        ],
      },
    }),
    tailwindcss(),
    visualizer({ open: true, gzipSize: true }), // 可视化打包分析
  ],
  resolve: {
    alias: {
      '@': path.resolve (__dirname,"./src"),
      '~': path.resolve(__dirname, './src/assets'), // 新增资产别名
    },
  },
  build: {  //build 配置只在构建（生产）时生效
    target: 'esnext', // 目标现代浏览器
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false, // 使用 esbuild 压缩
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      external: [
        /src\/.*\/_tests_\/.*/,
        /src\/onlyTestCom\/.*/
      ], // 排除测试文件
      output: {
        manualChunks: {   // 分包
          vendor: ['vue', 'vue-router', 'pinia'], // 提取核心依赖
          utils: ['highlight.js', 'markdown-it'], // 工具库单独分包
        },
        chunkFileNames: 'js/[name]-[hash].js', // 优化 chunk 文件名
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 静态资源命名
      },
      treeshake: {
        moduleSideEffects: false, // 假设模块无副作用，抖得更狠
        tryCatchDeoptimization: false, // 避免 try-catch 干扰
      },
    },
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        pure_funcs: ['console.info'], // 移除特定日志
      },
    },
  },
  optimizeDeps: {   // optimizeDeps仅开发阶段执行
    include: [ 'vue',"highlight.js","markdown-it","pinia","tailwindcss"], // 强制预构建常用库
    exclude: ['marked'], // 排除不常用库
    esbuildOptions: {
      target: 'esnext', // 一致的目标
      treeShaking: true, // 预构建也开 Tree Shaking
    },
  },
});
