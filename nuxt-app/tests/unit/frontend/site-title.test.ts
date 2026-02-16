import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useSiteTitleStore } from '@/stores/siteTitleStore'

import siteTitle from '@/components/text/site-title.vue'

describe('site-title.vue', () => {

    let pinia: ReturnType<typeof createPinia>
    let store: ReturnType<typeof useSiteTitleStore>
    let wrapper: ReturnType<typeof mount>

    beforeEach(async () => {
        pinia = createPinia()
        setActivePinia(pinia)

        store = useSiteTitleStore()
        store.data = 'Hello!!'
        store.fetchData = vi.fn(async () => store.data)

        const { default: siteTitle } = await import('@/components/text/site-title.vue')
        wrapper = mount(siteTitle, { global: { plugins: [pinia] } })
    })

    afterEach(() => {
        wrapper?.unmount()
    })

    it('display the title', async () => {
        await nextTick()
        expect(wrapper.text()).toContain('Hello!!')
    })

    it('renders plain text without HTML tags', async () => {
        store.data = 'Hello world'   // met à jour le store initialisé en beforeEach
        await nextTick()             // laisse Vue propager la mise à jour dans le DOM
        expect(wrapper.text()).toBe('Hello world')
        expect(wrapper.html()).not.toContain('<strong>')
    })
    
})

/*
describe('site-title.vue', () => {

    let pinia = createPinia()

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
    })

    it('display the title', async () => {

        const store = useSiteTitleStore()
        store.data = 'Hello!!'
        store.fetchData = vi.fn(async () => store.data)

        const { default: siteTitle } = await import('@/components/text/site-title.vue')
        const wrapper = mount(siteTitle, { global: { plugins: [pinia] } })
        await nextTick()
        expect(wrapper.text()).toContain('Hello!!')
        
    })

    /*
    it('renders plain text without HTML tags', async () => {

        const wrapper = factory({ data: 'Hello world' })
        await wrapper.vm.$nextTick()
        
        expect(wrapper.text()).toBe('Hello world')
        expect(wrapper.html()).not.toContain('<strong>')

    })

    it('renders HTML tags when present', async () => {

        const wrapper = factory({ data: '<strong>Hello world</strong>' })
        await wrapper.vm.$nextTick()

        expect(wrapper.html()).toContain('<strong>')
        expect(wrapper.text()).toBe('Hello world')

    })

    it('DOMPurify should close open tags automatically', () => {

        const input = '<strong>Hello world'
        const sanitized = DOMPurify.sanitize(input)
        expect(sanitized).toBe('<strong>Hello world</strong>')

    })

    it('sanitizes malicious HTML', async () => {

        const wrapper = factory({ data: '<img src=x onerror="alert(1)"> Bad guy' })
        await wrapper.vm.$nextTick()

        // Le onerror doit avoir été supprimé par DOMPurify
        expect(wrapper.html()).not.toContain('onerror')
        expect(wrapper.text()).toContain('Bad guy')

    })
})
*/