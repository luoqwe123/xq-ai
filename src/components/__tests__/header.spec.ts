import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import HeaderComponent from '@/components/header.vue'; // Adjust the path to your component
import Expansion from "@/components/inlineDialog/expansion.vue";
import Contraction from "@/components/inlineDialog/contraction.vue";
import { nextTick } from 'vue';

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
        const logo = wrapper.findComponent({ name: 'Logo' });
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