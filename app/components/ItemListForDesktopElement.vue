<script setup>
const props = defineProps({
  item_type: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const {
  current_page_item_list,
  selected_item_id_set,
} = useSearchAndSelectItems(props.item_type);

let column_list = [];

if (props.item_type === ITEM_TYPE_TAG) {
  column_list = [
    { column_name: t('t_label'), column_key: 'label', column_type: 'neutral' },
    { column_name: t('t_attached_note_count'), column_key: 'attached_note_count', column_type: 'neutral' },
    { column_name: t('t_created'), column_key: 'created_at', column_type: 'date' },
    { column_name: t('t_updated'), column_key: 'updated_at', column_type: 'date' },
  ];
}

if (props.item_type === ITEM_TYPE_NOTE) {
  column_list = [
    { column_name: t('t_title'), column_key: 'title', column_type: 'neutral' },
    { column_name: t('t_tags'), column_key: 'tag_list', column_type: 'tag' },
    { column_name: t('t_created'), column_key: 'created_at', column_type: 'date' },
    { column_name: t('t_updated'), column_key: 'updated_at', column_type: 'date' },
  ];
}

const route = useRoute();

const page_number = computed(() => route.params.page_number);

const emit = defineEmits(['toggle_item_selection']);

const isItemSelected = (item_id) => selected_item_id_set.value.has(item_id);
</script>

<template>
  <!-- ItemListForDesktopElement.vue -->
  <section v-if="current_page_item_list.length === 0">
    {{ $t('t_no_result_matching_your_search') }}
  </section>

  <table
    v-else
    class="items-table"
  >
    <thead>
      <tr>
        <th class="col-checkbox" />
        <th
          v-for="col in column_list"
          :key="col.column_key"
          :class="'col-' + col.column_type"
        >
          {{ col.column_name }}
        </th>
        <th>
          {{ $t('t_actions') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in current_page_item_list"
        :key="item.id"
        :class="{
          'row-selected': isItemSelected(item.id),
        }"
      >
        <td class="col-checkbox">
          <input
            type="checkbox"
            :checked="isItemSelected(item.id)"
            @change="emit('toggle_item_selection', item.id)"
          >
        </td>
        <td
          v-for="col in column_list"
          :key="col.column_key"
          :class="'col-' + col.column_type"
        >
          <template v-if="col.column_type === 'tag'">
            <span
              v-for="tag in item[col.column_key]"
              :key="tag.id"
              class="tag-badge"
            >
              {{ tag.label }}
            </span>
          </template>
          <template v-else-if="col.column_type === 'date'">
            {{ formatDate(item[col.column_key]) }}
          </template>
          <template v-else>
            {{ item[col.column_key] }}
          </template>
        </td>
        <td>
          <NuxtLink
            :to="`/manage-${item_type}s/edit/${item.id}?page_number=${page_number}`"
          >
            {{ $t('t_edit') }}
          </NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.items-table {
  border-collapse: collapse;
  margin-top: 1rem;
  width: 100%;
}

.items-table th {
  border-bottom: 2px solid var(--color-card-border);
  color: var(--color-disabled);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 0.6rem 0.75rem;
  text-align: left;
}

.items-table td {
  border-bottom: 1px solid var(--color-card-border);
  font-size: 0.95rem;
  padding: 0.7rem 0.75rem;
  vertical-align: middle;
}

.items-table tbody tr {
  transition: background 0.1s;
}

.items-table tbody tr:hover {
  background: var(--color-pagination-hover);
}

.row-selected {
  background: var(--color-alert-info-bg);
}

.row-selected:hover {
  background: var(--color-alert-info-bg);
}

.col-checkbox {
  width: 40px;
}

.col-checkbox input {
  cursor: pointer;
  height: 16px;
  width: 16px;
}

.col-neutral {
  font-weight: 500;
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-tag {
  max-width: 200px;
}

.col-date {
  color: var(--color-disabled);
  font-size: 0.85rem;
  white-space: nowrap;
}

.tag-badge {
  background: var(--color-pagination-hover);
  border-radius: 10px;
  display: inline-block;
  font-size: 0.75rem;
  padding: 2px 8px;
  white-space: nowrap;
}
</style>
