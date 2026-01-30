<template>
  <div class="carousel-container relative">
    <div v-if="!isReady" class="loader">
      Chargement...
    </div>

    <div 
      class="carousel" 
      :class="{ 'visible': isReady, 'invisible': !isReady }"
    >
      <div ref="inner" class="inner">
        <div class="card" v-for="card in cards" :key="card">
          {{ card }}
        </div>
      </div>
    </div>
    
    <div v-if="isReady">
      <button @click="prev" class="btn">prev</button>
      <button @click="next" class="btn">next</button>
    </div>
  </div>
</template>

<script setup lang="js">

import { ref, onMounted, nextTick } from 'vue'

const cards = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

// On met le 12 au début tout de suite
cards.value.unshift(cards.value.pop())

const inner = ref(null)
const step = ref('')
const transitioning = ref(false)
// const innerStyle = ref({})
const isReady = ref(false) // État pour le loader

onMounted(async () => {

    // 1. On attend que le DOM soit rendu une première fois
    await nextTick()
    
    // 2. On calcule le step
    setStep() 

    // 3. On positionne à -1 step SANS transition
    resetTranslate()

    // 4. Une fois positionné, on révèle le tout
    isReady.value = true

})

const setStep = () => {
  const innerWidth = inner.value.scrollWidth
  const totalCards = cards.value.length
  step.value = `${innerWidth / totalCards}px`
}

const next = () => {
  // Logic to move carousel left by 'step'

    if (transitioning.value) {return}

    transitioning.value = true

    // console.log("moving left")

    // On glisse de la position -1 vers -2
    inner.value.style.transform = `translateX(-${step.value}) translateX(-${step.value})`

    
    afterTransition(() => {
      // console.log("after transition callback")

      const firstCard = cards.value.shift()
      cards.value.push(firstCard)

      resetTranslate()

      transitioning.value = false

    })
    

}

const prev = () => {
  if (transitioning.value) return
  transitioning.value = true

  // On glisse de la position -1 vers 0
  inner.value.style.transform = `translateX(-${step.value}) translateX(${step.value})`
  // Note : -step + step = 0, on pourrait écrire transform = 'translateX(0)'

  afterTransition(() => {

    const lastCard = cards.value.pop()
    cards.value.unshift(lastCard)
    resetTranslate() // On revient incognito à la position -1
    transitioning.value = false

  })
}

const afterTransition = (callback) => {
  const listener = () => {
    callback()
    inner.value.removeEventListener('transitionend', listener)
  }
  inner.value.addEventListener('transitionend', listener)
}

const resetTranslate = () => {

  // Reset translateX to 0
  inner.value.style.transition = 'none'
  // On se positionne TOUJOURS à -1 step par défaut
  inner.value.style.transform = `translateX(-${step.value})`
  // Force reflow to apply the change immediately
  void inner.value.offsetWidth
  // Restore transition
  // inner.value.style.transition = 'transform 0.2s'
  inner.value.style.transition = ''

}

</script>

<style>

/* Gestion de la visibilité pour éviter le saut */
.invisible {
  opacity: 0;
  visibility: hidden;
}

.visible {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease;
}

.carousel {
  width: 170px; /* ❶ */
  overflow: hidden; /* ❷ */
}

.inner {
  display: flex; /* Utilisation de flex pour plus de stabilité */
  white-space: nowrap; /* ❸ */
  transition: transform 0.2s; 
}

.card {
  width: 40px;
  margin-right: 10px;
  display: inline-flex;
  flex-shrink: 0;

  /* optional */
  height: 40px;
  background-color: #39b1bd;
  color: white;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.loader {
  height: 40px;
  display: flex;
  align-items: center;
  font-family: sans-serif;
  font-weight: bold;
}

/* optional */
button {
  margin-right: 5px;
  margin-top: 10px;
}
</style>
