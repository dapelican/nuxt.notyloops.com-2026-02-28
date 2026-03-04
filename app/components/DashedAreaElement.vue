<template>
  <section class="dashed-area">
    <slot />
  </section>
</template>

<style scoped>
.dashed-area {
  border: 2px dashed var(--color-uploader-border);
  border-radius: 5px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: border-color 0.2s, background-color 0.2s;
}

.dashed-area:hover {
  border-color: var(--color-uploader-border-active);
}
</style>
