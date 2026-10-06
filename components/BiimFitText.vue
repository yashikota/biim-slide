<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadDefaultJapaneseParser } from 'budoux'

// 親(枠)に収まる最大の文字サイズを探して表示する。上下は中央寄せ。
// 日本語は BudouX で文節に分け、文節の途中では改行しない。
const props = withDefaults(defineProps<{
  text: string
  max?: number // px
  min?: number // px
}>(), {
  max: 16,
  min: 9,
})

const parser = loadDefaultJapaneseParser()
const hasJapanese = (s: string) => /[぀-ヿ㐀-鿿]/.test(s)
const phrases = computed(() => hasJapanese(props.text) ? parser.parse(props.text) : [props.text])

const box = ref<HTMLElement>()
let observer: ResizeObserver | undefined

function overflows(el: HTMLElement) {
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth
}

// 収まる最大のサイズを二分探索する(文字サイズは直接 style に入れて、その場で測る)
function fit() {
  const el = box.value
  if (!el)
    return
  let lo = props.min
  let hi = props.max
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    el.style.fontSize = `${mid}px`
    if (overflows(el))
      hi = mid - 1
    else
      lo = mid
  }
  el.style.fontSize = `${lo}px`
}

onMounted(() => {
  fit()
  observer = new ResizeObserver(fit)
  observer.observe(box.value!.parentElement!)
  // Web フォントの読み込みで文字幅が変わるので、読み込み後にも合わせ直す
  document.fonts?.ready.then(fit)
})
onBeforeUnmount(() => observer?.disconnect())
watch(() => props.text, fit, { flush: 'post' })
</script>

<template>
  <div class="fit-root">
    <div ref="box" class="fit-box">
      <template v-for="(p, i) in phrases" :key="i">
        <span>{{ p }}</span><wbr>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fit-root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /* 上下中央 */
  overflow: hidden;
}
.fit-box {
  width: 100%;
  max-height: 100%;
  line-height: 1.3;
  overflow: hidden;
  /* 文節の途中では折り返さず、1文節が枠より長いときだけ強制的に折る */
  word-break: keep-all;
  overflow-wrap: anywhere;
}
</style>
