<script setup lang="ts">
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const { currentSlideRoute } = useNav()
const { $slidev } = useSlideContext()

const frontmatter = computed<Record<string, any>>(
  () => currentSlideRoute.value?.meta?.slide?.frontmatter ?? {},
)

const title = computed(() => currentSlideRoute.value?.meta?.slide?.title ?? '')
// genre はスライドの frontmatter、なければ冒頭の headmatter から
const genre = computed(() => frontmatter.value.genre ?? $slidev.configs.genre ?? '')
const name = computed(() => [title.value, genre.value].filter(Boolean).join(' '))
</script>

<template>
  <div class="biim-status">
    <div class="biim-status-name">{{ name }}</div>
    <div class="biim-status-progress">100%</div>
  </div>
</template>

<style scoped>
.biim-status {
  text-align: left;
}
.biim-status-name {
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.biim-status-progress {
  font-size: 0.7rem;
  color: #9ca3af; /* 灰色 */
}
</style>
