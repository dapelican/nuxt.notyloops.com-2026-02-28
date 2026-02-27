<script setup>
definePageMeta({ middleware: 'auth' });

useSeoMeta({
  title: `${$t('t_protected_page_1')} | OptiLeague`,
});
</script>

<template>
  <h1 class="center">
    Protected page 1
  </h1>
</template>
