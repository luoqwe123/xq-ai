import  { test,expect  } from "vitest"
import { mount } from '@vue/test-utils';
import ContractionButton from '@/components/inlineDialog/contraction.vue'; // 根据你的项目结构调整路径

// 如果你需要在所有测试中共享一些配置或设置，可以在这里定义
// export default defineConfig({
//   // ...
// });

test('ContractionButton renders with correct styles when props are passed', async () => {
  const backColor = '#ff0000'; // 红色
  const color = '#00ff00'; // 绿色
  const wrapper = mount(ContractionButton, {
    props: {
      backColor,
      color
    }
  });

  // 检查按钮的背景色
  expect(wrapper.find('.btn').attributes('style')).toContain(`background-color: ${backColor};`);

  // 检查文本颜色
  expect(wrapper.find('.left span').attributes('style')).toContain(`color: ${color};`);
  expect(wrapper.find('.kbd span').attributes('style')).toContain(`color: ${color};`);

  // 检查 Svg 组件的填充颜色（注意：这可能需要额外的模拟或处理，因为 Svg 组件不是标准的 HTML 元素）
  // 如果 Svg 是一个全局注册的组件，并且你有一个方法来检查它的属性，你可以在这里做
  // 例如：expect(wrapper.find('Svg').attributes('fill')).toBe(color);
  // 但由于 Svg 不是标准的 DOM 元素，你可能需要使用 Vue Test Utils 提供的 findComponent 方法（如果可用）
  // 或者，如果 Svg 只是一个简单的 SVG 标记作为字符串插入，你可能需要检查渲染后的 HTML
});

test('ContractionButton renders with default styles when no props are passed', async () => {
  const wrapper = mount(ContractionButton, {});

  // 检查按钮的背景色是否为默认值
  expect(wrapper.find('.btn').attributes('style')).toContain('background-color: black;');

  // 检查文本颜色是否为默认值
  expect(wrapper.find('.left span').attributes('style')).toContain('color: black;');
  expect(wrapper.find('.kbd span').attributes('style')).toContain('color: black;');
});

// 你可以添加更多的测试来覆盖组件的不同方面，比如事件处理、动态内容更新等