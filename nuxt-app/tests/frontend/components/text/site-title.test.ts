import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import DOMPurify from "isomorphic-dompurify"

import siteTitle from '../../../../components/text/site-title.vue'

describe('site-title.vue', () => {

    it('display the title', async () => {

        const wrapper = mount(siteTitle);

        wrapper.vm.rawTitle = 'Hello!!';

        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('Hello!!');

    })

    it('renders plain text without HTML tags', async () => {

        const wrapper = mount(siteTitle);
        wrapper.vm.rawTitle = 'Hello world';
        await wrapper.vm.$nextTick();
        
        expect(wrapper.text()).toBe('Hello world');
        expect(wrapper.html()).not.toContain('<strong>');

    })

    it('renders HTML tags when present', async () => {

        const wrapper = mount(siteTitle);
        wrapper.vm.rawTitle = '<strong>Hello world</strong>';
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toContain('<strong>');
        expect(wrapper.text()).toBe('Hello world');

    })

    it('DOMPurify should close open tags automatically', () => {

        const input = '<strong>Hello world';
        const sanitized = DOMPurify.sanitize(input);
        expect(sanitized).toBe('<strong>Hello world</strong>');

    })

    it('sanitizes malicious HTML', async () => {

        const wrapper = mount(siteTitle);

        // Injection de code "sale"
        wrapper.vm.rawTitle = '<img src=x onerror="alert(1)"> Bad guy';
        await wrapper.vm.$nextTick();

        // Le onerror doit avoir été supprimé par DOMPurify
        expect(wrapper.html()).not.toContain('onerror');
        expect(wrapper.text()).toContain('Bad guy');

    })

})