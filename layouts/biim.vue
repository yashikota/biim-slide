<script setup lang="ts">
// frontmatter の background を左上の枠の背景として使う(seriph の cover と同様)
defineProps<{ background?: string }>()
</script>

<template>
  <div class="biim slidev-layout">
    <BiimFrame scaled :background="background" class="biim-main">
      <slot />
    </BiimFrame>
  </div>
</template>

<style scoped>
/*
 * 画面は 980x552。左上の枠は画面と同じ比率(980:552)で縮小表示する。
 * 枠の外寸 = 980*s + 4px(罫線) x 552*s + 4px
 */
.biim {
  --gap: 10px;
  --s: 0.8;
  display: grid;
  grid-template-columns: calc(980px * var(--s) + 4px) 1fr;
  grid-template-rows: calc(552px * var(--s) + 4px) 1fr;
  gap: var(--gap);
  padding: var(--gap);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.biim-main {
  grid-column: 1;
  grid-row: 1;
}
</style>
