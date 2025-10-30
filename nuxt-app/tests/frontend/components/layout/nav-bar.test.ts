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
                stubs: ['NuxtLink', 'icon'], // crée des versions simplifiées de ces composants, <NuxtLink-stub> et <icon-stub>, juste pour que le rendu global se fasse sans erreur.
            },
        })

        expect(wrapper.text()).toContain('Login');

    })

    it('display "Welcome, User" when userIsLogged is true', async () => {

        const wrapper = mount(navBar, {
            global: {
                stubs: ['NuxtLink', 'icon'],
            },
        })

        // On simule que l'utilisateur est connecté

        // options API: 
        // await wrapper.setData({ userIsLogged: true })

        // Composition API: 
        wrapper.vm.userIsLogged = true;
        
        // Attend que le rendu et la mise à jour du DOM soient terminés
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('Welcome, User');

    })

})