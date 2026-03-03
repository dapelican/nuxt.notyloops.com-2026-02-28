<script setup>
const props = defineProps({
  tag_list: {
    type: Array,
    required: true,
  },
  selected_tag_id_list: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:selected_tag_id_list']);

const tag_search_input = ref('');

const local_tag_option_list = computed(() =>
  props.tag_list.filter((tag) => !props.selected_tag_id_list.includes(tag.id))
);

const selected_tag_list = computed(() =>
  props.selected_tag_id_list
    .map((tag_id) => props.tag_list.find((tag) => tag.id === tag_id))
    .filter(Boolean)
);

const filtered_tag_list = computed(() => {
  if (!tag_search_input.value.trim()) {
    return [];
  }
  const query = tag_search_input.value.trim().toLowerCase();
  return local_tag_option_list.value.filter((tag) => tag.label.toLowerCase().includes(query));
});

const addTag = (tag_id) => {
  emit('update:selected_tag_id_list', [...props.selected_tag_id_list, tag_id]);
  tag_search_input.value = '';
};

const removeTag = (tag_id) => {
  emit('update:selected_tag_id_list', props.selected_tag_id_list.filter((id) => id !== tag_id));
};
</script>

<template>
  <!-- SelectTagsInputElements.vue -->
  <section class="select-tags-input-elements">
    <header class="header">
      <tag-element
        v-for="tag in selected_tag_list"
        :id="tag.id"
        :key="tag.id"
        :label="tag.label"
        with_close_icon
        @remove_tag="removeTag(tag.id)"
      />
    </header>

    <main class="main">
      <div class="tag-search-wrapper">
        <input
          v-model="tag_search_input"
          type="text"
          class="input-type-text"
          :placeholder="$t('t_select_tags')"
        >
        <div
          v-if="filtered_tag_list.length > 0"
          class="tag-suggestions"
        >
          <div
            v-for="tag in filtered_tag_list"
            :key="tag.id"
            class="tag-suggestion-item"
            @click="addTag(tag.id)"
          >
            {{ tag.label }}
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.main {
  margin-top: 1rem;
}

.tag-search-wrapper {
  position: relative;
  width: 100%;
}

.tag-suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10;
  background-color: var(--color-background-contrasting);
  border: 1px solid var(--color-uploader-border);
  border-radius: 4px;
  box-shadow: 0 4px 12px var(--color-generic-popup-box-shadow);
  max-height: 200px;
  overflow-y: auto;
}

.tag-suggestion-item {
  padding: 0.4rem 0.6rem;
  font-family: var(--font-regular);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.tag-suggestion-item:not(:last-child) {
  border-bottom: 1px solid var(--color-card-border);
}

.tag-suggestion-item:hover {
  background-color: var(--color-pagination-hover);
}
</style>
