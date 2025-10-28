<template>

    <div class="border-t-1 border-b-1 px-4 bg-blue-200 flex flex-row">

        <div class="hidden lg:flex flex-row basis-full justify-between items-center">

            <!--Menu desktop-->

            <div>
                <img src="/logos/logoipsum-381.svg" alt="Logo du site" class="h-8 w-auto" />
            </div>

            <div class="flex flex-row justify-center items-center gap-8 h-full">
                
                <div class="menu-item-container mt-[20px] h-[40px] flex flex-col justify-between items-center group">
                    <a href="/" class="">Home</a>
                    <div class="rectangle w-[30px] h-[4px] rounded-t-full bg-transparent group-hover:bg-black transition-all duration-300"></div>
                </div>

                <div class="menu-item-container mt-[20px] h-[40px] flex flex-col justify-between items-center group">
                    <a href="/about" class="">About</a>
                    <div class="rectangle w-[30px] h-[4px] rounded-t-full bg-transparent group-hover:bg-black transition-all duration-300"></div>
                </div>
                
                <div class="menu-item-container mt-[20px] h-[40px] flex flex-col justify-between items-center group">
                    <a href="/contact" class="">Contact</a>
                    <div class="rectangle w-[30px] h-[4px] rounded-t-full bg-transparent group-hover:bg-black transition-all duration-300"></div>
                </div>

                <div class="menu-item-container mt-[20px] h-[40px] flex flex-col justify-between items-center group">
                    <a href="#" class="">All articles</a>
                    <div class="rectangle w-[30px] h-[4px] rounded-t-full bg-transparent group-hover:bg-black transition-all duration-300"></div>
                </div>

            </div>

            <div> 
                user section
            </div>

        </div>

        <div class="flex lg:hidden">

            <!--Menu mobile-->

            menu mobile to do

        </div>

        

    </div>

</template>

<script setup>



</script>

<style scoped>

</style>