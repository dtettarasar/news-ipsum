<template>
  <article
    class="rounded-xl p-4 md:p-6"
    :style="{ backgroundColor: cardBackground }"
  >
    <div class="h-44 rounded-xl bg-white/60 flex items-center justify-center">
      <span class="font-bold uppercase tracking-widest text-sm">Image</span>
    </div>

    <div class="pt-4">
      <div class="flex items-center justify-between gap-3">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full bg-white/70 text-sm md:text-base lg:text-lg uppercase tracking-wide border border-black border-2"
        >
          Tech
        </span>

        <!--<span class="text-xs font-semibold text-gray-700">26 fév. 2026</span>-->

      </div>

      <h3 class="mt-3 text-lg lg:text-2xl xl:text-3xl font-bold leading-tight">
        Titre de l’article — maquette à valider
      </h3>

      <div class="mt-4 flex items-center gap-2 text-sm md:text-base text-gray-700">
        <!-- Auteur -->
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-full border border-black bg-gray-300 flex-shrink-0"></div>
          <span class="font-semibold whitespace-nowrap">Kristin Watson</span>
        </div>

        <span class="text-gray-400">|</span>

        <!-- Temps de lecture -->
        <div class="flex items-center gap-1">
          <Icon name="mdi:clock-outline" class="w-4 h-4" />
          <span>9 min read</span>
        </div>

        <span class="text-gray-400">|</span>

        <!-- Nombre de vues -->
        <div class="flex items-center gap-1">
          <Icon name="mdi:eye-outline" class="w-4 h-4" />
          <span>9k</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const fallbackColors = ['#c5fbe1', '#f0fecd', '#f1d0fb', '#fdebdd', '#fddddd', "#dde5fd"]

// Phase 1: on prend une couleur fixe pour valider le design.
const cardBackground = fallbackColors[1]
</script>
