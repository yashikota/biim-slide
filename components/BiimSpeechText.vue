<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { commentAt, useLiveSlide } from '../composables/liveSlide'

// ノートの各行を、指定したクリックで 1 つずつ表示する([click] 記法は composables/liveSlide.ts)
const { currentSlideNo, clicks } = useNav()
const { comments } = useLiveSlide(currentSlideNo)

const text = computed(() => commentAt(comments.value, clicks.value))
</script>

<template>
  <BiimFitText :text="text" :max="36" :min="10" />
</template>
