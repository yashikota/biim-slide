<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import { useLiveSlide } from '../composables/liveSlide'
import { parseEst } from '../composables/biimTimer'

// スプリット表(RTA のスプリットのように、予定時間は累計)。いまのスライドが見える位置にスクロールする。
const { total, currentSlideNo } = useNav()
const list = ref<HTMLElement>()

// 各スライドの est を読み、先頭からの累計(秒)にする。est のないスライドは 0 秒として足す
const lives = Array.from({ length: total.value }, (_, i) => useLiveSlide(i + 1))
const cumulative = computed(() => {
  let sum = 0
  return lives.map((l) => {
    sum += parseEst(l.frontmatter.value.est) ?? 0
    return sum
  })
})

watch(currentSlideNo, async () => {
  await nextTick()
  const el = list.value?.querySelector<HTMLElement>('.current')
  if (list.value && el)
    list.value.scrollTop = el.offsetTop - (list.value.clientHeight - el.offsetHeight) / 2
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div ref="list" class="biim-splits">
    <BiimSplitRow v-for="(sec, i) in cumulative" :key="i" :no="i + 1" :cumulative="sec" />
  </div>
</template>

<style scoped>
.biim-splits {
  position: relative; /* 行の offsetTop の基準 */
  flex: 1;
  min-height: 0;
  margin: 0.3rem 0;
  overflow: hidden;
}
</style>
