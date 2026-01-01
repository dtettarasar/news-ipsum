<template>
  <div class="carousel">
    <div ref="inner" class="inner">
      <div class="card" v-for="card in cards" :key="card">
        {{ card }}
      </div>
    </div>
  </div>
  <button>prev</button>
  <button @click="moveLeft" >next</button>
</template>

<script setup lang="js">

import { ref, onMounted } from 'vue'

const cards = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const inner = ref(null)
const step = ref('')
const innerStyle = ref({})

onMounted(() => {

    console.log("mounted carrousel test")
    
    setStep() 

    console.log("step:", step.value)

})

const setStep = () => {

  // Logic to move the carousel by 'step' cards

  console.log("setting step")

  const innerWidth = inner.value.scrollWidth

  console.log("innerWidth:", innerWidth)

  const totalCards = cards.value.length

  console.log("totalCards:", totalCards)

  step.value = `${innerWidth / totalCards}px`


}

const moveLeft = () => {
  // Logic to move carousel left by 'step'
    console.log("moving left")
    inner.value.style.transform = `translateX(-${step.value})`

}

</script>

<style>
.carousel {
  width: 170px; /* ❶ */
  overflow: hidden; /* ❷ */
}

.inner {
  white-space: nowrap; /* ❸ */
  transition: transform 0.2s; 
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
