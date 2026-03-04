<script setup>
definePageMeta({ middleware: 'auth' });

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_manage_tags')} | OptiLeague`,
});

const total_user_tag_count = ref(0);

const {
  data: count_data,
  error: count_error,
} = await useFetch('/tags/count-user-tags');

if (count_error.value) {
  handleFrontendError(null, count_error.value.data?.error_message);
}

if (count_data.value) {
  total_user_tag_count.value = count_data.value.total_user_tag_count;
}

const {
  handling_request,
  page_number,
  reinitializeSearch,
  sort_option,
  search_criteria_term,
  searchItems,
} = useSearchAndSelectItems(ITEM_TYPE_TAG);

// Action bar actions
const show_order_options = ref(false);

const show_search_input = ref(false);

const show_master_checkbox = ref(false);

const action_bar_refs = {
  show_order_options,
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
    id: 'label:asc',
    label: t('t_label_a_to_z'),
    value: 'label:asc',
  },
  {
    id: 'label:desc',
    label: t('t_label_z_to_a'),
    value: 'label:desc',
  },
  {
    id: 'attached_note_count:desc',
    label: t('t_most_attached_notes_first'),
    value: 'attached_note_count:desc',
  },
  {
    id: 'attached_note_count:asc',
    label: t('t_fewest_attached_notes_first'),
    value: 'attached_note_count:asc',
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
    navigateTo('/manage-tags/page/1');
  } else {
    searchItems();
  }
};

let search_timeout = null;

const onSearchInput = () => {
  clearTimeout(search_timeout);
  search_timeout = setTimeout(() => {
    if (page_number.value !== 1) {
      navigateTo('/manage-tags/page/1');
    } else {
      searchItems();
    }
  }, 400);
};

const onClearingInput = () => {
  search_criteria_term.value = '';
  searchItems();
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
      <h1>{{ $t('t_manage_tags') }}</h1>

      <GenericButtonElement
        :design_type="1"
        icon="uil:plus"
        @button_clicked="navigateTo('/manage-tags/add')"
      >
        <span>{{ $t('t_add_tag') }}</span>
      </GenericButtonElement>
    </header>

    <hr class="separator-2">

    <template v-if="total_user_tag_count > 0">
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

          <!-- <GenericSecondaryActionElement
            icon="uil:arrows-v-alt"
            text="$t('t_reorder')"
            with_angles
            @secondary_action_clicked="handleActionBarClick('show_order_options')"
          /> -->

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

          <GenericSearchInputElement
            v-if="show_search_input"
            v-model="search_criteria_term"
            :placeholder="$t('t_search_tags')"
            @search="onSearchInput"
            @clear="onClearingInput"
          />
        </div>

        <SelectableItemsElement
          :item_type="ITEM_TYPE_TAG"
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
