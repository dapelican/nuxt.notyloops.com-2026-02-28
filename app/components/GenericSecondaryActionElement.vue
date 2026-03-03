<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  with_angles: {
    type: Boolean,
    default: false,
  },
});

const open = ref(false);

const emit = defineEmits(['secondary_action_clicked']);

const handleSecondaryActionClick = () => {
  emit('secondary_action_clicked');
  open.value = !open.value;
};
</script>

<template>
  <section
    class="secondary-action"
    @click="handleSecondaryActionClick"
  >
    <Icon
      :name="props.icon"
    />

    <span>{{ props.text }}</span>

    <div
      v-if="with_angles"
      class="angles"
    >
      <Icon
        v-if="open"
        name="uil:angle-up"
        size="18"
      />
      <Icon
        v-else
        name="uil:angle-down"
        size="18"
      />
    </div>
  </section>
</template>

<style scoped>
.angles {
  display: flex;
  align-items: center;
}

.secondary-action {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 0.9rem;
  gap: 5px;
}
</style>
