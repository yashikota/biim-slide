<script setup lang="ts">
// BiimFrame は overflow:hidden なので、はみ出す吹き出しの尻尾は外側のラッパーに描く
</script>

<template>
  <div class="biim-speech">
    <BiimFrame class="biim-speech-body">
      <slot />
    </BiimFrame>
    <span class="biim-speech-tail" />
  </div>
</template>

<style scoped>
.biim-speech {
  position: relative;
  min-width: 0;
  min-height: 0;
}
.biim-speech > .biim-speech-body {
  height: 100%;
  padding: 0.3rem 1rem; /* 下段は低いので、余白を詰めて文字の領域を広げる */
}
/* 左辺の中央から、アイコン側へ突き出す三角 */
.biim-speech-tail {
  position: absolute;
  top: 50%;
  left: -7px;
  width: 14px;
  height: 14px;
  transform: translateY(-50%) rotate(45deg);
  box-sizing: border-box;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  background: var(--biim-bg, #121212);
}
</style>
