<script setup>
const props = defineProps({
  button_type: {
    type: String,
    default: 'button',
  },
  design_type: {
    type: Number,
    required: true,
    validator: (value) => [1, 2].includes(value),
  },
  icon: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['button_clicked']);
</script>

<template>
  <!-- GenericSecondaryButtonElement.vue -->
  <button
    :type="props.button_type"
    :class="[
      'button',
      `button-${props.design_type}`,
    ]"
    @click="emit('button_clicked')"
  >
    <Icon
      v-if="props.waiting"
      name="uil:spinner-alt"
      size="18"
      class="spin"
    />
    <Icon
      v-else-if="props.icon"
      :name="props.icon"
      size="18"
    />
    <slot />
  </button>
</template>

<style scoped>
.button {
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  gap: 0.4rem;
  height: 36px;
  min-width: 36px;
  padding: 0 8px;
  width: fit-content;
}

.button-1 {
  background-color: var(--color-main);
  border: 1px solid var(--color-main);
  color: var(--color-text-on-button);
}

.button-2 {
  background-color: inherit;
  border: 1px solid var(--color-main);
  color: var(--color-main);
}

.button-3 {
  background-color: var(--color-dangerous-action);
  border: 1px solid var(--color-dangerous-action);
  color: var(--color-text-on-button);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hover styles - only apply on devices that support hover */
@media (hover: hover) {
  .button-1:hover {
    background-color: var(--color-complementary);
    border: 1px solid var(--color-complementary);
    color: var(--color-text-on-button);
  }

  .button-2:hover {
    background-color: var(--color-complementary);
    border: 1px solid var(--color-complementary);
    color: var(--color-text-on-button);
  }
}
</style>
