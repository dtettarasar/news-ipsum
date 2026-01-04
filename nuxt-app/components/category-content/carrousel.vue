<template>
  <div class="carousel-container relative w-full overflow-hidden">
    <div v-if="!isReady" class="h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
      Chargement des catégories...
    </div>

    <div 
      class="carousel-window w-full overflow-hidden" 
      :class="{ 'visible': isReady, 'invisible': !isReady }"
    >
      <div ref="inner" class="inner flex">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="card-wrapper flex-none w-full md:w-1/3 lg:w-1/5 p-2"
        >
          <div class="card-content h-[300px] bg-[#39b1bd] rounded-xl border-2 border-black flex items-center justify-center text-center p-4">
            <h3 class="text-white text-xl font-black uppercase tracking-tighter">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isReady" class="flex justify-center gap-4 mt-6">
      <button @click="prev" class="px-6 py-2 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors">Prev</button>
      <button @click="next" class="px-6 py-2 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors">Next</button>
    </div>

  </div>
</template>

<script setup lang="js">
import { ref, onMounted, nextTick } from 'vue'

const categories = ref([
  { id: 1, name: 'Technologie', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
  { id: 2, name: 'Politique', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=500' },
  { id: 3, name: 'Culture', image: 'https://images.unsplash.com/photo-1460666819451-7410f5ef13ac?w=500' },
  { id: 4, name: 'Économie', image: 'https://images.unsplash.com/photo-1611974714851-eb6053e6235b?w=500' },
  { id: 5, name: 'Sport', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500' },
  { id: 6, name: 'Santé', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500' },
  { id: 7, name: 'Spiritualité', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500' },
  { id: 8, name: 'Marketing', image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500' },
  { id: 9, name: 'Voyage', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500' },
  { id: 10, name: 'Cuisine', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' }
])

// Pré-décalage des données (le dernier devient premier)
categories.value.unshift(categories.value.pop())

const inner = ref(null)
const step = ref('')
const transitioning = ref(false)
const isReady = ref(false)

onMounted(async () => {

    // 1. On attend que le DOM soit rendu une première fois
    await nextTick()

    // 2. On calcule le step
    setStep()

    // 3. On positionne à -1 step SANS transition
    resetTranslate()
    
    // On appellera setStep() ici après
    isReady.value = true

    // 4. On écoute le resize de la fenêtre pour recalculer le step
    window.addEventListener('resize', () => {
        setStep()
        resetTranslate()
    })

})

const setStep = () => {

  // Logic to move the carousel by 'step' cards

  console.log("setting step")

  const innerWidth = inner.value.scrollWidth

  console.log("innerWidth:", innerWidth)

  const totalCards = categories.value.length

  console.log("totalCards:", totalCards)

  step.value = `${innerWidth / totalCards}px`


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

const next = () => {
  // Logic to move carousel left by 'step'

    if (transitioning.value) {return}

    transitioning.value = true

    // console.log("moving left")

    // On glisse de la position -1 vers -2
    inner.value.style.transform = `translateX(-${step.value}) translateX(-${step.value})`

    
    afterTransition(() => {
      // console.log("after transition callback")

      const firstCard = categories.value.shift()
      categories.value.push(firstCard)

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

    const lastCard = categories.value.pop()
    categories.value.unshift(lastCard)
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

</script>

<style scoped>
.invisible {
  opacity: 0;
  visibility: hidden;
}

.visible {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.5s ease;
}

.inner {
  /* On s'assure que le ruban ne revient pas à la ligne */
  display: flex;
  flex-wrap: nowrap;
  transition: transform 0.3s ease;
}
</style>