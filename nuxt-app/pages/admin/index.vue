<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

// useFetch utilise une clé unique pour partager le résultat entre SSR et Client
const { data: authStatus } = await useFetch('/api/auth/me', {
  key: 'admin-session' 
})

// On surveille uniquement côté client pour la redirection
onMounted(() => {
  if (!authStatus.value?.authenticated) {
    navigateTo('/admin/login')
  }
})
</script>

<template>
  <div class="container mx-auto py-12">
    <div v-if="authStatus?.authenticated">
      <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <p>Bienvenue, {{ authStatus.user.role }} !</p>
      
      <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        ✅ Authentification validée par le serveur.
      </div>
    </div>
    
    <div v-else class="flex justify-center">
      <p>Chargement de la session...</p>
    </div>
  </div>
</template>