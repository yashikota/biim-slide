<template>
  <div class="biim-frame">
    <slot />
  </div>
</template>

<style scoped>
.biim-frame {
  min-width: 0;
  min-height: 0;
  padding: 1rem 1.5rem;
  overflow: hidden;
  border: var(--biim-border, 2px) solid currentColor;
  border-radius: 6px;
  box-sizing: border-box;
}
</style>
