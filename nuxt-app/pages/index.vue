<template>

  <div class="container mx-auto">
    
    <text-site-title></text-site-title>

    <forms-search-bar></forms-search-bar>

    <div class="my-12">
      <category-content-carrousel></category-content-carrousel>
    </div>

    <div>
      <text-section-title text="Top Stories" backgroundColor="#90f6b7" ></text-section-title>
    </div>

    <div class="mt-6 grid grid-cols-5 gap-6">
      <article-card />
      <article-card />
      <article-card />
      <article-card />
      <article-card />
    </div>

  </div>

</template>

<script setup lang="ts">


</script>