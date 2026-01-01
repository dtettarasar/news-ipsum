<template>
  <div class="carousel">
    <div class="inner">
      <div class="card" v-for="card in cards" :key="card">
        {{ card }}
      </div>
    </div>
  </div>
  <button>prev</button>
  <button>next</button>
</template>

<script setup lang="js">

import { ref } from 'vue'

const cards = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

</script>