<script setup>
definePageMeta({ middleware: 'auth' });

navigateTo(CONNECTED_USER_LANDING_PAGE, { replace: true });
</script>

<template>
  <LoadingSpinnerElement />
</template>
