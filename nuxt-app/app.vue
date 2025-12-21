<script setup>
const config = useRuntimeConfig()
const isSeoEnabled = config.public.seoIndex

useHead({
  // Si isSeoEnabled est false, on injecte la balise noindex
  meta: [
    {
      name: 'robots',
      content: isSeoEnabled ? 'index, follow' : 'noindex, nofollow'
    }
  ]
})
</script>

<template>
  <div>

    <!-- Contenu principal de la page -->
    <div>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </div>

    <NuxtRouteAnnouncer />
    
  </div>
</template>