// YourComponent.spec.ts
import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Logo from '@/components/logo.vue'; // Adjust the path to your component

describe('YourComponent', () => {
    it('renders correctly with default values', () => {
        const wrapper = mount(Logo);
        
        // Check if the image is rendered
        const img = wrapper.find('img');
        expect(img.exists()).toBe(true);
        expect(img.attributes('src')).toBe('/public/125.jpg'); // Ensure the src is correct

        // Check the default selected value
        const select = wrapper.find('select');
        expect(select.element.value).toBe('deepseek-r1');

        // Check the default background color
        expect(select.element.style.backgroundColor).toBe('white');
    });

    it('updates selectedFruit on select change', async () => {
        const wrapper = shallowMount(Logo);
        const select = wrapper.find('select');

        // Change the selected option
        await select.setValue('deepseek-r1');
       
        // Check if the selected value is updated
        expect((wrapper.vm as any).selectedFruit).toBe('deepseek-r1');
    });

    it('applies custom background color', () => {
        const wrapper = mount(Logo, {
            props: {
                backColor: 'blue'
            }
        });
        
        const select = wrapper.find('select');

        // Check if the background color is applied
        expect(select.element.style.backgroundColor).toBe('blue');
    });
});