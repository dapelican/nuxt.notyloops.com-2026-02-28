<script setup>
// http://fr.localhost:2345/a/reset-password/9352e75d-89d7-487d-b8f2-bd7dedce7b0e

const error_invalid_email_token = ref(false);
const error_invalid_password = ref(false);
const handling_request = ref(false);
const password_1 = ref('');
const password_2 = ref('');
const route = useRoute();
const show_password = ref(false);

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_reset_my_password')} | OptiLeague`,
});

const {
  data: verify_data,
  error: verify_error,
} = await useFetch(`/a/verify-token-to-reset-password/${route.params.token_to_reset_password}`);

if (verify_error.value) {
  const error_message = verify_error.value.data?.error_message;

  switch (error_message) {
    case 'error_invalid_email_token':
      error_invalid_email_token.value = true;
      handling_request.value = false;
      break;
    default:
      handleFrontendError(null, error_message);
      break;
  }
}

const email = computed(() => verify_data.value?.email ?? '');

const resetPassword = async () => {
  handling_request.value = true;

  if (
    password_1.value.length === 0
    || password_2.value.length === 0
    || password_1.value !== password_2.value
  ) {
    error_invalid_password.value = true;
    handling_request.value = false;
    return null;
  }

  try {
    await $fetch(
      '/a/reset-password',
      {
        method: 'POST',
        body: {
          email: email.value,
          token: route.params.token_to_reset_password,
          password_1: password_1.value,
          password_2: password_2.value,
        },
      });

    handling_request.value = false;
    return navigateTo('/a/log-in');
  } catch (error) {
    const error_message = error?.data?.error_message;

    switch (error_message) {
      case 'error_invalid_email_token':
        error_invalid_email_token.value = true;
        handling_request.value = false;
        break;
      case 'error_invalid_password':
        error_invalid_password.value = true;
        handling_request.value = false;
        break;
      default:
        handleFrontendError(error, error_message);
        break;
    }
  }
};

const resetErrors = () => {
  error_invalid_password.value = false;
};
</script>

<template>
  <section>
    <LoadingSpinnerElement v-if="handling_request" />

    <template v-if="!handling_request">
      <h1 class="center">
        {{ $t('t_reset_my_password') }}
      </h1>

      <form
        v-if="!error_invalid_email_token"
        class="centered-max-width-400"
        @submit.prevent="resetPassword"
      >
        <label for="email">{{ $t('t_email') }}</label>
        <input
          id="name"
          class="input-type-text cursor-not-allowed"
          disabled
          name="email"
          :placeholder="email"
          type="text"
        >

        <hr class="separator-0-5">

        <label for="password-1">{{ $t('t_password') }}</label>
        <input
          id="password-1"
          v-model="password_1"
          :type="show_password ? 'text' : 'password'"
          name="password-1"
          autocomplete="password"
          class="input-type-password"
          required
          @focus="resetErrors"
        >

        <hr class="separator-0-5">

        <label for="password-2">{{ $t('t_confirm_password') }}</label>
        <input
          id="password-2"
          v-model="password_2"
          :type="show_password ? 'text' : 'password'"
          name="password-2"
          autocomplete="password"
          class="input-type-password"
          required
          @focus="resetErrors"
        >

        <section class="show-password">
          <label for="toggle-password">
            <input
              id="toggle-password"
              v-model="show_password"
              type="checkbox"
            >
            {{ $t('t_show_passwords') }}
          </label>
        </section>

        <p
          v-if="error_invalid_password"
          class="alert-danger"
        >
          {{ $t('t_enter_identical_passwords') }}
        </p>

        <hr class="separator-1">

        <nav class="flex-ce-ce-gap-2">
          <GenericButtonElement
            :design_type="1"
            button_type="submit"
            :waiting="handling_request"
          >
            {{ $t('t_reset') }}
          </GenericButtonElement>
        </nav>
      </form>

      <p
        v-if="error_invalid_email_token"
        class="centered-max-width-400 alert-danger"
      >
        {{ $t('t_not_allowed_to_reset_password') }}
      </p>
    </template>
  </section>
</template>

<style scoped>
  .show-password {
    margin-top: 10px;
  }
</style>
