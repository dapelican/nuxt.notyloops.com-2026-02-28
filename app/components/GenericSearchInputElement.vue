<script setup>
const model = defineModel({
  type: String,
  default: '',
});

defineProps({
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['search', 'clear']);
</script>

<template>
  <!-- GenericSearchInputElement.vue -->
  <div class="search-input-container">
    <Icon
      name="uil:search"
      class="search-icon"
      size="18"
    />
    <input
      v-model="model"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      @input="emit('search')"
    >

    <Icon
      name="uil:times"
      class="close-icon"
      size="20"
      @click="emit('clear')"
    />
  </div>
</template>

<style scoped>
.close-icon {
  color: var(--color-input-text);
  cursor: pointer;
  position: absolute;
  right: 10px;
}

.search-icon {
  color: var(--color-disabled);
  left: 10px;
  position: absolute;
}

.search-input {
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: 6px;
  color: var(--color-input-text);
  font-size: 0.95rem;
  padding: 8px 10px 8px 36px;
  width: 100%;
}

.search-input:focus {
  border-color: var(--color-main);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-input-placeholder);
}

.search-input-container {
  align-items: center;
  display: flex;
  flex: 1;
  min-width: 200px;
  position: relative;
}
</style>
