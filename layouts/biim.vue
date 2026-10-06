<script setup lang="ts">
// frontmatter の background を左上の枠の背景として使う(seriph の cover と同様)
defineProps<{ background?: string }>()
</script>

<template>
  <div class="biim slidev-layout">
    <BiimFrame scaled :background="background" class="biim-main">
      <slot />
    </BiimFrame>
    <BiimIcon class="biim-icon" />
    <BiimSpeech class="biim-speech" />
    <div class="biim-side">
      <BiimFrame class="biim-title" />
      <BiimFrame class="biim-timer">
        <BiimStatus />
        <BiimTimer />
      </BiimFrame>
    </div>
  </div>
</template>

<style scoped>
/*
 * 画面は 980x552。左上の枠は画面と同じ比率(980:552)で縮小表示する。
 * 枠の外寸 = 980*s + 4px(罫線) x 552*s + 4px
 * 下段の高さ(= アイコンの直径)は、残りの高さから決まる。
 */
.biim {
  --gap: 10px;
  --s: 0.8;
  --main-w: calc(980px * var(--s) + 4px);
  --main-h: calc(552px * var(--s) + 4px);
  --icon: calc(552px - var(--gap) * 3 - var(--main-h));
  --biim-bg: #fff;
  display: grid;
  grid-template-columns: var(--icon) calc(var(--main-w) - var(--icon) - var(--gap)) 1fr;
  grid-template-rows: var(--main-h) 1fr;
  gap: var(--gap);
  padding: var(--gap);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.biim-main {
  grid-column: 1 / 3;
  grid-row: 1;
}
.biim-icon {
  grid-column: 1;
  grid-row: 2;
}
/* 右端: 上(タイトル) 2 : 下(タイマーと est) 6 */
.biim-side {
  grid-column: 3;
  grid-row: 1;
  display: grid;
  grid-template-rows: 2fr 6fr;
  gap: var(--gap);
  min-width: 0;
  min-height: 0;
}
/* 右端は狭いので、枠の余白を詰める */
.biim-side > .biim-frame.plain {
  padding: 0.4rem 0.5rem;
}
/* タイマー枠: ステータスは上、タイマーは一番下 */
.biim-timer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* アイコンの右から右端まで */
.biim-speech {
  grid-column: 2 / 4;
  grid-row: 2;
}
</style>

<style>
/* スライド背景色(吹き出しの尻尾の塗りつぶし用)。scoped だとダーク側が効かないので別ブロック */
html.dark .biim {
  --biim-bg: #121212;
}
</style>
