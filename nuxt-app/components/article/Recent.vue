<template>

    <div>
        <text-section-title text="Recent Articles" backgroundColor="#90f6b7" ></text-section-title>
    </div>

    <div v-if="!isReady" class="mt-6 h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
        Chargement des articles...
    </div>



</template>

<script setup lang="ts">
    
    import { useArticlesStore } from '@/stores/articlesStore'
    import { storeToRefs } from 'pinia'
    
    const articlesStore = useArticlesStore()
    const isReady = ref(false);


</script>