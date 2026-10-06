<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// scaled: 中身を designWidth x designHeight の画面として描画し、枠に収まるよう縮小する(比率維持)
const props = withDefaults(defineProps<{
  scaled?: boolean
  designWidth?: number
  designHeight?: number
  background?: string
}>(), {
  scaled: false,
  designWidth: 980,
  designHeight: 552,
})

const frame = ref<HTMLElement>()
const scale = ref(1)
let observer: ResizeObserver | undefined

function update() {
  if (!frame.value)
    return
  scale.value = Math.min(
    frame.value.clientWidth / props.designWidth,
    frame.value.clientHeight / props.designHeight,
  )
}

onMounted(() => {
  if (!props.scaled)
    return
  update()
  observer = new ResizeObserver(update)
  observer.observe(frame.value!)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    ref="frame"
    class="biim-frame"
    :class="{ plain: !scaled, 'has-bg': !!background }"
    :style="background ? { backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${background})` } : undefined"
  >
    <div
      v-if="scaled"
      class="biim-frame-screen"
      :style="{ width: `${designWidth}px`, height: `${designHeight}px`, transform: `scale(${scale})` }"
    >
      <slot />
    </div>
    <slot v-else />
  </div>
</template>

<style scoped>
.biim-frame {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 2px solid currentColor;
  border-radius: 6px;
  box-sizing: border-box;
}
.biim-frame.plain {
  padding: 1rem 1.5rem;
}
.biim-frame.has-bg {
  background-size: cover;
  background-position: center;
  color: #fff;
}
.has-bg .biim-frame-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.biim-frame-screen {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  box-sizing: border-box;
  padding: 2.5rem 3.5rem; /* Slidev 標準レイアウトの余白 */
}
</style>
