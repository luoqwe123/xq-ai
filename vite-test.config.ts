import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import tailwindcss from 'tailwindcss';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer'; // 新增打包分析工具

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true, // 启用 v-model 语法糖    
      },
    }),
    vueDevTools(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icon')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: {
        plugins: [
          { name: 'preset-default' }, // 压缩 SVG
          { name: 'removeViewBox', active: false }, // 保留 viewBox   保留 SVG 的视野框，防止图片显示不全
        ],
      },
    }),
    tailwindcss(),
    visualizer({ open: true, gzipSize: true }), // 可视化打包分析
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src/assets'), // 新增资产别名
    },
    dedupe: ['vue', 'vue-router',"pinia"], // 避免重复打包
  },
  build: {
    target: 'esnext', // 目标现代浏览器
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false, // 使用 esbuild 压缩，esbuild 比默认的 terser 快 10 倍，
    sourcemap: process.env.NODE_ENV === 'development', // 开发时保留 sourcemap 开发时生成 sourcemap，上线时不生成。sourcemap 是个“源码地图”，开发时能定位到原代码，出错好查；上线去掉，省空间
    rollupOptions: {
      external: [/src\/.*\/_tests_\/.*/, /src\/onlyTestCom\/.*/], // 排除测试文件，不打包
      output: {
        manualChunks: {
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
  optimizeDeps: {   // 开发时预编译依赖，启动快是关键
    include: ['vue', 'vue-router', 'pinia', 'highlight.js', 'markdown-it'], // 预构建核心库
    exclude: ['marked'], // 排除不常用库
    esbuildOptions: {
      target: 'esnext', // 一致的目标、
      treeShaking: true, // 预构建也开 Tree Shaking
    },
  },
  server: {
    hmr: { overlay: true }, // 增强 HMR 体验  热更新（HMR）出错时显示遮罩。
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   }, // API 代理
    // },
  },
});