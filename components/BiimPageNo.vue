<script setup lang="ts">
import { useNav } from '@slidev/client'

// いまのページ / 全ページ数
const { currentSlideNo, total } = useNav()
</script>

<template>
  <div class="biim-page-no font-mono">
    <span class="now">{{ currentSlideNo }}</span><span class="sep">/</span><span>{{ total }}</span>
  </div>
</template>

<style scoped>
.biim-page-no {
  font-size: 0.7rem;
  line-height: 1;
  white-space: nowrap;
  color: #9ca3af; /* 灰色 */
}
.now {
  font-weight: bold;
  color: var(--slidev-theme-fg, currentColor);
}
.sep {
  margin: 0 0.1em;
}
</style>
