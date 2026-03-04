<script setup>
const props = defineProps({
  file_type: {
    type: String,
    required: true,
    validator: (value) => ['image', 'audio'].includes(value),
  },
});

const { t } = useI18n();

const MAX_RETRIES = 3;

const file_name = ref(null);
const file_url = ref(null);
const is_dragging = ref(false);
const is_uploading = ref(false);
const retry_count = ref(0);
const show_popup = ref(false);
const upload_error = ref(null);

const accept_types = computed(() => {
  return props.file_type === 'image' ? 'image/*' : 'audio/*';
});

const add_file = computed(() => {
  return props.file_type === 'image' ? t('t_add_image') : t('t_add_audio');
});

const choose_file = computed(() => {
  return props.file_type === 'image'
    ? t('t_drop_your_image_here_or_browse')
    : t('t_drop_your_audio_file_here_or_browse');
});

const max_retries_reached = computed(() => retry_count.value >= MAX_RETRIES);

const emit = defineEmits(['file_url']);

const emitFileInfo = () => {
  emit('file_url', {
    file_url: file_url.value,
    file_type: props.file_type,
  });

  closePopupAndResetVariables();
};

const closePopupAndResetVariables = () => {
  show_popup.value = false;
  file_url.value = null;
  file_name.value = null;
  upload_error.value = null;
  retry_count.value = 0;
};

const uploadFile = async (file) => {
  if (!file.type.startsWith(`${props.file_type}/`)) {
    upload_error.value = t('t_upload_invalid_type');
    return;
  }

  is_uploading.value = true;
  upload_error.value = null;

  const form_data = new FormData();
  form_data.append('file', file);

  try {
    const data = await $fetch('/files/upload', {
      method: 'POST',
      body: form_data,
    });

    file_url.value = data.file_url;
    file_name.value = file.name;
  } catch {
    retry_count.value += 1;
    upload_error.value = retry_count.value >= MAX_RETRIES
      ? t('t_upload_max_retries')
      : t('t_upload_error');
  } finally {
    is_uploading.value = false;
  }
};

const handleDrop = (event) => {
  is_dragging.value = false;

  if (max_retries_reached.value) {
    return;
  }

  const file = event.dataTransfer?.files?.[0];

  if (!file) {
    return;
  }

  retry_count.value = 0;
  uploadFile(file);
};

const handleFileInputChange = (event) => {
  const file = event.target?.files?.[0];

  if (!file) {
    return;
  }

  retry_count.value = 0;
  event.target.value = '';
  uploadFile(file);
};
</script>

<template>
  <!-- FileUploaderPopup.vue -->
  <GenericPopup
    v-model="show_popup"
    :title="add_file"
    :width="500"
  >
    <template #trigger>
      <DashedAreaElement>
        {{ add_file }}
      </DashedAreaElement>
    </template>

    <template #content>
      <p
        v-if="upload_error"
        class="upload-error"
      >
        {{ upload_error }}
      </p>

      <LoadingSpinnerElement
        v-if="is_uploading"
        :with_top_margin="false"
      />

      <template v-else-if="!file_url">
        <label
          v-if="!max_retries_reached"
          :class="[
            'uploader-drop-area', {
              'uploader-drop-area-is-dragging': is_dragging,
            }]"
          @dragenter.prevent="is_dragging = true"
          @dragleave.prevent="is_dragging = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input
            type="file"
            :accept="accept_types"
            class="file-input-hidden"
            @change="handleFileInputChange"
          >

          <Icon
            name="uil:upload"
            size="24"
          />

          <span class="upload-file-text">{{ choose_file }}</span>
          <span class="upload-file-text">{{ $t('maximum_size') }}</span>
        </label>

        <div
          v-else
          class="uploader-drop-area uploader-drop-area-disabled"
        />
      </template>

      <ImageDisplayerElement
        v-else
        :image_url="file_url"
      />
    </template>

    <template #actions>
      <div class="popup-actions">
        <GenericButtonElement
          :design_type="2"
          @button_clicked="closePopupAndResetVariables"
        >
          <span>{{ $t('t_cancel') }}</span>
        </GenericButtonElement>

        <GenericButtonElement
          :design_type="1"
          :disabled="!file_url"
          @button_clicked="emitFileInfo"
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

.file-input-hidden {
  display: none;
}

.uploader-drop-area {
  align-items: center;
  border: 2px dashed var(--color-uploader-border);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  height: 128px;
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s, background-color 0.2s;
  width: 100%;
}

.uploader-drop-area:hover {
  border-color: var(--color-uploader-border-active);
}

.uploader-drop-area-is-dragging {
  border-color: var(--color-uploader-border-active);
  background-color: var(--color-uploader-bg-active);
}

.uploader-drop-area-disabled {
  cursor: not-allowed;
}

.upload-error {
  color: var(--color-error);
  margin-bottom: 0.5rem;
}

.upload-file-text {
  font-size: 0.8rem;
}
</style>
