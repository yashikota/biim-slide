<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { elapsed, reset, toggle } from '../composables/biimTimer'

// 表示と、クリックでの操作(クリックで開始/停止、ダブルクリックでリセット)だけを担当する。
// キー操作とスプリットの確定は composables/biimControls.ts。
const { currentSlideNo } = useNav()
const toggleTimer = () => toggle(currentSlideNo.value)

const pad = (n: number) => String(n).padStart(2, '0')

// 1時間超えは想定しない: mm:ss.cc
const main = computed(() => {
  const total = Math.floor(elapsed.value / 1000)
  return `${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`
})
const centi = computed(() => pad(Math.floor(elapsed.value / 10) % 100))
</script>

<template>
  <div class="biim-timer">
    <div class="biim-timer-text font-mono" @click="toggleTimer" @dblclick="reset">
      <span>{{ main }}</span><span class="centi">.{{ centi }}</span>
    </div>
  </div>
</template>

<style scoped>
.biim-timer {
  container-type: inline-size;
  border-top: 1px solid #9ca3af; /* 灰色の罫線 */
}
.biim-timer-text {
  /* 等幅(字幅 0.6em)なら文字幅は 5桁 + .cc(0.65倍 x 3桁) = 4.17em。枠の幅の約98%に収める */
  font-size: calc(100cqw / 4.25);
  line-height: 1;
  white-space: nowrap;
  padding-top: 0.4rem;
  cursor: pointer;
  pointer-events: auto; /* 外枠(global-top)は pointer-events: none */
  user-select: none;
}
.centi {
  font-size: 0.65em;
}
</style>
