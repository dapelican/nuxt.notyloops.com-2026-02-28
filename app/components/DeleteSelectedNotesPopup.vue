<script setup>
const {
  clearSelection,
  page_number,
  searchItems,
  selected_item_id_set,
} = useSearchAndSelectItems(ITEM_TYPE_NOTE);

const show_popup = ref(false);
const is_deleting = ref(false);

const handleCancel = () => {
  show_popup.value = false;
};

const deleteNotes = async () => {
  if (selected_item_id_set.value.size === 0) {
    return;
  }

  is_deleting.value = true;
  try {
    await $fetch('/notes/delete', {
      method: 'DELETE',
      body: {
        note_id_list: [...selected_item_id_set.value],
      },
    });

    clearSelection();
    show_popup.value = false;

    if (page_number.value === 1) {
      searchItems();
    } else {
      navigateTo('/manage-notes/page/1');
    }
  } catch (error) {
    handleFrontendError(error, error?.data?.error_message);
  } finally {
    is_deleting.value = false;
  }
};
</script>

<template>
  <!-- DeleteSelectedNotesPopup.vue -->
  <GenericPopup
    v-model="show_popup"
    :title="$t('t_delete')"
    :width="500"
  >
    <template #trigger>
      <slot />
    </template>

    <template #content>
      <p>
        selected_item_id_set.size:{{ selected_item_id_set.size }}
      </p>
      <p class="mt-0 mb-0">
        {{ $t('t_are_you_sure_you_want_to_delete_the_selected_notes') }}
      </p>
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
          :design_type="3"
          :waiting="is_deleting"
          icon="uil:trash-alt"
          @button_clicked="deleteNotes"
        >
          <span>{{ $t('t_delete') }}</span>
        </GenericButtonElement>
      </div>
    </template>
  </GenericPopup>
</template>

<style scoped>
.popup-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
}
</style>
