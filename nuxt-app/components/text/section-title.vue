<template>
    <div
        class="md:text-2xl lg:text-5xl font-bold inline-block"
        :style="sectionStyle"
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
  backgroundColor: { type: String, default: '#bdc3c7' }
})

const textStyle = computed(() => ({
  color: props.textColor
}))

const sectionStyle = computed(() => ({
  background: props.backgroundColor
    ? `linear-gradient(to top, ${props.backgroundColor} 0%, ${props.backgroundColor} 50%, transparent 50%)`
    : undefined
}))

</script>