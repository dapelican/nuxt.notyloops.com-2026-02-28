<script setup>
const props = defineProps({
  item_type: {
    type: String,
    required: true,
  },
});

const {
  current_page_item_list,
  selected_item_id_set,
} = useSearchAndSelectItems(props.item_type);

const emit = defineEmits(['toggle_item_selection']);

const isItemSelected = (item_id) => selected_item_id_set.value.has(item_id);
</script>

<template>
  <!-- ItemListForMobileElement.vue -->
  <section v-if="current_page_item_list.length === 0">
    {{ $t('t_no_result_matching_your_search') }}
  </section>

  <section
    v-else
    class="item-card-list"
  >
    <div
      v-for="item in current_page_item_list"
      :key="item.id"
      class="item-card"
      :class="{ 'card-selected': isItemSelected(item.id) }"
    >
      <section class="item-card-header">
        <input
          type="checkbox"
          :checked="isItemSelected(item.id)"
          @change="emit('toggle_item_selection', item.id)"
        >
        <span class="item-card-title">{{ item.label }}</span>
      </section>

      <section
        v-if="item.tag_list && item.tag_list.length > 0"
        class="item-card-tags"
      >
        <span
          v-for="tag in item.tag_list"
          :key="tag.id"
          class="tag-badge"
        >
          {{ tag.label }}
        </span>
      </section>

      <section class="item-card-actions">
        Edit
      </section>
    </div>
  </section>
</template>

<style scoped>
.item-card-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.item-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 8px;
  padding: 0.75rem;
  transition: border-color 0.15s;
}

.item-card-actions {
  margin-top: 0.5rem;
}

.card-selected {
  background: var(--color-alert-info-bg);
  border-color: var(--color-alert-info-border);
}

.item-card-header {
  align-items: center;
  display: flex;
  gap: 0.6rem;
}

.item-card-header input {
  cursor: pointer;
  flex-shrink: 0;
  height: 16px;
  width: 16px;
}

.item-card-title {
  font-size: 1rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.4rem;
  padding-left: 1.6rem;
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
