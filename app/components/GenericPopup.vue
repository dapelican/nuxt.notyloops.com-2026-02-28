<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 600,
  },
  scrollable: {
    type: Boolean,
    default: false,
  },
  // Standard vue prop name for v-model
  // eslint-disable-next-line vue/prop-name-casing
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['open', 'close', 'update:modelValue']);

// Template refs
const popup_ref = ref(null);

// Watch for changes to modelValue
watch(() => props.modelValue, (new_value) => {
  if (new_value && popup_ref.value) {
    popup_ref.value.showModal();
  } else if (!new_value && popup_ref.value) {
    popup_ref.value.close();
  }
}, { immediate: true });

// Computed properties
const compute_width = computed(() => {
  return `${props.width}px`;
});

// Methods
const openPopup = () => {
  emit('update:modelValue', true);
  emit('open');
};

const closePopup = () => {
  emit('update:modelValue', false);
  emit('close');
};

// Handler for close actions
const handleClose = () => {
  closePopup();
};

// Handle clicks on the backdrop (native dialog behavior)
onMounted(() => {
  if (popup_ref.value) {
    popup_ref.value.addEventListener('cancel', (event) => {
      event.preventDefault(); // Prevent default close
      closePopup(); // Use our close method instead
    });

    // Handle clicks on backdrop (which normally closes dialog)
    popup_ref.value.addEventListener('click', (event) => {
      if (event.target === popup_ref.value) {
        closePopup();
      }
    });
  }
});

defineExpose({
  openPopup,
  closePopup,
});
</script>

<template>
  <div class="generic-popup-container">
    <!-- Trigger slot that will open the popup -->
    <div
      class="trigger-container"
      @click="openPopup"
    >
      <slot name="trigger" />
    </div>

    <!-- Dialog element for the popup -->
    <dialog
      ref="popup_ref"
      :style="{ width: compute_width }"
    >
      <div class="popup-header">
        <h3
          v-if="title"
          class="mt-0 mb-0"
        >
          {{ title }}
        </h3>
        <button
          class="close-button"
          @click="handleClose"
        >
          <Icon
            name="uil:times"
            size="20"
          />
        </button>
      </div>

      <div
        class="popup-content"
        :class="{ scrollable: scrollable }"
      >
        <slot name="content" />
      </div>

      <div class="popup-footer">
        <slot name="actions" />
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.generic-popup-container {
  display: inline-block;
}

dialog {
  background-color: var(--color-generic-popup-bg);
  border-radius: 8px;
  border: 1px solid var(--color-generic-popup-border);
  box-shadow: 0 4px 6px var(--color-generic-popup-box-shadow);
  color: var(--color-text);
  margin: auto;
  max-width: 90vw;
  padding: 0;
}

dialog::backdrop {
  background-color: var(--color-generic-popup-backdrop);
}

.popup-header {
  align-items: center;
  border-bottom: 1px solid var(--color-generic-popup-border);
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
}

.popup-header h3 {
  color: var(--color-generic-popup-title);
}

.popup-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  align-items: center;
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--color-generic-popup-close-button);
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 4px;
}

.close-button:focus {
  border: none;
  box-shadow: none;
  outline: none;
}

.close-button:hover {
  background-color: var(--color-generic-popup-close-button-bg);
  color: var(--color-generic-popup-close-button-hover);
}

.popup-content {
  padding: 20px;
  min-height: 50px;
}

.popup-content.scrollable {
  max-height: 400px;
  overflow-y: auto;
}

.popup-footer {
  padding: 30px;
}
</style>
