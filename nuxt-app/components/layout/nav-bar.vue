<template>

    <div class="border-t-1 border-b-1 px-4 bg-blue-200 flex flex-row">

        <div class="hidden lg:flex flex-row basis-full justify-between items-center">

            <!--Menu desktop-->

            <div>
                <img src="/logos/logoipsum-381.svg" alt="Logo du site" class="h-8 w-auto" />
            </div>

            <div class="flex flex-row justify-center items-center gap-8 h-full">
                
                <div
                v-for="item in menuItems"
                :key="item.to"
                class="group mt-[20px] h-[40px] flex flex-col justify-between items-center"
                >

                    <NuxtLink :to="item.to" class="">
                        {{ item.label }}
                    </NuxtLink>

                    <div
                        class="w-[30px] h-[4px] rounded-t-[200px] transition-all duration-200"
                        :class="[
                        route.path === item.to ? 'bg-black' : 'bg-blue-200 group-hover:bg-black'
                        ]"
                    ></div>

                </div>

            </div>

            <div class="flex flex-row gap-2 items-center"> 

                <div class="flex flex-row items-center">
                    
                    <icon name="ic:twotone-search" class="w-8 h-8 text-black hover:text-sky-500 transition-colors" />

                </div>
                
                <div>

                    <div v-if="userIsLogged">
                        Welcome, User
                    </div>

                    <div v-else>

                        Login

                    </div>

                </div>

            </div>

        </div>

        <div class="flex lg:hidden">

            <!--Menu mobile-->

            menu mobile to do

        </div>

        

    </div>

</template>

<script setup>

    import { ref } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()

    const menuItems = [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'All articles', to: '/articles' }
    ]

    // 1️⃣ variable réactive (false par défaut)
    const userIsLogged = ref(false)

</script>