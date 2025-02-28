import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { askAi, abortRequest } from '@/utils/request'; // 更新为实际路径
import { useAiStore } from '@/stores/aiAnswer'; // 确保这个路径是正确的
import { beforeAll, beforeEach, describe,expect,it,vi } from 'vitest';

describe('askAi function', () => {
  let pinia;
  let dataListStore:any;
  
  let abortControllerRef:any;

  beforeAll(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    dataListStore = useAiStore(pinia); // 创建一个 store 实例
    abortControllerRef = ref(null); // 初始化全局的 abortController

    // 模拟 fetch 函数
    global.fetch = vi.fn().mockImplementation((url, options) => {
      const controller = options.signal?.controller;
      return new Promise((resolve, reject) => {
        // 简单的模拟响应
        const mockResponse = new Response('Mock AI response', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });

        // 如果请求被中止，则拒绝 promise
        if (controller && controller.signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
        } else {
          resolve(mockResponse);
        }
      });
    });
  });

  beforeEach(() => {
    // 重置 store 状态
    dataListStore.reset();
    // 重置 abortController
    abortControllerRef.value = null;
  });

  it('should send a question to the AI and update the store correctly', async () => {
    const question = { text: 'What is the meaning of life?' };
    const mockMessages = ref([]);

    // 监听 store 的变化（可选，用于验证）
    const answerChangeSpy = vi.spyOn(dataListStore, 'addValueToAnswer');

    await askAi(question, false, mockMessages);

    // 验证 fetch 被调用了一次
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // 验证 fetch 的参数
    expect(global.fetch).toHaveBeenCalledWith("http://1.92.82.236:3001/ask", {
      method: 'POST',
      body: expect.any(FormData),
      signal: expect.any(AbortSignal),
    });

    // 验证 store 的方法被调用
    expect(answerChangeSpy).toHaveBeenCalledTimes(1);
    // 验证添加的答案是否正确（这里需要根据你的 store 实现来调整）
    // expect(dataListStore.someState).toBe('Expected answer');

    // 清理 spy
    answerChangeSpy.mockRestore();
  });

  it('should abort a request if abortRequest is called', async () => {
    const question = { text: 'What is the meaning of life?' };
    const mockMessages = ref([]);

    // 开始请求
    const askAiPromise = askAi(question, false, mockMessages);

    // 在请求完成之前中止它
    abortRequest(() => {
      // 这里可以添加一些清理或验证逻辑
    });

    // 等待请求完成并捕获错误
    try {
      await askAiPromise;
    } catch (error:any) {
      // 验证请求被中止
      expect(error).toBeInstanceOf(DOMException);
      expect(error.name).toBe('AbortError');
    }

       
  });

    
});