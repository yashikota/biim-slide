<script setup lang="ts">
import { computed } from 'vue'
import { configs } from '@slidev/client'

// 固定タイトルとジャンルは、スライド冒頭の frontmatter(title / genre)で指定する
const name = computed(() => [configs.title, configs.genre].filter(Boolean).join(' '))
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
