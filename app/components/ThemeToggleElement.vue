<script setup>
defineProps({
  show_label: {
    type: Boolean,
    default: false,
  },
});

// color_mode is only accesible on the client side
// So until the client side renders (onMounted), we must define a value to avoid hydration mismatch.
const color_mode = useColorMode();

const is_hydrated = ref(false);

onMounted(() => {
  is_hydrated.value = true;
});

const resolved_mode = computed(() => {
  if (!is_hydrated.value) {
    return 'light';
  }
  return color_mode.value;
});

const icon = computed(() => {
  return resolved_mode.value === 'light' ? 'uil:moon' : 'uil:sun';
});

const theme_label = computed(() => {
  return resolved_mode.value === 'light' ? 't_theme_light' : 't_theme_dark';
});

const toggleTheme = () => {
  color_mode.preference = color_mode.value === 'light' ? 'dark' : 'light';
};

defineExpose({ toggleTheme });
</script>

<template>
  <section
    class="theme-toggle"
    @click="toggleTheme"
  >
    <Icon
      :aria-label="`${$t(theme_label)} ${$t('t_click_here_to_change')}`"
      class="theme-toggle-icon"
      :name="icon"
      :title="`${$t(theme_label)} ${$t('t_click_here_to_change')}`"
    />
    <span v-if="show_label">{{ $t(theme_label) }}</span>
  </section>
</template>

<style scoped>
.theme-toggle {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 0.75rem;
}

.theme-toggle:hover {
  opacity: 0.7;
}

.theme-toggle-icon {
  color: white;
  font-size: 1.3rem;
  transition: opacity 0.2s ease;
}
</style>
