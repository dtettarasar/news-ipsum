<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Admin Login</h1>
    <admin-login-form></admin-login-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  // Implement login logic here
}
</script>