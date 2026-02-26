<template>
  <article
    class="rounded-xl p-4"
    :style="{ backgroundColor: cardBackground }"
  >
    <div class="h-44 rounded-xl bg-white/60 flex items-center justify-center">
      <span class="font-bold uppercase tracking-widest text-sm">Image</span>
    </div>

    <div class="pt-4">
      <div class="flex items-center justify-between gap-3">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full bg-white/70 text-xs font-bold uppercase tracking-wide"
        >
          Tech
        </span>

        <span class="text-xs font-semibold text-gray-700">26 fév. 2026</span>
      </div>

      <h3 class="mt-3 text-lg font-bold leading-tight">
        Titre de l’article — maquette à valider
      </h3>

      <p class="mt-2 text-sm text-gray-700 leading-relaxed">
        Petit résumé sur 2–3 lignes pour voir l’équilibre typographique et les espacements de la card.
      </p>

      <div class="mt-4 flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-700">5 min</span>
        <span class="text-xs font-bold uppercase tracking-widest">Lire →</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const fallbackColors = ['#c5fbe1', '#f0fecd', '#f1d0fb', '#fdebdd', '#fddddd', "#dde5fd"]

// Phase 1: on prend une couleur fixe pour valider le design.
const cardBackground = fallbackColors[1]
</script>
