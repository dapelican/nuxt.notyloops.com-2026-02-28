<script setup>
const props = defineProps({
  selected_note_id_set: {
    type: Set,
    required: true,
  },
});

const {
  all_user_tag_list,
  clearSelection,
  searchItems,
} = useSearchAndSelectItems(ITEM_TYPE_NOTE);

const selected_tag_id_list = ref([]);

const show_popup = ref(false);

const updateSelectedTagIdList = (new_tag_id_list) => {
  selected_tag_id_list.value = new_tag_id_list;
};

const adding_tags = ref(false);

const addTagsToNotes = async () => {
  try {
    adding_tags.value = true;
    await $fetch('/note-tags/link', {
      method: 'POST',
      body: {
        note_id_list: [...props.selected_note_id_set],
        tag_id_list: selected_tag_id_list.value,
      },
    });

    clearSelection();
    show_popup.value = false;
    searchItems();
  } catch (error) {
    console.error(error);
    handleFrontendError(error, error?.data?.error_message);
  } finally {
    adding_tags.value = false;
  }
};

const handleCancel = () => {
  selected_tag_id_list.value = [];
  show_popup.value = false;
};
</script>

<template>
  <!-- AddTagsToNotesPopup.vue -->
  <GenericPopup
    v-model="show_popup"
    :title="$t('t_add_tags')"
    :width="500"
  >
    <template #trigger>
      <GenericSecondaryButtonElement
        :design_type="2"
        icon="uil:plus-circle"
      >
        <span class="desktop-only">{{ $t('t_add_tags') }}</span>
      </GenericSecondaryButtonElement>
    </template>

    <template #content>
      <SelectTagsInputElements
        :tag_list="all_user_tag_list"
        :selected_tag_id_list="selected_tag_id_list"
        @update:selected_tag_id_list="updateSelectedTagIdList"
      />
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
          :waiting="adding_tags"
          @button_clicked="addTagsToNotes"
        >
          <span>{{ $t('t_add') }}</span>
        </GenericButtonElement>
      </div>
    </template>
  </GenericPopup>
</template>

<style scoped>
.popup-actions {
  display: flex;
  justify-content: space-between;
}
</style>
