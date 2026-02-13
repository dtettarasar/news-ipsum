<template>
  <div class="flex justify-center pt-[50px] lg:pt-[100px] mb-[50px]">
    <h1 v-html="title" class="text-3xl md:text-6xl font-bold text-center"></h1>
  </div>
</template>

<script setup>

import DOMPurify from "isomorphic-dompurify"
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteTitleStore } from "@/stores/siteTitleStore"

const siteTitleStore = useSiteTitleStore()

/*
await useAsyncData('siteTitle', () => {
  siteTitleStore.fetchData()
})*/

await useAsyncData('siteTitle', () => siteTitleStore.fetchData())

// const rawTitle = ref("<strong>Hey, We're Blogxpress.</strong> See Our Thoughts, Stories And Ideas.") // source "brute"
const { data } = storeToRefs(siteTitleStore)
const title = computed(() => DOMPurify.sanitize(data.value || ''))

</script>
