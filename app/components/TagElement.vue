<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  with_close_icon: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['remove_tag']);
</script>

<template>
  <!-- TagElement.vue -->
  <section class="tag">
    <span>
      {{ label }}
    </span>
    <Icon
      v-if="with_close_icon"
      name="uil:times"
      size="20"
      class="close-icon"
      @click="emit('remove_tag', id)"
    />
  </section>
</template>

<style scoped>
.close-icon {
  cursor: pointer;
}

.tag {
  align-items: center;
  background-color: var(--color-main);
  border-radius: 4px;
  color: var(--color-text-on-button);
  display: flex;
  font-size: 0.9rem;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: fit-content;
}
</style>
