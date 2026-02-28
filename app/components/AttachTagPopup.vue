<script setup>
const props = defineProps({
  selected_note_id_set: {
    type: Set,
    required: true,
  },
});

const emit = defineEmits(['tags_linked']);

const show_popup = ref(false);
const search_term = ref('');
const suggestion_list = ref([]);
const selected_tag_list = ref([]);
const is_loading = ref(false);
const is_submitting = ref(false);

let search_timeout = null;

const searchTags = async () => {
  is_loading.value = true;
  try {
    const data = await $fetch('/tags/search', {
      method: 'POST',
      body: { search_term: search_term.value },
    });
    suggestion_list.value = data.tag_list.filter(
      (tag) => !selected_tag_list.value.some((s) => s.id === tag.id)
    );
  } catch (error) {
    handleFrontendError(error, error?.data?.error_message);
  } finally {
    is_loading.value = false;
  }
};

const onSearchInput = () => {
  clearTimeout(search_timeout);
  if (!search_term.value) {
    suggestion_list.value = [];
    return;
  }
  search_timeout = setTimeout(searchTags, 300);
};

const selectTag = (tag) => {
  selected_tag_list.value = [...selected_tag_list.value, tag];
  suggestion_list.value = suggestion_list.value.filter((s) => s.id !== tag.id);
  search_term.value = '';
};

const removeTag = (tag_id) => {
  selected_tag_list.value = selected_tag_list.value.filter((t) => t.id !== tag_id);
};

const resetState = () => {
  search_term.value = '';
  suggestion_list.value = [];
  selected_tag_list.value = [];
  is_submitting.value = false;
};

const handleCancel = () => {
  resetState();
  show_popup.value = false;
};

const handleAdd = async () => {
  if (selected_tag_list.value.length === 0) {
    return;
  }

  is_submitting.value = true;
  try {
    await $fetch('/note-tags/link', {
      method: 'POST',
      body: {
        note_id_list: [...props.selected_note_id_set],
        tag_id_list: selected_tag_list.value.map((tag) => tag.id),
      },
    });
    emit('tags_linked');
    resetState();
    show_popup.value = false;
  } catch (error) {
    handleFrontendError(error, error?.data?.error_message);
  } finally {
    is_submitting.value = false;
  }
};

onUnmounted(() => {
  clearTimeout(search_timeout);
});
</script>

<template>
  <GenericPopup
    v-model="show_popup"
    :title="$t('t_attach_tags')"
    :width="450"
    @close="resetState"
  >
    <template #trigger>
      <slot />
    </template>

    <template #content>
      <div class="tag-search-container">
        <input
          v-model="search_term"
          type="text"
          class="input-type-text"
          :placeholder="$t('t_search_tags')"
          @input="onSearchInput"
        >

        <ul
          v-if="suggestion_list.length > 0"
          class="suggestion-list"
        >
          <li
            v-for="tag in suggestion_list"
            :key="tag.id"
            class="suggestion-item"
            @click="selectTag(tag)"
          >
            {{ tag.label }}
          </li>
        </ul>

        <div
          v-if="selected_tag_list.length > 0"
          class="selected-tags"
        >
          <span
            v-for="tag in selected_tag_list"
            :key="tag.id"
            class="tag-badge"
          >
            {{ tag.label }}
            <button
              class="remove-tag-button"
              @click="removeTag(tag.id)"
            >
              <Icon
                name="uil:times"
                size="14"
              />
            </button>
          </span>
        </div>
      </div>
    </template>

    <template #actions>
      <div class="popup-actions">
        <GenericButtonElement
          :design_type="2"
          @button_clicked="handleCancel"
        >
          <span>{{ $t('t_cancel') }}</span>
        </GenericButtonElement>

        <GenericButtonElement
          :design_type="1"
          :disabled="selected_tag_list.length === 0"
          :waiting="is_submitting"
          @button_clicked="handleAdd"
        >
          <span>{{ $t('t_add') }}</span>
        </GenericButtonElement>
      </div>
    </template>
  </GenericPopup>
</template>

<style scoped>
.tag-search-container {
  position: relative;
}

.suggestion-list {
  background: var(--color-background-contrasting);
  border: 1px solid var(--color-input-border);
  border-radius: 5px;
  list-style: none;
  margin: 0.25rem 0 0;
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
}

.suggestion-item {
  cursor: pointer;
  padding: 0.5rem 0.75rem;
}

.suggestion-item:hover {
  background-color: var(--color-main);
  color: var(--color-text-on-button);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tag-badge {
  align-items: center;
  background-color: var(--color-main);
  border-radius: 4px;
  color: var(--color-text-on-button);
  display: inline-flex;
  font-size: 0.85rem;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
}

.remove-tag-button {
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.remove-tag-button:focus {
  outline: none;
}

.popup-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
