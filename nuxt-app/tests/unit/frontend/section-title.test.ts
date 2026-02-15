import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

import sectionTitle from '@/components/text/section-title.vue'

describe("unit test: section-title.vue", () => {

    it('display the default title', async () => {

        const wrapper = mount(sectionTitle)

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain("Section Title")

    })

    it('display a correct title passed as props', async () => {
        const wrapper = mount(sectionTitle, {
            props: {
                text: 'This is a custom title'
            }
        })
    
        await wrapper.vm.$nextTick()
    
        expect(wrapper.text()).toContain('This is a custom title')
    })

    it('DOMPurify should close open tags automatically', async () => {
        const wrapper = mount(sectionTitle, {
            props: { text: '<strong>Hello world' }
        })
        await wrapper.vm.$nextTick()
        expect(wrapper.html()).toContain('<strong>Hello world</strong>')
    })

    it('sanitizes malicious HTML', async () => {
        const wrapper = mount(sectionTitle, {
            props: { text: '<img src=x onerror="alert(1)"> Bad guy' }
        })
        await wrapper.vm.$nextTick()
        expect(wrapper.html()).not.toContain('onerror')
        expect(wrapper.text()).toContain('Bad guy')
    })

    it('applies textColor prop to the title', async () => {
        const wrapper = mount(sectionTitle, {
            props: { textColor: '#ff1000' }
        })
        await wrapper.vm.$nextTick()
        const style = wrapper.find('h2').attributes('style')
        expect(style).toBeDefined()

        const hasExpectedColor = style.includes('#ff1000') || style.includes('rgb(255, 16, 0)')
        expect(hasExpectedColor).toBe(true)

    })

    it('applies backgroundColor prop as half-height gradient', async () => {
        const wrapper = mount(sectionTitle, {
            props: { backgroundColor: '#3b82f6' }
        })
        await wrapper.vm.$nextTick()
        const style = wrapper.attributes('style')
        expect(style).toBeDefined()
        expect(style).toContain('linear-gradient')

        const hasExpectedColor = style.includes('#3b82f6') || style.includes('rgb(59, 130, 246)')
        expect(hasExpectedColor).toBe(true)

    })

    it('applies no background when backgroundColor is empty', async () => {
        const wrapper = mount(sectionTitle, {
            props: { backgroundColor: '' }
        })
        await wrapper.vm.$nextTick()
        const style = wrapper.attributes('style')
        // soit pas de style, soit pas de "background"
        expect(style === undefined || !style.includes('linear-gradient')).toBe(true)
    })

})