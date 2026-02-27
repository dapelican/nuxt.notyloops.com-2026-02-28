<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const status_code = computed(() => props.error?.statusCode ?? props.error?.status ?? 500);

useSeoMeta({
  title: `${$t('t_error')} ${status_code.value} | OptiLeague`,
});
</script>

<template>
  <section class="center">
    <p class="centered-max-width-650 alert-danger">
      <template v-if="status_code === 404">
        {{ $t('t_page_not_found') }}
      </template>
      <template v-else>
        {{ $t('t_unusual_error_has_occured') }}
        <NuxtLink to="mailto:support@optileague.com">support@optileague.com</NuxtLink>.
      </template>
    </p>

    <hr class="separator-1">

    <NuxtLink
      to="/"
      class="button-1"
    >{{ $t('t_go_back_home') }}</NuxtLink>
  </section>
</template>
