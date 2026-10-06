<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useNav } from '@slidev/client'
import { elapsed, recordSplit, reset, running, toggle } from '../composables/biimTimer'

const { currentSlideNo, hasNext } = useNav()
const toggleTimer = () => toggle(currentSlideNo.value)

// 先のスライドへ進んだら、離れたスライドを終えた瞬間のタイマー値を確定する
watch(currentSlideNo, (now, prev) => {
  if (prev != null && now > prev)
    recordSplit(prev)
})

// Slidev の「次へ」のキー(右、下、PageDown、Space)
const isNextKey = (e: KeyboardEvent) =>
  ['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)

// s キー/クリックで開始・停止、r キー(停止中のみ)/ダブルクリックでリセット。入力欄での入力や修飾キーとの組み合わせは無視。
// 最後のスライドの最後のクリックで「次へ」を押したら停止する。
function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat)
    return
  const el = e.target as HTMLElement | null
  if (el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName ?? ''))
    return
  if (e.key === 's')
    toggleTimer()
  else if (e.key === 'r' && !running.value)
    reset()
  else if (isNextKey(e) && !hasNext.value && running.value)
    toggleTimer() // 最後のスライドを終えて先へ進もうとしたら、タイマーを止めて確定する
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

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
