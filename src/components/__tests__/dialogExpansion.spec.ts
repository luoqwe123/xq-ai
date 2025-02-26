import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { shallowMount } from "@vue/test-utils";

import expansion from "@/components/inlineDialog/expansion.vue";


describe('ExpansionComponent', () => {
  let wrapper:any;

  beforeEach(() => {
    wrapper = shallowMount(expansion);
  });

  afterEach(() => {
    wrapper.unmount(); // 使用 unmount 替代 destroy，这是 @vue/test-utils 的推荐方法
  });

  it('should render the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle close event', async () => {
    const handleClose = vi.spyOn(wrapper.vm, 'handleClose');
    // console.log("handle",handleClose)
    await wrapper.find('.dialog-overlay').trigger('click');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should update suggest value on chat interaction', async () => {
    const chat = vi.spyOn(wrapper.vm, 'chat');
    //  console.log("chat",wrapper.vm)
    await wrapper.find('.dialog-content').trigger('click');
    expect(chat).toHaveBeenCalledTimes(1);
    // 假设 suggest 是一个响应式属性，并且 chat 方法会更新它
    expect(wrapper.vm.suggest).toBe('你好'); // 确保这是 chat 方法设置的正确值
    console.log("chat",wrapper.vm.messages,wrapper.html())
    expect(wrapper.find('.aiMessage').exists()).toBe(true);
  });

 

  it('should show suggestions when no messages', () => {
    expect(wrapper.find('.suggestions').exists()).toBe(true);
    expect(wrapper.find('.aiMessage').exists()).toBe(false);
  });

  it('should show aiMessage when there are messages', async () => {
    // 使用 setData 设置 messages 属性，模拟用户交互或组件状态的变化
    await wrapper.setData({ messages: [{ sentBy: 'ai', content: 'Test message' }] });
    
    // 注意：如果组件有 watchers 或 computed properties 依赖于 messages，您可能需要使用 flushPromises 来等待它们更新
    // expect(wrapper.find('.dialog-content').exists()).toBe(false);
    expect(wrapper.find('.aiMessage').exists()).toBe(true);
  });
});