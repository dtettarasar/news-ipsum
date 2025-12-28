<template>
  <div class="relative w-full my-12 px-10 md:px-16">
    
    <button 
      @click="prev"
      class="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200"
    >
      <Icon name="heroicons:chevron-left" class="w-6 h-6 text-black" />
    </button>

    <button 
      @click="next"
      class="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200"
    >
      <Icon name="heroicons:chevron-right" class="w-6 h-6 text-black" />
    </button>

    <div class="overflow-hidden">
      <div 
        class="flex gap-6 transition-transform duration-500 ease-in-out"
      >
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="relative flex-none w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)] group cursor-pointer"
        >
          <div class="aspect-[3/4] overflow-hidden rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:-translate-y-1">
            <img 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue'

const categories = ref([
  { id: 1, name: 'Technologie', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
  { id: 2, name: 'Politique', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=500' },
  { id: 3, name: 'Culture', image: 'https://images.unsplash.com/photo-1460666819451-7410f5ef13ac?w=500' },
  { id: 4, name: 'Économie', image: 'https://images.unsplash.com/photo-1611974714851-eb6053e6235b?w=500' },
  { id: 5, name: 'Sport', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500' },
  { id: 6, name: 'Santé', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500' },
  { id: 7, name: 'Spiritualité', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500' },
  { id: 8, name: 'Marketing', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500' },
])

const next = () => {
  // On prend le premier élément et on le pousse à la fin
  const firstEl = categories.value.shift()
  categories.value.push(firstEl)
}

const prev = () => {
  // On prend le dernier élément et on le met au début
  const lastEl = categories.value.pop()
  categories.value.unshift(lastEl)
}
</script>