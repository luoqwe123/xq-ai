

export {}

declare module 'vue' {
    export interface GlobalComponents {
      Svg: typeof import('./src/components/svgComponent.vue')['Svg']; // 确保路径正确，且 SvgComponent.vue 是 Svg 组件的文件名
    }
  }