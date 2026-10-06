<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { elapsed, formatDelta, formatSeconds, splits } from '../composables/biimTimer'

// 予定の何 ms 前からカウントダウンを始めるか
const COUNTDOWN_MS = 5000

// 1 スライド分の行: ページ番号 / 予定との差 / 予定時間(累計)。
// 差は累計の予定とタイマー値の差。いまのスライドは、予定の 5 秒前からカウントダウンし(緑の -)、
// 超えたらそのままカウントアップする(赤の +)。スライドを終えると、その時点の差で確定する。
const props = defineProps<{
  no: number
  /** このスライドまでの予定時間の累計(秒) */
  cumulative: number
}>()

const { currentSlideNo } = useNav()
const isCurrent = computed(() => currentSlideNo.value === props.no)

// 予定との差(ms)。正ならオーバー。表示しないときは null
const delta = computed(() => {
  const split = splits[props.no]
  if (split != null)
    return split - props.cumulative * 1000 // 終えたスライド: 確定した値
  if (!isCurrent.value)
    return null
  const live = elapsed.value - props.cumulative * 1000 // いまのスライド: 進行中
  return live >= -COUNTDOWN_MS ? live : null
})
</script>

<template>
  <div class="biim-split-row" :class="{ current: isCurrent }">
    <span class="no">{{ no }}</span>
    <span
      class="delta font-mono"
      :class="delta == null ? '' : delta > 0 ? 'over' : 'under'"
    >{{ delta != null ? formatDelta(delta) : '' }}</span>
    <span class="est font-mono">{{ formatSeconds(cumulative) }}</span>
  </div>
</template>

<style scoped>
.biim-split-row {
  display: grid;
  grid-template-columns: 1.6em 1fr auto;
  gap: 4px;
  align-items: baseline;
  padding: 1px 3px;
  line-height: 1.4;
  white-space: nowrap;
}
.no {
  font-size: 1.05rem;
  font-weight: bold;
}
.delta {
  font-size: 0.62rem;
  text-align: right;
}
.est {
  font-size: 0.85rem; /* 予定時間は白 */
}
.over {
  color: #f87171;
}
.under {
  color: #4ade80;
}
.current {
  background: rgba(156, 163, 175, 0.25);
  border-radius: 3px;
}
</style>
