<script setup lang="ts">
import { useNav } from '@slidev/client'

// いまのページ / 全ページ数
const { currentSlideNo, total } = useNav()
</script>

<template>
  <div class="biim-page-no font-mono">
    <span class="now">{{ currentSlideNo }}</span><span class="rest"><span class="sep">/</span>{{ total }}</span>
  </div>
</template>

<style scoped>
.biim-page-no {
  font-size: 1.3rem;
  line-height: 1;
  white-space: nowrap;
}
.now {
  font-weight: bold;
}
.rest {
  color: #9ca3af; /* 灰色 */
}
.sep {
  margin: 0 0.15em;
}
</style>
