<template>
  <div class="container mx-auto flex justify-center pt-[50px] lg:pt-[100px]">
    <h1 class="text-3xl font-bold text-center">
      {{ title }}
    </h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('Site Title') // valeur temporaire pour le front
</script>
