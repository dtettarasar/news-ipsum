import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

// 💡 Mock du composable useRoute
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/', // valeur qu’on veut pendant le test
  }),
}))

import navBar from '../../../../components/layout/nav-bar.vue'

describe('nav-bar.vue', () => {

    it('display login link when userIsLogged is false', () => {

        const wrapper = mount(navBar, {
            global: {
                stubs: ['NuxtLink', 'icon'], // on mock NuxtLink et l’icône
            },
        })

        expect(wrapper.text()).toContain('Login')

    })

})