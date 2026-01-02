<template>
  <div class="carousel">
    <div ref="inner" class="inner">
      <div class="card" v-for="card in cards" :key="card">
        {{ card }}
      </div>
    </div>
  </div>
  <button @click="prev">prev</button>
  <button @click="next" >next</button>
</template>

<script setup lang="js">

import { ref, onMounted } from 'vue'

const cards = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

// On met le 12 au début tout de suite
cards.value.unshift(cards.value.pop())

const inner = ref(null)
const step = ref('')
const transitioning = ref(false)
const innerStyle = ref({})

onMounted(() => {

    console.log("mounted carrousel test")
    
    setStep() 

    resetTranslate() // Force la position à -step dès le début
    // Nécessaire car si on clique sur prev au début, on est à la position -1 (donc on ne peut pas glisser vers la droite)
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
  
  // Logic after transition ends

  const listener = () => {
    callback()
    inner.value.removeEventListener('transitionend', listener)
  }

  inner.value.addEventListener('transitionend', listener)

  console.log("transition ended")

}

const resetTranslate = () => {

  // Reset translateX to 0
  inner.value.style.transition = 'none'
  // On se positionne TOUJOURS à -1 step par défaut
  inner.value.style.transform = `translateX(-${step.value})`
  // Force reflow to apply the change immediately
  void inner.value.offsetWidth
  // Restore transition
  inner.value.style.transition = ''

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
