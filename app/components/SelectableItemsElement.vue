<script setup>
const props = defineProps({
  item_type: {
    type: String,
    required: true,
  },
  show_master_checkbox: {
    type: Boolean,
    required: true,
  },
});

const {
  current_page_item_list,
  handling_request,
  items_per_page,
  page_number,
  searched_item_id_set,
  selected_item_id_set,
  search_criteria_term,
} = useSearchAndSelectItems(props.item_type);

const searched_item_count = computed(() => {
  return searched_item_id_set.value.size;
});

const total_pages = computed(() => {
  return Math.max(1, Math.ceil(searched_item_id_set.value.size / items_per_page.value));
});

const all_pages_selected = computed(() => {
  return selected_item_id_set.value.size === searched_item_id_set.value.size;
});

const current_page_item_id_list = computed(() => {
  return current_page_item_list.value.map((item) => item.id);
});

const current_page_all_selected = computed(() => {
  if (current_page_item_list.value.length === 0) {
    return false;
  }

  return current_page_item_id_list.value.every((id) => {
    return selected_item_id_set.value.has(id);
  });
});

const current_page_some_selected = computed(() => {
  return current_page_item_id_list.value.some((id) => {
    return selected_item_id_set.value.has(id);
  });
});

const selected_count = computed(() => selected_item_id_set.value.size);

const has_selection = computed(() => selected_item_id_set.value.size > 0);

const master_checkbox_ref = ref(null);

const master_checked = computed(() => {
  return all_pages_selected.value || current_page_all_selected.value || has_selection.value;
});

const master_indeterminate = computed(() => {
  if (all_pages_selected.value || current_page_all_selected.value) {
    return false;
  }
  return current_page_some_selected.value;
});

watchEffect(() => {
  if (master_checkbox_ref.value) {
    master_checkbox_ref.value.checked = master_checked.value;
    master_checkbox_ref.value.indeterminate = master_indeterminate.value;
  }
});

const toggleMasterCheckbox = () => {
  if (all_pages_selected.value) {
    selected_item_id_set.value = new Set();
  } else if (current_page_all_selected.value) {
    selected_item_id_set.value = new Set(searched_item_id_set.value);
  } else {
    const new_set = new Set(selected_item_id_set.value);
    current_page_item_id_list.value.forEach((id) => new_set.add(id));
    selected_item_id_set.value = new_set;
  }

  nextTick(() => {
    if (master_checkbox_ref.value) {
      master_checkbox_ref.value.checked = master_checked.value;
      master_checkbox_ref.value.indeterminate = master_indeterminate.value;
    }
  });
};

const handleCheckboxClick = (item_id) => {
  if (all_pages_selected.value) {
    const new_set = new Set(searched_item_id_set.value);
    new_set.delete(item_id);
    selected_item_id_set.value = new_set;
    return;
  }

  const new_set = new Set(selected_item_id_set.value);
  if (new_set.has(item_id)) {
    new_set.delete(item_id);
  } else {
    new_set.add(item_id);
  }
  selected_item_id_set.value = new_set;
};

const clearSelection = () => {
  selected_item_id_set.value = new Set();
};

const selectCurrentPage = () => {
  const new_set = new Set(selected_item_id_set.value);
  current_page_item_id_list.value.forEach((id) => new_set.add(id));
  selected_item_id_set.value = new_set;
};

const selectAllPages = () => {
  selected_item_id_set.value = new Set(searched_item_id_set.value);
};
</script>

<template>
  <!-- SelectableItemsElement.vue -->
  <section>
    <div
      v-if="!handling_request && searched_item_count === 0 && search_criteria_term"
      class="empty-state"
    >
      <Icon
        name="uil:search-minus"
        class="empty-icon"
      />
      <p>{{ $t('t_no_tags_match_your_search') }}</p>
    </div>

    <div
      v-if="!handling_request && searched_item_count > 0
        && (show_master_checkbox || has_selection)"
      class="selection-banner"
    >
      <section class="master-checkbox">
        <label class="master-checkbox-label">
          <input
            ref="master_checkbox_ref"
            type="checkbox"
            :checked="master_checked"
            @change="toggleMasterCheckbox"
          >
        </label>

        <span
          v-if="has_selection"
          class="selection-count"
        >
          {{ selected_count }} / {{ searched_item_count }}
        </span>
      </section>

      <section class="desktop-only">
        <a
          v-if="all_pages_selected || (total_pages === 1 && current_page_all_selected)"
          class="banner-link"
          @click="clearSelection"
        >
          {{ $t('t_clear_selection') }}
        </a>

        <a
          v-else-if="current_page_all_selected && total_pages > 1"
          class="banner-link"
          @click="selectAllPages"
        >
          {{ $t('t_select_all_pages') }}
        </a>

        <a
          v-else
          class="banner-link"
          @click="selectCurrentPage"
        >
          {{ $t('t_select_page') }}
        </a>
      </section>

      <section
        v-if="item_type === ITEM_TYPE_TAG"
        class="actions-on-selected-actions"
      >
        <DeleteSelectedTagsPopup>
          <GenericSecondaryButtonElement
            :design_type="3"
            icon="uil:trash-alt"
          >
            <span class="desktop-only">{{ $t('t_delete') }}</span>
          </GenericSecondaryButtonElement>
        </DeleteSelectedTagsPopup>
      </section>

      <section
        v-if="item_type === ITEM_TYPE_NOTE"
        class="actions-on-selected-actions"
      >
        <AddTagsToNotesPopup :selected_note_id_set="selected_item_id_set" />

        <RemoveTagsFromNotesPopup :selected_note_id_set="selected_item_id_set" />

        <DeleteSelectedNotesPopup>
          <GenericSecondaryButtonElement
            :design_type="3"
            icon="uil:trash-alt"
          >
            <span class="desktop-only">{{ $t('t_delete') }}</span>
          </GenericSecondaryButtonElement>
        </DeleteSelectedNotesPopup>
      </section>
    </div>

    <ItemListForDesktopElement
      class="desktop-only"
      :item_list="current_page_item_list"
      :item_type
      @toggle_item_selection="handleCheckboxClick"
    />

    <ItemListForMobileElement
      class="mobile-only"
      :item_list="current_page_item_list"
      :item_type
      @toggle_item_selection="handleCheckboxClick"
    />

    <PaginationElement
      :current_page="page_number"
      :total_pages="total_pages"
      :base_path="`/manage-${item_type}s/page/`"
    />
  </section>
</template>

<style scoped>
.action-bar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.actions-on-selected-actions {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}

.banner-link {
  color: var(--color-main);
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state {
  align-items: center;
  color: var(--color-disabled);
  display: flex;
  flex-direction: column;
  padding: 3rem 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.master-checkbox {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}

.master-checkbox-label {
  align-items: center;
  cursor: pointer;
  display: flex;
}

.master-checkbox-label input {
  cursor: pointer;
  height: 16px;
  width: 16px;
}

.selection-banner {
  align-items: center;
  background: var(--color-alert-info-bg);
  border: 1px solid var(--color-alert-info-border);
  border-radius: 6px;
  color: var(--color-alert-info-text);
  display: flex;
  font-size: 0.9rem;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
}

.selection-count {
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 500;
}

.sort-radio-buttons {
  background: var(--color-background-contrasting);
  border: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
