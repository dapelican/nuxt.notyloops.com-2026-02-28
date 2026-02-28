<script setup>
const model = defineModel({
  type: String,
  default: '',
});

defineProps({
  option_list: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['change']);
</script>

<template>
  <select
    v-model="model"
    class="single-select"
    @change="emit('change')"
  >
    <option
      v-for="option in option_list"
      :key="option.id"
      :value="option.id"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.single-select {
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: 6px;
  color: var(--color-input-text);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 8px 12px;
}

.single-select:focus {
  border-color: var(--color-main);
  outline: none;
}
</style>
