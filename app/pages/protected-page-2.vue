<script setup>
definePageMeta({ middleware: 'auth' });

useSeoMeta({
  title: `${$t('t_protected_page_2')} | OptiLeague`,
});
</script>

<template>
  <h1 class="center">
    Protected page 2
  </h1>
</template>
