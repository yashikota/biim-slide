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
const pad = (n: number) => String(n).padStart(2, '0')

// 1時間超えは想定しない: mm:ss.cc
const main = computed(() => {
  const total = Math.floor(elapsed.value / 1000)
  return `${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`
})
const centi = computed(() => pad(Math.floor(elapsed.value / 10) % 100))
</script>

<template>
  <!-- クリックで開始/停止、ダブルクリックでリセット -->
  <div class="biim-timer">
    <div class="biim-timer-text" @click="toggle" @dblclick="reset">
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
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  /* 枠の幅いっぱい(実測で、この除数なら幅の約98%) */
  font-size: calc(100cqw / 3.9);
  line-height: 1;
  white-space: nowrap;
  padding-top: 0.4rem;
  cursor: pointer;
  user-select: none;
}
.centi {
  font-size: 0.65em;
}
</style>
