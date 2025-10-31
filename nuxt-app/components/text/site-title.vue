<template>
  <div class="container mx-auto flex justify-center pt-[50px] lg:pt-[100px]">
    <h1 v-html="title" class="text-3xl font-bold text-center"></h1>
  </div>
</template>

<script setup>

import DOMPurify from 'dompurify'
import { ref } from 'vue'

const title = ref(DOMPurify.sanitize('<strong>Hello</strong> world'))

</script>
