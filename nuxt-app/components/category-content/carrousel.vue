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
    await nextTick()
    
    // On appellera setStep() ici après
    isReady.value = true
})
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