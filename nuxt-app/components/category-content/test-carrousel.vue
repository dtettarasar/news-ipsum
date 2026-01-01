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

<style>
.carousel {
  width: 170px; /* ❶ */
  overflow: hidden; /* ❷ */
}

.inner {
  white-space: nowrap; /* ❸ */
}

.card {
  width: 40px;
  margin-right: 10px;
  display: inline-flex;

  /* optional */
  height: 40px;
  background-color: #39b1bd;
  color: white;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

/* optional */
button {
  margin-right: 5px;
  margin-top: 10px;
}
</style>
