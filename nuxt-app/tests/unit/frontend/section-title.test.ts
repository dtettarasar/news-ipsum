import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import DOMPurify from "isomorphic-dompurify"

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

})