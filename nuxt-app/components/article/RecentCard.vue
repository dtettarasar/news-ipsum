<template>

    <article
      class="rounded-xl p-3 cursor-pointer transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0px_#000]"
      :style="{ backgroundColor: cardBackground }"
    >
      <a :href="`/article/read/${slug}`" class="block">
        <div
          class="h-32 rounded-lg bg-white/60 flex items-center justify-center overflow-hidden"
          :style="{
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        >
          <span v-if="!image" class="font-bold uppercase tracking-widest text-xs">Image</span>
        </div>

        <div class="pt-3">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-xs uppercase tracking-wide border border-black border-2"
          >
            {{ category }}
          </span>

          <h3 class="mt-2 text-sm font-bold leading-tight line-clamp-2">
            {{ title }}
          </h3>
        </div>
      </a>
    </article>

</template>

<script setup lang="ts">

    interface Props {
      title: string
      slug: string
      image: string
      category: string
    }

    const props = withDefaults(defineProps<Props>(), {
      title: 'Titre de l\'article — maquette à valider',
      slug: 'recent-article',
      image: '',
      category: 'Tech',
    })

    // Couleurs de fond aléatoires SSR-safe (même pattern que Card.vue)
    const fallbackColors = ['#c5fbe1', '#f0fecd', '#f1d0fb', '#fdebdd', '#fddddd', '#dde5fd']

    const cardBackground = useState<string>(`recent-card-bg-${props.slug}`, () => {
      return fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
    })

</script>
