<template>
  <div>
    <p>Test MongoDB</p>
    <button @click="testMongo">Tester</button>
    <pre>{{ response }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const response = ref('')

async function testMongo() {
  const res = await $fetch('/api/test-mongo') // notre endpoint server
  response.value = JSON.stringify(res, null, 2)
}
</script>