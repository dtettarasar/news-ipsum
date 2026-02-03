<script setup lang="ts">

const auth = useAuthStore()

definePageMeta({
  middleware: 'auth'
})

// useFetch utilise une clé unique pour partager le résultat entre SSR et Client
const { data: authStatus } = await useFetch('/api/auth/me', {
  key: 'admin-session' 
})

// Synchronisation avec le store
if (authStatus.value?.authenticated) {
  auth.setUser(authStatus.value.user)
}

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  auth.logout()
  navigateTo('/admin/login')
}

// On surveille uniquement côté client pour la redirection
onMounted(() => {
  if (!authStatus.value?.authenticated) {
    navigateTo('/admin/login')
  }
})

</script>

<template>

  <div class="container mx-auto py-12">
    <div v-if="auth.authenticated">

      <div class="my-6 p-4 bg-green-50 border border-green-200 rounded">
        ✅ Authentification validée par le serveur.
      </div>

      <h1 class="text-3xl font-bold">Bienvenue, {{ auth.user?.name }}</h1>
      <p class="text-gray-500">Rôle : {{ auth.user?.role }}</p>

      <!-- TODO: Ajouter le formulaire de modification des paramètres -->
        <!-- TODO ajouter un contrôle de rôle pour les utilisateurs qui ne sont pas admin -->

    <p class="text-gray-500">Vous êtes sur la page de modification des paramètres.</p>

    </div>
  </div>
</template>