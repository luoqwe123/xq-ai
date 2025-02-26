import { test, expect } from "vitest"
import { mount,config } from '@vue/test-utils';
import ContractionButton from '@/components/inlineDialog/contraction.vue'; // 根据你的项目结构调整路径
import { hexToRgb } from "@/utils/hexToRgb"
import  Svg from "@/components/svgComponent.vue"

// 如果你需要在所有测试中共享一些配置或设置，可以在这里定义
// export default defineConfig({
//   // ...
// });

test('dialogContraction renders with correct styles when props are passed', async () => {
    const backColor = '#ff0000'; // 红色
    const color = '#00ff00'; // 绿色
    const wrapper = mount(ContractionButton, {
        props: {
            backColor,
            color
        },
       
    });
    

    // 检查按钮的背景色
    expect(wrapper.find('.btn').attributes('style')).toContain(`background-color: ${hexToRgb(backColor)}; color: ${hexToRgb(color)};`);
    expect(wrapper.find('.kbd span').attributes('style')).toContain(`color: ${hexToRgb(color)};`);
   
    expect(wrapper.findComponent(Svg).exists()).toBe(true)
    
});

test('ContractionButton renders with default styles when no props are passed', async () => {
    const wrapper = mount(ContractionButton, {});

    // 检查按钮的背景色是否为默认值
    expect(wrapper.find('.btn').attributes('style')).toContain('background-color: black; color: black;');

    // 检查文本颜色是否为默认值

    expect(wrapper.find('.kbd span').attributes('style')).toContain('color: black;');
});

// 你可以添加更多的测试来覆盖组件的不同方面，比如事件处理、动态内容更新等