<script setup lang="ts">
import defaultIcon from '../assets/icon.png'

withDefaults(defineProps<{ src?: string }>(), { src: defaultIcon })
</script>

<template>
  <!-- 画像の元サイズで親(グリッド行)が広がらないよう、画像は絶対配置にする -->
  <div class="biim-icon">
    <img :src="src" alt="">
  </div>
</template>

<style scoped>
.biim-icon {
  position: relative;
  min-height: 0;
  height: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
}
.biim-icon img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
