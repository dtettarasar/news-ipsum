<template>
  <div class="w-full md:w-[70%] lg:w-[50%] md:mx-auto px-4 md:px-0">
    <form @submit.prevent="handleSearch" 
      class="flex flex-col md:flex-row w-full md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:rounded-lg overflow-hidden md:border-2 md:border-black"
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
        class="mt-4 md:mt-0 bg-[#40E0D0] border-2 border-black rounded-lg md:rounded-none md:border-l-2 md:border-y-0 md:border-r-0 flex items-center justify-center p-4 transition-colors hover:bg-turquoise-dark active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
      >
        <Icon name="heroicons:magnifying-glass" class="w-6 h-6 text-black" />
      </button>

    </form>
  </div>
</template>

<script setup lang="js">

const handleSearch = () => {
  // On ajoutera la logique de recherche plus tard
  console.log('Recherche lancée...')
}

</script>