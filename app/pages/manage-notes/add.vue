<script setup>
definePageMeta({ middleware: 'auth' });

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_add_note')} | OptiLeague`,
});

const handling_request = ref(false);
const note_details = ref([]);
const selected_tag_id_list = ref([]);
const title = ref('');

const {
  all_user_tag_list,
} = useSearchAndSelectItems(ITEM_TYPE_TAG);

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

const addBlock = () => {
  note_details.value.push({
    plain_content: '',
    html_content: '',
    to_be_hidden: false,
    multiple_choice: false,
    is_correct: false,
  });
};

const moveBlock = (index, direction) => {
  const target = index + direction;
  const items = note_details.value;
  [items[index], items[target]] = [items[target], items[index]];
};

const deleteBlock = (index) => {
  note_details.value.splice(index, 1);
};

const computed_details = computed(() => {
  let position = 0;
  let sub_position = 0;
  let prev_was_multiple = false;

  return note_details.value.map((detail) => {
    if (detail.multiple_choice) {
      if (!prev_was_multiple) {
        position += 1;
        sub_position = 1;
      } else {
        sub_position += 1;
      }
      prev_was_multiple = true;
      return { ...detail, position, display_label: `${position}-${sub_position}` };
    }

    position += 1;
    sub_position = 0;
    prev_was_multiple = false;
    return { ...detail, position, display_label: `${position}` };
  });
});

const updateSelectedTagIdList = (new_tag_id_list) => {
  selected_tag_id_list.value = new_tag_id_list;
};

const createNote = async () => {
  handling_request.value = true;

  try {
    await $fetch('/notes/create', {
      method: 'POST',
      body: {
        title: title.value,
        note_details: computed_details.value.map((d) => ({
          position: d.position,
          html_content: d.html_content,
          to_be_hidden: d.to_be_hidden,
          is_correct: d.is_correct,
        })),
        tag_id_list: selected_tag_id_list.value,
      },
    });

    return navigateTo(CONNECTED_USER_LANDING_PAGE);
  } catch (error) {
    const error_message = error?.data?.error_message;
    handleFrontendError(error, error_message);
  } finally {
    handling_request.value = false;
  }
};
</script>

<template>
  <main class="centered-max-width-650">
    <h1 class="center">
      {{ $t('t_add_note') }}
    </h1>

    <form @submit.prevent="createNote">
      <h2>
        {{ $t('t_title') }}
      </h2>

      <input
        id="title"
        v-model="title"
        type="text"
        name="title"
        class="input-type-text"
        required
      >

      <h2>
        {{ $t('t_content') }}
      </h2>

      <div
        v-for="(detail, index) in computed_details"
        :key="index"
      >
        <h3 class="detail-header">
          {{ detail.display_label }}
          <span class="detail-actions">
            <Icon
              v-if="index > 0"
              name="uil:top-arrow-from-top"
              class="action-icon"
              @click="moveBlock(index, -1)"
            />
            <Icon
              v-if="index < note_details.length - 1"
              name="uil:arrow-from-top"
              class="action-icon"
              @click="moveBlock(index, 1)"
            />
          </span>
        </h3>
        <!-- <textarea
          v-model="note_details[index].html_content"
          class="input-type-text"
        /> -->

        <TiptapEditor
          v-model="note_details[index].html_content"
        />

        <div class="checkboxes-with-trash">
          <div>
            <div>
              <label>
                <input
                  v-model="note_details[index].to_be_hidden"
                  type="checkbox"
                  @change="note_details[index].multiple_choice = false"
                >
                À masquer
              </label>
            </div>

            <div>
              <label>
                <input
                  v-model="note_details[index].multiple_choice"
                  type="checkbox"
                  @change="note_details[index].to_be_hidden = false; note_details[index].is_correct = false"
                >
                Choix multiple
              </label>

              <label v-if="detail.multiple_choice">
                <input
                  v-model="note_details[index].is_correct"
                  type="checkbox"
                >
                Proposition correcte
              </label>
            </div>
          </div>

          <Icon
            name="uil:trash-alt"
            class="action-icon delete-icon"
            @click="deleteBlock(index)"
          />
        </div>
      </div>

      <hr
        v-if="note_details.length > 0"
        class="separator-1"
      >

      <div class="flex-ce-ce-gap-2">
        <span
          class="dashed-area"
          @click="addBlock"
        >
          Add block
        </span>
        <span class="dashed-area">
          Generate audio (popup)
        </span>
      </div>

      <h2>
        {{ $t('t_tags') }}
      </h2>

      <SelectTagsInputElements
        :tag_list="all_user_tag_list"
        :selected_tag_id_list="selected_tag_id_list"
        @update:selected_tag_id_list="updateSelectedTagIdList"
      />

      <ul>
        <li>
          Free users are limited to 2 blocks, and they cannot generate audio.
        </li>
      </ul>

      <nav class="flex-ce-ce-gap-2">
        <NuxtLink
          :to="CONNECTED_USER_LANDING_PAGE"
        >
          {{ $t('t_cancel') }}
        </NuxtLink>
        <GenericButtonElement
          :design_type="1"
          button_type="submit"
          :waiting="handling_request"
        >
          {{ $t('t_save') }}
        </GenericButtonElement>
      </nav>
    </form>
  </main>
</template>

<style scoped>
.action-icon {
  cursor: pointer;
  font-size: 1.25rem;
}

.checkboxes-with-trash {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashed-area {
  border: 2px dashed var(--color-uploader-border);
  border-radius: 5px;
  cursor: pointer;
  padding: 1rem 3rem;
  transition: border-color 0.2s, background-color 0.2s;
}

.dashed-area:hover {
  border-color: var(--color-uploader-border-active);
}

.delete-icon {
  color: red;
  margin-left: auto;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
