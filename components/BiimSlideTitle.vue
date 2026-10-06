<script setup lang="ts">
import { useNav } from '@slidev/client'
import { useLiveSlide } from '../composables/liveSlide'

const { currentSlideNo } = useNav()
const { title } = useLiveSlide(currentSlideNo)
</script>

<template>
  <BiimFitText class="biim-slide-title" :text="title" :max="16" :min="9" />
</template>

<style scoped>
.biim-slide-title {
  font-weight: bold;
}
</style>
