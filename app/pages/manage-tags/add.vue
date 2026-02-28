<script setup>
definePageMeta({ middleware: 'auth' });

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_add_note')} | OptiLeague`,
});

const label = ref('');
const handling_request = ref(false);
const error_tag_already_exists = ref(false);

const createTag = async () => {
  handling_request.value = true;

  try {
    await $fetch('/tags/create', {
      method: 'POST',
      body: {
        label: label.value,
      },
    });

    return navigateTo('/manage-tags/page/1');
  } catch (error) {
    const error_message = error?.data?.error_message;

    if (error_message === 'error_tag_already_exists') {
      error_tag_already_exists.value = true;
      return;
    }

    handleFrontendError(error, error_message);
  } finally {
    handling_request.value = false;
  }
};
</script>

<template>
  <main class="centered-max-width-650">
    <h1 class="center">
      {{ $t('t_add_tag') }}
    </h1>

    <form @submit.prevent="createTag">
      <h2>
        {{ $t('t_name') }}
      </h2>

      <input
        id="title"
        v-model="label"
        type="text"
        name="title"
        class="input-type-text"
        required
      >

      <p
        v-if="error_tag_already_exists"
        class="alert-danger"
      >
        {{ $t('t_tag_already_exists') }}
      </p>

      <hr class="separator-1">

      <nav class="flex-ce-ce-gap-2">
        <NuxtLink
          :to="'/manage-tags/page/1'"
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
