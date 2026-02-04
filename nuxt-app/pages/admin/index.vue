<script setup lang="ts">

const auth = useAuthStore()

definePageMeta({
  middleware: 'auth',
  auth: { requiredRole: 'editor' }
})

// Données utilisateur pour l’affichage et le store (contrôle d’accès = middleware uniquement)
const { data: authStatus } = await useFetch('/api/auth/me', {
  key: 'admin-session'
})

if (authStatus.value?.authenticated) {
  auth.setUser(authStatus.value.user)
}

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  auth.logout()
  navigateTo('/admin/login')
}

</script>

<template>

  <div class="container mx-auto py-12">
    <div v-if="auth.authenticated">

      <div class="my-6 p-4 bg-green-50 border border-green-200 rounded">
        ✅ Authentification validée par le serveur.
      </div>

      <h1 class="text-3xl font-bold">Bienvenue, {{ auth.user?.name }}</h1>
      <p class="text-gray-500">Rôle : {{ auth.user?.role }}</p>

      <NuxtLink to="/admin/settings" class="mt-8 px-4 py-2 bg-blue-500 text-white rounded">
        Modifier les paramètres
      </NuxtLink>

      <button @click="handleLogout" class="mt-8 px-4 py-2 bg-red-500 text-white rounded">
        Déconnexion
      </button>
    </div>
  </div>
</template>