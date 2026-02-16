<template>
  <div class="flex justify-center pt-[50px] lg:pt-[100px] mb-[50px]">
    <h1 v-html="title" class="text-3xl md:text-6xl font-bold text-center"></h1>
  </div>
</template>

<script setup>

import DOMPurify from 'isomorphic-dompurify'
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteTitleStore } from "@/stores/siteTitleStore"

const siteTitleStore = useSiteTitleStore()
const { data } = storeToRefs(siteTitleStore)

// non-bloquant — Nuxt exécute au bon moment (SSR)
useAsyncData('siteTitle', () => siteTitleStore.fetchData())

// fallback CSR si nécessaire
onMounted(() => {
  if (!data.value) {
    siteTitleStore.fetchData().catch(() => {})
  }
})

const title = computed(() => DOMPurify.sanitize(data.value || ''))

</script>
