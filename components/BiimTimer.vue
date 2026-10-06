<script lang="ts">
import { computed, ref } from 'vue'

// レイアウトはスライドごとに作り直されるので、タイマーの状態はモジュール側(全インスタンス共有)に置く
const elapsed = ref(0) // ms
const running = ref(false)
let startedAt = 0
let base = 0
let frameId = 0

function tick() {
  elapsed.value = base + (performance.now() - startedAt)
  frameId = requestAnimationFrame(tick)
}

function toggle() {
  if (running.value) {
    cancelAnimationFrame(frameId)
    running.value = false
    return
  }
  base = elapsed.value
  startedAt = performance.now()
  running.value = true
  tick()
}

function reset() {
  base = 0
  startedAt = performance.now()
  elapsed.value = 0
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

// s キーで開始/停止、r キーで(停止中のみ)リセット。入力欄での入力や修飾キーとの組み合わせは無視
function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat)
    return
  const el = e.target as HTMLElement | null
  if (el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName ?? ''))
    return
  if (e.key === 's')
    toggle()
  else if (e.key === 'r' && !running.value)
    reset()
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
  <!-- s キーまたはクリックで開始/停止、r キー(停止中のみ)またはダブルクリックでリセット -->
  <div class="biim-timer">
    <div class="biim-timer-text font-mono" @click="toggle" @dblclick="reset">
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
