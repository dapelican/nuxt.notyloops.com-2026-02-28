<script setup>
const {
  search_criteria_tag_id_set,
} = useSearchAndSelectItems(ITEM_TYPE_NOTE);

const all_tag_list = ref([]);
const tag_option_list = ref([]);

// search tags with sort by label asc
const {
  data: tag_data,
  error: tag_error,
} = await useFetch('/tags/get-user-tags');

if (tag_error.value) {
  handleFrontendError(null, tag_error.value.data?.error_message);
}

if (tag_data.value) {
  all_tag_list.value = tag_data.value.tag_list;
  tag_option_list.value = tag_data.value.tag_list
    .filter((tag) => !search_criteria_tag_id_set.value.has(tag.id));
}

const tag_search_input = ref('');

const selected_tag_list = computed(() => {
  return Array.from(search_criteria_tag_id_set.value).map((tag_id) => {
    return all_tag_list.value.find((tag) => tag.id === tag_id);
  }).filter(Boolean);
});

const filtered_tag_list = computed(() => {
  if (!tag_search_input.value.trim()) {
    return [];
  }
  const query = tag_search_input.value.trim().toLowerCase();
  return tag_option_list.value.filter((tag) => tag.label.toLowerCase().includes(query));
});

const addTag = (tag_id) => {
  search_criteria_tag_id_set.value.add(tag_id);
  tag_option_list.value = tag_option_list.value.filter((tag) => tag.id !== tag_id);
  tag_search_input.value = '';
};

const removeTag = (tag_id) => {
  search_criteria_tag_id_set.value.delete(tag_id);
  tag_option_list.value = tag_option_list.value.filter((tag) => tag.id !== tag_id);
};
</script>

<template>
  <section class="select-tags-input-elements">
    search_criteria_tag_id_set: {{ search_criteria_tag_id_set }}
    <header>
      <span>
        {{ $t('t_selected_tags_with_colon') }}
      </span>
      <tag-element
        v-for="tag in selected_tag_list"
        :id="tag.id"
        :key="tag.id"
        :label="tag.label"
        with_close_icon
        @remove_tag="removeTag(tag.id)"
      />
    </header>

    <main>
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
