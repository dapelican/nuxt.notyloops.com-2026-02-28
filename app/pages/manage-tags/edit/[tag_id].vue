<script setup>
definePageMeta({ middleware: 'auth' });

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_edit_tag')} | OptiLeague`,
});

const route = useRoute();

const error_tag_already_exists = ref(false);
const handling_request = ref(true);
const label = ref('');
const page_number = route.query.page_number;
const tag_id = route.params.tag_id;

const {
  data: tag_data,
  error: tag_error,
} = await useFetch(`/tags/${tag_id}`);

if (tag_error.value) {
  handleFrontendError(null, tag_error.value.data?.error_message);
}

if (tag_data.value) {
  label.value = tag_data.value.label;
}

handling_request.value = false;

const updateTag = async () => {
  handling_request.value = true;

  try {
    await $fetch('/tags/update', {
      method: 'PATCH',
      body: {
        id: tag_id,
        label: label.value,
      },
    });

    return navigateTo(`/manage-tags/page/${page_number}`);
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

const resetErrors = () => {
  error_tag_already_exists.value = false;
};
</script>

<template>
  <LoadingSpinnerElement v-if="handling_request" />

  <main
    v-if="!handling_request"
    class="centered-max-width-650"
  >
    <h1 class="center">
      {{ $t('t_edit_tag') }}
    </h1>

    <form @submit.prevent="updateTag">
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
        @focus="resetErrors"
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
          {{ $t('t_update') }}
        </GenericButtonElement>
      </nav>
    </form>
  </main>
</template>
