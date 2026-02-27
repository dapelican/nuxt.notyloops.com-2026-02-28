<script setup>
defineProps({
  with_top_margin: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div
    class="loading-spinner"
    :class="{ 'with-top-margin': with_top_margin }"
  >
    <div class="spinner" />
  </div>
</template>

<style scoped>
.loading-spinner {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.spinner {
  border: 4px solid var(--color-loading-spinner-border);
  border-radius: 50%;
  border-top: 4px solid var(--color-loading-spinner-border-top);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.with-top-margin {
  margin-top: 4rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
