<template>
    <div
        class="md:text-2xl lg:text-5xl font-bold inline-block"
    >
        <h2 :style="textStyle">
            {{ text }}
        </h2>
    </div>
</template>

<script setup>

import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: "Section Title"
  },
  textColor: { type: String, default: '' },   // ex. #1a1a1a
  backgroundColor: { type: String, default: '' }  // ex. #3b82f6
})

const textStyle = computed(() => ({
  color: props.textColor || '#000000'
}))

</script>