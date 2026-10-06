<script setup lang="ts">
import { computed } from 'vue'
import { configs } from '@slidev/client'

// 固定タイトルとジャンル(100% や Any% など)は、スライド冒頭の frontmatter(title / genre)で指定する
// 冒頭の frontmatter を書き換えると Slidev がページ全体を再読み込みするので、configs のままで反映される
const title = computed(() => configs.title ?? '')
const genre = computed(() => configs.genre ?? '')
</script>

<template>
  <div class="biim-status">
    <div class="biim-status-name">{{ title }}</div>
    <div class="biim-status-genre">{{ genre }}</div>
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
.biim-status-genre {
  font-size: 0.7rem;
  color: #9ca3af; /* 灰色 */
}
</style>
