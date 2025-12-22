<template>
  <div class="w-full md:w-[70%] lg:w-[50%] md:mx-auto px-4 md:px-0">
    <form @submit.prevent="handleSearch" 
      class="flex flex-col md:flex-row w-full transition-all duration-200
             md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:rounded-lg overflow-hidden md:border-2 md:border-black
             active:md:translate-x-[2px] active:md:translate-y-[2px] active:md:shadow-none"
    >
      
      <div class="relative flex-grow">
        <input 
          type="text" 
          placeholder="Search" 
          class="w-full p-4 text-black bg-white border-2 border-black rounded-lg md:rounded-none md:border-none focus:outline-none placeholder:text-gray-500"
        />
      </div>

      <button 
        type="submit" 
        class="mt-4 md:mt-0 bg-[#40E0D0] border-2 border-black rounded-lg 
               md:rounded-none md:border-l-2 md:border-y-0 md:border-r-0 
               flex items-center justify-center px-8 py-4 
               transition-colors duration-200 ease-in-out
               hover:bg-[#36c7b9] group"
      >
        <Icon 
          name="heroicons:magnifying-glass" 
          class="w-6 h-6 text-black transition-transform duration-200 group-hover:scale-110" 
        />
      </button>

    </form>
  </div>
</template>

<script setup lang="js">
const handleSearch = () => {
  console.log('Recherche lancée...')
}
</script>