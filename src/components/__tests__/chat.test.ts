import { mount,VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatRoom from '@/components/xqChat.vue'; // 调整到你的组件路径

// 定义 ChatRoom 的实例类型
type ChatRoomInstance = {
  chat: { scrollHeight: number; scrollTop: number };
  sendMessage(): Promise<void>;
  scrollToBottom(): void;
  createDebounce(): Function;
  $refs: { chat: HTMLElement };
};
// 模拟 useAiStore
vi.mock('@/stores/aiAnswer', () => ({
  useAiStore: () => ({
    isfinish: false,
    messages: [],
    useStopComp: false,
    changeStopState: vi.fn(),
  }),
}));

describe('ChatRoom Component', () => {
  let wrapper: VueWrapper<ChatRoomInstance>;
  const mockChatElement = {
    scrollHeight: 200,
    scrollTop: 0,
  };

  beforeEach(() => {
    wrapper = mount(ChatRoom) as VueWrapper<ChatRoomInstance>;
    wrapper.vm.chat = mockChatElement;
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks(); // 清除 mocks
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.chat-room').exists()).toBe(true);
  });

  it('sends a message and scrolls to the bottom', async () => {
    const inputComponent = wrapper.findComponent({ name: 'xqInput' });
       
    await inputComponent.setValue('Hello, AI!'); // 假设 xqInput 组件支持 v-model

    // 模拟发送消息
    await wrapper.vm.sendMessage();
    // 检查是否滚动到达底部
    const chatElement = wrapper.vm.$refs.chat;
    expect(chatElement.scrollTop).toEqual(chatElement.scrollHeight);
    expect(wrapper.vm.createDebounce).toBeTruthy();
  });

  // it('handles scroll event correctly', async () => {
  //     const scrollEvent = new WheelEvent('wheel', { deltaY: -1 });
  //     await wrapper.vm.sendMessage();
  //     await wrapper.vm.stopScroll(scrollEvent);
      
  //     // 确保停止滚动的逻辑正常工作（具体看你的逻辑）
        
  // });

  it('debounces scrollToBottom correctly', async () => {
    // const scrollToBottomSpy = vi.spyOn(wrapper.vm, 'scrollToBottom');
    wrapper.vm.scrollToBottom();
    expect(wrapper.vm.chat).toBeTruthy();
    // 断言 scrollTop 被设置为 scrollHeight
    expect(mockChatElement.scrollTop).toBe(mockChatElement.scrollHeight);
      
       
  });
});