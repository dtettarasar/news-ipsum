<template>
  <div class="relative w-full my-12 px-4 md:px-0">
    
    <button 
      @click="scrollPrev"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200"
    >
      <Icon name="heroicons:chevron-left" class="w-6 h-6 text-black" />
    </button>

    <button 
      @click="scrollNext"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200"
    >
      <Icon name="heroicons:chevron-right" class="w-6 h-6 text-black" />
    </button>

    <div 
      ref="carouselRef"
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-hidden scroll-smooth"
    >
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="relative group cursor-pointer"
      >
        <div class="aspect-[3/4] overflow-hidden rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:-translate-y-1">
          <img 
            :src="category.image" 
            :alt="category.name"
            class="w-full h-full object-cover transition-scale duration-500 group-hover:scale-110"
          />
        </div>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
          <div class="bg-white border-2 border-black py-2 px-4 rounded-full text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span class="text-xs font-black uppercase tracking-widest text-black">
              {{ category.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue'

const carouselRef = ref(null)

// Données fictives (Array d'objets)
const categories = ref([
  { id: 1, name: 'Technologie', image: '/placeholder-cat.jpg' },
  { id: 2, name: 'Politique', image: '/placeholder-cat.jpg' },
  { id: 3, name: 'Culture', image: '/placeholder-cat.jpg' },
  { id: 4, name: 'Économie', image: '/placeholder-cat.jpg' },
  { id: 5, name: 'Sport', image: '/placeholder-cat.jpg' },
  { id: 6, name: 'Santé', image: '/placeholder-cat.jpg' },
])

// Logique de navigation (Basique pour le moment)
const scrollNext = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollLeft += 300
  }
}

const scrollPrev = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollLeft -= 300
  }
}
</script>