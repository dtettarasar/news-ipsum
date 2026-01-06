<template>

  <div class="carousel-container relative w-full overflow-visible">

    <div v-if="!isReady" class="h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
      Chargement des catégories...
    </div>

    <button
        v-if="isReady"
        @click="prev" 
        class="hidden md:flex absolute left-0 -ml-6 top-1/2 -mt-6 z-50 w-12 h-12 bg-white border-2 border-black rounded-full items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        <span class="text-2xl">←</span>
    </button>

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
          <div 
            class="card-content relative h-[300px] rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-end justify-center text-center p-4 overflow-hidden group"
            :style="{ 
              backgroundColor: getFallbackColor(category.id),
              backgroundImage: `url(${category.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          >

            <h3 class="text-black text-lg bg-white py-1 px-4 mb-2 rounded-full uppercase tracking-tighter">
              {{ category.name }}
            </h3>

          </div>
        </div>
      </div>

    </div>

    <button 
        v-if="isReady"
        @click="next" 
        class="hidden md:flex absolute right-0 -mr-6 top-1/2 -mt-6 z-50 w-12 h-12 bg-white border-2 border-black rounded-full items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        <span class="text-2xl">→</span>
    </button>
    
    <div v-if="isReady" class="flex md:hidden justify-center gap-6 mt-8 pb-4">
      <button 
        @click="prev" 
        class="w-14 h-14 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        <span class="text-2xl">←</span>
      </button>
      <button 
        @click="next" 
        class="w-14 h-14 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        <span class="text-2xl">→</span>
      </button>
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

// Couleurs de fallback pour les catégories sans image
const fallbackColors = ['#FF6F61', '#4ECDC4', '#FFC312', '#2C3A47', '#F5F6FA']

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

// Petite fonction pour obtenir une couleur basée sur l'ID (pour que la couleur reste la même pour une catégorie donnée)
const getFallbackColor = (id) => {
  return fallbackColors[id % fallbackColors.length]
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