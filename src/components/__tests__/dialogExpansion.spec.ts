import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
import { shallowMount, } from "@vue/test-utils";

import expansion from "@/components/inlineDialog/xqExpansion.vue";
import  aiMessage from "@/components/aiTro.vue";
import { createPinia,setActivePinia } from 'pinia';


describe('ExpansionComponent', () => {
  let wrapper:any;
  let pinia:any;
  beforeAll(() => {
    // 只创建一次 Pinia 实例
    pinia = createPinia();
    // 设置活跃的 Pinia 实例（如果需要的话，这取决于您的测试环境和 Pinia 版本）
    setActivePinia(pinia);
  });
  beforeEach(() => {
    wrapper = shallowMount(expansion);
   
  });

  afterEach(() => {
    wrapper.unmount(); // 使用 unmount 替代 destroy，这是 @vue/test-utils 的推荐方法
  });

  it('should render the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  

  it('should update suggest value on chat interaction', async () => {
    const chat = vi.spyOn(wrapper.vm, 'chat');
    //  console.log("chat",wrapper.vm)
    await wrapper.find('.dialog-content').trigger('click');
    expect(chat).toHaveBeenCalledTimes(1);
    // 假设 suggest 是一个响应式属性，并且 chat 方法会更新它
    expect(wrapper.vm.suggest).toBe('你好'); // 确保这是 chat 方法设置的正确值
    // console.log("chat",wrapper.vm.suggest,wrapper.html())
    expect(wrapper.findComponent(aiMessage).exists()).toBe(true);
  });

 

  it('should show suggestions when no messages', () => {
    expect(wrapper.find('.suggestions').exists()).toBe(true);
    expect(wrapper.find('.aiMessage').exists()).toBe(false);
  });

 
});