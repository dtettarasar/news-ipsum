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
  text: { type: String, default: "Section Title" },
  textColor: { type: String, default: '#000000' },
  backgroundColor: { type: String, default: '' }
})

const textStyle = computed(() => ({
  color: props.textColor
}))

</script>