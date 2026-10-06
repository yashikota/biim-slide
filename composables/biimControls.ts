import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useNav } from '@slidev/client'
import { recordSplit, reset, running, toggle } from './biimTimer'

// Slidev の「次へ」のキー(右、下、PageDown、Space)
const isNextKey = (e: KeyboardEvent) =>
  ['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)

/**
 * タイマーの操作(外枠を置く global-top で 1 回だけ呼ぶ)。
 * - s: 開始/停止  r: リセット(停止中のみ)
 * - 先のスライドへ進んだら、離れたスライドを終えた瞬間のタイマー値を確定する
 * - 最後のスライドの最後のクリックで「次へ」を押したら、停止して確定する
 * 入力欄での入力や、修飾キーとの組み合わせは無視する。
 */
export function useBiimControls() {
  const { currentSlideNo, hasNext } = useNav()

  watch(currentSlideNo, (now, prev) => {
    if (prev != null && now > prev)
      recordSplit(prev)
  })

  function onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat)
      return
    const el = e.target as HTMLElement | null
    if (el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName ?? ''))
      return
    if (e.key === 's')
      toggle(currentSlideNo.value)
    else if (e.key === 'r' && !running.value)
      reset()
    else if (isNextKey(e) && !hasNext.value && running.value)
      toggle(currentSlideNo.value)
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
