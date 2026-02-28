<script setup>
const props = defineProps({
  design_type: {
    type: Number,
    required: true,
    validator: (value) => [1, 2, 3].includes(value),
  },
  icon: {
    type: String,
    default: '',
  },
  button_type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  waiting: {
    type: Boolean,
    default: false,
  },
  smaller_button: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['button_clicked']);
</script>

<template>
  <button
    :type="props.button_type"
    :disabled="props.disabled || props.waiting"
    :class="[
      'button',
      `button-${props.design_type}`,
      { 'with-icon': props.icon || props.waiting },
      { [`button-${props.design_type}-disabled`]: props.disabled || props.waiting },
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
  border-radius: 5px;
  cursor: pointer;
  padding: 0.7rem 1.5rem;
}

.button-1 {
  background-color: var(--color-main);
  border: 2px solid var(--color-main);
  color: var(--color-text-on-button);
}

.button-1-disabled {
  background-color: var(--color-disabled);
  border: 2px solid var(--color-disabled);
  cursor: not-allowed;
}

.button-2 {
  background-color: inherit;
  border: 2px solid var(--color-main);
  color: var(--color-main);
}

.button-3 {
  background-color: var(--color-dangerous-action);
  border: 2px solid var(--color-dangerous-action);
  color: var(--color-text-on-button);
}

.spin {
  animation: spin 1s linear infinite;
}

.with-icon {
  align-items: center;
  display: inline-flex;
  gap: 0.4rem;
  text-decoration: none;
  white-space: nowrap;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hover styles - only apply on devices that support hover */
@media (hover: hover) {
  .button-1:hover {
    background-color: var(--color-complementary);
    color: var(--color-text-on-button);
    border: 2px solid var(--color-complementary);
  }

  .button-2:hover {
    background-color: var(--color-complementary);
    color: var(--color-text-on-button);
    border: 2px solid var(--color-complementary);
  }
}
</style>
