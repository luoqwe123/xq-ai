import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // globals:true,
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),    // import.meta.url 这是一个 ES 模块（ESM）中的元数据属性 表示当前模块的文件 URL。
      coverage: {
        reporter: ['text', 'html'], // 可以指定多个报告格式
        include: ['src/*'],//['src/*.{ts,js,vue}'], // 包含需要测试覆盖率的文件类型
        exclude: [
          'src/components/onlyTestCom', // 排除组件 b 的文件
          'src/main.ts',
          'src/App.vue'
        ],
      },
    },


  }),
);
