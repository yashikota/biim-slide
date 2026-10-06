<script setup lang="ts">
import { useBiimControls } from './composables/biimControls'

// 全スライドの上に固定表示される外枠(Slidev の global layer)。
// スライドは layouts/biim.vue が左上の窓にだけ描画するので、窓の外はここで覆い隠す。
useBiimControls() // タイマーのキー操作(s / r / 最後で停止)とスプリットの確定
</script>

<template>
  <div class="biim-chrome">
    <div class="biim-mask" />

    <div class="biim-grid">
      <!-- 左上: スライド本文の窓(枠線だけ) -->
      <BiimFrame class="biim-main" />

      <BiimIcon class="biim-icon" />
      <BiimSpeech class="biim-speech">
        <BiimSpeechText />
      </BiimSpeech>

      <!-- 右端: 上(スライドのタイトル) 2 : 下(固定タイトル・タイマー) 6 -->
      <div class="biim-side">
        <BiimFrame class="biim-title">
          <BiimSlideTitle />
        </BiimFrame>
        <BiimFrame class="biim-info">
          <BiimDeckInfo />
          <BiimSplits />
          <BiimTimer />
        </BiimFrame>
      </div>
    </div>
  </div>
</template>

<style scoped>
.biim-chrome {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 窓(メインの内側)だけ抜いた、スライド背景色の覆い */
.biim-mask {
  position: absolute;
  inset: 0;
  background: var(--biim-bg);
  clip-path: polygon(
    evenodd,
    0 0, 100% 0, 100% 100%, 0 100%, 0 0,
    var(--biim-hole-l) var(--biim-hole-t),
    var(--biim-hole-l) var(--biim-hole-b),
    var(--biim-hole-r) var(--biim-hole-b),
    var(--biim-hole-r) var(--biim-hole-t),
    var(--biim-hole-l) var(--biim-hole-t)
  );
}

/*
 * メインの外寸 = 内側 + 罫線。下段の高さ(= アイコンの直径)は、残りの高さから決まる。
 */
.biim-grid {
  --main-w: calc(var(--biim-main-w) + var(--biim-border) * 2);
  --main-h: calc(var(--biim-main-h) + var(--biim-border) * 2);
  --icon: calc(552px - var(--biim-gap) * 3 - var(--main-h));
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: var(--icon) calc(var(--main-w) - var(--icon) - var(--biim-gap)) 1fr;
  grid-template-rows: var(--main-h) 1fr;
  gap: var(--biim-gap);
  padding: var(--biim-gap);
  box-sizing: border-box;
  color: var(--slidev-theme-fg, inherit);
}
.biim-grid :deep(.biim-main) {
  grid-column: 1 / 3;
  grid-row: 1;
  padding: 0;
}
.biim-grid :deep(.biim-icon) {
  grid-column: 1;
  grid-row: 2;
}
/* アイコンの右から右端まで。子コンポーネントのルートへは :deep で当てる(本番ビルドで scoped が付かないことがあった) */
.biim-grid :deep(.biim-speech) {
  grid-column: 2 / 4;
  grid-row: 2;
}
.biim-side {
  grid-column: 3;
  grid-row: 1;
  display: grid;
  grid-template-rows: 2fr 6fr;
  gap: var(--biim-gap);
  min-width: 0;
  min-height: 0;
}
/* 右端は狭いので、枠の余白を詰める */
.biim-side > .biim-frame {
  padding: 0.4rem 0.5rem;
}
.biim-title {
  display: flex;
  align-items: center;
}
/* 固定タイトル(BiimDeckInfo)は上、スプリット表は真ん中、タイマーは一番下 */
.biim-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
