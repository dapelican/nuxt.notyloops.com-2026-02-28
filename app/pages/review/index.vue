<script setup>
definePageMeta({ middleware: 'auth' });

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_review_notes')} | OptiLeague`,
});
</script>

<template>
  <h1 class="center">
    {{ $t('t_review_notes') }}
  </h1>
</template>
