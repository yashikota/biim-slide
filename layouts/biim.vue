<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { useLiveSlide } from '../composables/liveSlide'

// frontmatter の background を、メインの枠の背景として使う(seriph の cover と同様)
defineProps<{ background?: string }>()

// ノートで指定された最大のクリック番号まで、クリックを用意する
const { $page } = useSlideContext()
const { comments } = useLiveSlide($page)
const extraClicks = computed(() => Math.max(0, ...comments.value.map(c => c.click)))
</script>

<template>
  <!--
    スライド本文だけを担当する。枠・アイコン・タイマーなどの外枠は global-top.vue が
    ページ遷移をまたいで固定表示し、メインの窓以外を覆う。
    そのため遷移アニメーションは窓の中だけに見える。
  -->
  <div class="slidev-layout biim">
    <div
      class="biim-viewport"
      :class="{ 'has-bg': !!background }"
      :style="background ? { backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${background})` } : undefined"
    >
      <!-- 980x552 の画面として描画し、メインの窓に収まるよう縮小する -->
      <div class="biim-screen">
        <slot />
      </div>
    </div>

    <!-- セリフ欄用のクリック。絶対位置(v-click="i")なので、スライド側の v-click と順番が競合しない -->
    <span v-for="i in extraClicks" :key="i" v-click="i" class="biim-click" />
  </div>
</template>

<style scoped>
.biim {
  position: relative;
  padding: 0;
}
.biim-viewport {
  position: absolute;
  left: var(--biim-hole-l);
  top: var(--biim-hole-t);
  width: var(--biim-main-w);
  height: var(--biim-main-h);
  overflow: hidden;
}
.biim-viewport.has-bg {
  background-size: cover;
  background-position: center;
  color: #fff;
}
.biim-click {
  position: absolute;
  width: 0;
  height: 0;
}
.biim-screen {
  width: 980px;
  height: 552px;
  transform: scale(var(--biim-s));
  transform-origin: top left;
  box-sizing: border-box;
  padding: 2.5rem 3.5rem; /* Slidev 標準レイアウトの余白 */
}
.has-bg .biim-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
