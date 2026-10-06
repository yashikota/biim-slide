<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentSlideRoute } = useNav()
const title = computed(() => currentSlideRoute.value?.meta?.slide?.title ?? '')
</script>

<template>
  <div class="biim-slide-title">{{ title }}</div>
</template>

<style scoped>
.biim-slide-title {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.3;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
