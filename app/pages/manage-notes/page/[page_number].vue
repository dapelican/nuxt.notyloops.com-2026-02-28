<script setup>
definePageMeta({ middleware: 'auth' });

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_manage_notes')} | OptiLeague`,
});

const total_user_note_count = ref(0);

// get total_user_note_count
const {
  data: count_data,
  error: count_error,
} = await useFetch('/notes/count-user-notes');

if (count_error.value) {
  handleFrontendError(null, count_error.value.data?.error_message);
}

if (count_data.value) {
  total_user_note_count.value = count_data.value.total_user_note_count;
}

const {
  all_user_tag_list,
  handling_request,
  page_number,
  reinitializeSearch,
  search_criteria_tag_id_set,
  sort_option,
  search_criteria_term,
  searchItems,
} = useSearchAndSelectItems(ITEM_TYPE_NOTE);

const {
  data: tag_data,
  error: tag_error,
} = await useFetch('/tags/get-user-tags');

if (tag_error.value) {
  handleFrontendError(null, tag_error.value.data?.error_message);
}

if (tag_data.value) {
  all_user_tag_list.value = tag_data.value.all_user_tag_list;
}

const search_criteria_tag_id_list = computed(() => Array.from(search_criteria_tag_id_set.value));

const onTagFilterChange = (new_selected_tag_id_list) => {
  search_criteria_tag_id_set.value = new Set(new_selected_tag_id_list);
  if (page_number.value !== 1) {
    navigateTo('/manage-notes/page/1');
  } else {
    searchItems();
  }
};

// action bar actions
const show_order_options = ref(false);

const show_filter_tags_input = ref(false);

const show_search_input = ref(false);

const show_master_checkbox = ref(false);

const action_bar_refs = {
  show_order_options,
  show_filter_tags_input,
  show_search_input,
  show_master_checkbox,
};

const handleActionBarClick = (target_key) => {
  const target = action_bar_refs[target_key];
  const new_value = !target.value;
  Object.values(action_bar_refs).forEach((r) => (r.value = false));
  target.value = new_value;
};

const sort_option_list = [
  {
    id: 'title:asc',
    label: t('t_title_a_to_z'),
    value: 'title:asc',
  },
  {
    id: 'title:desc',
    label: t('t_title_z_to_a'),
    value: 'title:desc',
  },
  {
    id: 'created_at:desc',
    label: t('t_newest_created_at_first'),
    value: 'created_at:desc',
  },
  {
    id: 'created_at:asc',
    label: t('t_oldest_created_at_first'),
    value: 'created_at:asc',
  },
  {
    id: 'updated_at:desc',
    label: t('t_newest_updated_at_first'),
    value: 'updated_at:desc',
  },
  {
    id: 'updated_at:asc',
    label: t('t_oldest_updated_at_first'),
    value: 'updated_at:asc',
  },
];

const onSortChange = () => {
  if (page_number.value !== 1) {
    navigateTo('/manage-notes/page/1');
  } else {
    searchItems();
  }
};

let search_timeout = null;

const onSearchInput = () => {
  clearTimeout(search_timeout);
  search_timeout = setTimeout(() => {
    if (page_number.value !== 1) {
      navigateTo('/manage-notes/page/1');
    } else {
      searchItems();
    }
  }, 400);
};

onMounted(() => {
  searchItems();
});

watch(page_number, searchItems);

onUnmounted(() => {
  clearTimeout(search_timeout);
});
</script>

<template>
  <section class="centered-max-width-1200">
    <header class="center">
      <h1>{{ $t('t_manage_notes') }}</h1>

      <GenericButtonElement
        :design_type="1"
        icon="uil:plus"
        @button_clicked="navigateTo('/manage-notes/add')"
      >
        <span>{{ $t('t_add_note') }}</span>
      </GenericButtonElement>
    </header>

    <hr class="separator-2">

    <template v-if="total_user_note_count > 0">
      <LoadingSpinnerElement v-if="handling_request" />

      <template v-if="!handling_request">
        <div class="action-bar">
          <GenericSecondaryButtonElement
            :design_type="show_order_options ? 1 : 2"
            icon="uil:arrows-v-alt"
            @button_clicked="handleActionBarClick('show_order_options')"
          >
            <span class="desktop-only">{{ $t('t_reorder') }}</span>
          </GenericSecondaryButtonElement>

          <GenericSecondaryButtonElement
            :design_type="show_filter_tags_input ? 1 : 2"
            icon="uil:tag-alt"
            @button_clicked="handleActionBarClick('show_filter_tags_input')"
          >
            <span class="desktop-only">{{ $t('t_filter_by_tags') }}</span>
          </GenericSecondaryButtonElement>

          <GenericSecondaryButtonElement
            :design_type="show_search_input ? 1 : 2"
            icon="uil:search"
            @button_clicked="handleActionBarClick('show_search_input')"
          >
            <span class="desktop-only">{{ $t('t_search') }}</span>
          </GenericSecondaryButtonElement>

          <GenericSecondaryButtonElement
            :design_type="show_master_checkbox ? 1 : 2"
            icon="uil:check-square"
            @button_clicked="handleActionBarClick('show_master_checkbox')"
          >
            <span class="desktop-only">{{ $t('t_select_all') }}</span>
          </GenericSecondaryButtonElement>

          <div
            class="reset-filters"
            @click="reinitializeSearch"
          >
            <Icon
              name="uil:sync"
              class="reset-filters-icon"
            />
            <span class="pseudo-link">{{ $t('t_reset_filters') }}</span>
          </div>
        </div>

        <div class="action-bar-details">
          <fieldset
            v-if="show_order_options"
            class="sort-radio-buttons"
          >
            <label
              v-for="option in sort_option_list"
              :key="option.id"
            >
              <input
                v-model="sort_option"
                type="radio"
                name="sort_option"
                :value="option.value"
                @change="onSortChange"
              >
              <span>{{ option.label }}</span>
            </label>
          </fieldset>

          <SelectTagsInputElements
            v-if="show_filter_tags_input"
            :tag_list="all_user_tag_list"
            :selected_tag_id_list="search_criteria_tag_id_list"
            @update:selected_tag_id_list="onTagFilterChange"
          />

          <GenericSearchInputTestElement
            v-if="show_search_input"
            v-model="search_criteria_term"
            :placeholder="$t('t_search_notes')"
            @search="onSearchInput"
          />
        </div>

        <hr class="separator-2">

        <SelectableItemsElement
          :item_type="ITEM_TYPE_NOTE"
          :show_master_checkbox
        />
      </template>
    </template>
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

.reset-filters {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}

.reset-filters-icon {
  color: var(--color-main);
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
