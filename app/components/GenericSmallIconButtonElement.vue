<script setup>
const props = defineProps({
  design_type: {
    type: Number,
    required: true,
    validator: (value) => [1, 2].includes(value),
  },
  icon: {
    type: String,
    default: '',
  },
  button_type: {
    type: String,
    default: 'button',
  },
  icon_only: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['button_clicked']);
</script>

<template>
  <button
    :class="[
      'button',
      `button-${props.design_type}`,
    ]"
    @click="emit('button_clicked')"
  >
    <Icon
      name="uil:tag-alt"
      size="16"
    />
  </button>
</template>

<style scoped>
.button {
  align-items: center;
  border-radius: 6px;
  color: var(--color-main);
  cursor: pointer;
  display: flex;
  font-size: 0.85rem;
  gap: 0.4rem;
  padding: 5px 12px;
  transition: background 0.15s, color 0.15s;
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

.bulk-action-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--color-main);
  border-radius: 6px;
  color: var(--color-main);
  cursor: pointer;
  display: flex;
  font-size: 0.85rem;
  gap: 0.4rem;
  padding: 5px 12px;
  transition: background 0.15s, color 0.15s;
}

.bulk-action-btn:hover {
  background: var(--color-main);
  color: var(--color-text-on-button);
}
</style>
