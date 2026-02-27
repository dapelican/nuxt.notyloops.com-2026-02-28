<script setup>
// http://fr.localhost:2345/a/sign-up-2/9352e75d-89d7-487d-b8f2-bd7dedce7b0e

const { fetch: refreshSession } = useUserSession();
const error_invalid_email_token = ref(false);
const error_invalid_password = ref(false);
const handling_request = ref(false);
const password_1 = ref('');
const password_2 = ref('');
const route = useRoute();
const show_password = ref(false);

useSeoMeta({
  title: `${$t('t_sign_up_step_2_of_2')} | OptiLeague`,
});

// Keep at top level to avoid hydratation issues
const {
  data: verify_data,
  error: verify_error,
} = await useFetch(`/a/verify-token-to-validate-email/${route.params.token_to_validate_email}`);

if (verify_error.value) {
  const error_message = verify_error.value.data?.error;

  switch (error_message) {
    case 'error_invalid_email_token':
      error_invalid_email_token.value = true;
      break;
    case 'error_invalid_password':
      error_invalid_password.value = true;
      break;
    default:
      handleFrontendError(null, error_message);
      break;
  }
}

const email = computed(() => verify_data.value?.email ?? '');

const signUp = async () => {
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
    await $fetch('/a/sign-up', {
      method: 'POST',
      body: {
        email: email.value,
        password_1: password_1.value,
        password_2: password_2.value,
        token: route.params.token_to_validate_email,
      },
    });

    await refreshSession();
    handling_request.value = false;
    return navigateTo('/a/connection-information');
  } catch (error) {
    const error_message = error?.data?.error_message;

    switch (error_message) {
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
        {{ $t('t_sign_up_step_2_of_2') }}
      </h1>

      <form
        v-if="email"
        class="centered-max-width-400"
        @submit.prevent="signUp"
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
          <button
            v-if="!handling_request"
            type="submit"
            class="button-1"
          >
            {{ $t('t_sign_up') }}
          </button>

          <LoadingSpinnerElement
            v-if="handling_request"
            :with_top_margin="false"
          />
        </nav>
      </form>

      <i18n-t
        v-if="error_invalid_email_token"
        keypath="t_invalid_email_token"
        tag="p"
        class="centered-max-width-400 alert-danger"
      >
        <template #link>
          <NuxtLink
            to="/a/sign-up-1"
            class="pseudo-link"
          >
            {{ $t('t_invalid_email_token_link') }}
          </NuxtLink>
        </template>
      </i18n-t>
    </template>
  </section>
</template>

<style scoped>
  .show-password {
    margin-top: 10px;
  }
</style>
