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

})