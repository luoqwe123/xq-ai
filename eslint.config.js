
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
// import noConsolePlugin from "eslint-plugin-no-console"; // 插件禁止 console

/**@type {import('eslint').Linter.Config[]} */
export default [
  // 1. 通用配置，适用于所有文件
  {
    files: ["**/*.{js,ts,vue}"], // 匹配 JavaScript、TypeScript 和 Vue 文件

    rules: {
      'semi': ["error", "always"], // 强制在语句末尾加上分号
      indent: ["error", 2], // 统一缩进为 2 个空格
      "no-console": "error", // 禁止使用 `console`（如需调试，应该使用日志工具）
      // "quotes": ["error", "single"], // 强制使用单引号
    },
  },
  {
    languageOptions: {
      globals: globals.browser, // 支持浏览器环境的全局变量（如 `window`、`document` 等）
    },
  },
  pluginJs.configs.recommended,  //推荐js配置
  ...tseslint.configs.recommended,//推荐ts配置
  // 2. 针对 Vue 文件的配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: tseslint.parser, // 使用 TypeScript 解析器
      parserOptions: {
        ecmaVersion: "latest", // 支持最新的 ECMAScript 语法
        sourceType: "module", // 支持模块化
        extraFileExtensions: [".vue"], // 解析 .vue 文件
      },
    },
    plugins: {
      vue: pluginVue, // Vue 插件
    },
    rules: {
      ...pluginVue.configs["flat/essential"].rules, // 加载 Vue 的核心规则  推荐vue配置
      "vue/html-indent": ["error", 2], // Vue 模板中的 HTML 缩进为 2 个空格
      "indent": ["error", 2],         // 设置 <script> 和 <style> 部分的缩进为 2 个空格
      "semi": ["error", "always"],    // 设置必须在语句结尾使用分号
      // "vue/max-attributes-per-line": ["error", { singleline: 3, multiline: 1 }], // 单行最多 3 个属性，多行每行 1 个属性
      // "vue/singleline-html-element-content-newline": "off", // 关闭单行 HTML 元素内容换行规则
    },
  },

];