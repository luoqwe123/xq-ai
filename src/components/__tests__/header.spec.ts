import { mount } from '@vue/test-utils';
import { describe, it, expect,  beforeEach, afterEach,vi } from 'vitest';
import HeaderComponent from '@/components/xqHeader.vue'; // Adjust the path to your component
import Expansion from "@/components/inlineDialog/xqExpansion.vue";
import Contraction from "@/components/inlineDialog/xqContraction.vue";
import { nextTick } from 'vue';

// 模拟 useAiStore
vi.mock('@/stores/aiAnswer', () => ({
  useAiStore: () => ({
    isfinish: false,
    messages: [],
    useStopComp: false,
    changeStopState: vi.fn(),
  }),
}));
describe('HeaderComponent', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(HeaderComponent);
  });

  afterEach(() => {
    wrapper.unmount(); // Clean up after each test
  });

  it('should render the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders Logo and Contraction components', () => {
    // Check if Logo is rendered
    const logo = wrapper.findComponent({ name: 'xqLogo' });
    expect(logo.exists()).toBe(true);

    // Check if Contraction is rendered
    const contraction = wrapper.findComponent(Contraction);
    expect(contraction.exists()).toBe(true);
  });

  it('opens the Expansion dialog when openExpansion is called', async () => {
    // Initially, the Expansion should not be visible
    expect(wrapper.findComponent(Expansion).exists()).toBe(false);

    // Simulate clicking the Contraction component
    await wrapper.findComponent(Contraction).trigger('click');

    // Now, the Expansion should be visible
    expect(wrapper.findComponent(Expansion).exists()).toBe(true);
  });

  it('closes the Expansion dialog when closeExpansion is called', async () => {
    const contraction = wrapper.findComponent(Contraction);

    // Open the Expansion first
    await contraction.trigger('click');
    expect(wrapper.findComponent(Expansion).exists()).toBe(true);

    // Close the Expansion
    await wrapper.findComponent(Expansion).vm.$emit('close-dialog');

    // Check that Expansion is no longer visible
    expect(wrapper.findComponent(Expansion).exists()).toBe(false);
  });

  it('handles keyboard events correctly', async () => {
       
    
    // Simulate Ctrl + K key press
    const keydownEventOpen = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    window.dispatchEvent(keydownEventOpen);
    await nextTick(); // Wait for Vue to update
     
    expect(wrapper.findComponent(Expansion).exists()).toBe(true); // Expansion should be open
    
    // Simulate Escape key press
    const keydownEventClose = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(keydownEventClose);
    await nextTick(); // Wait for Vue to update
    
        
    expect(wrapper.findComponent(Expansion).exists()).toBe(false); // Expansion should be closed
  });
});