<script setup>
import isEmail from 'validator/lib/isEmail';

// const { loggedIn: logged_in } = useUserSession();
// if (logged_in.value) {
//   navigateTo(CONNECTED_USER_LANDING_PAGE);
// }

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_log_in')} | OptiLeague`,
});

const { fetch: refreshSession } = useUserSession();
const email = ref('');
const error_account_not_confirmed = ref(false);
const error_invalid_email = ref(false);
const error_invalid_password = ref(false);
const error_wrong_credentials = ref(false);
const handling_request = ref(false);
const password = ref('');
const show_password = ref(false);

const logIn = async () => {
  handling_request.value = true;

  if (!isEmail(email.value)) {
    error_invalid_email.value = true;
    handling_request.value = false;
    return null;
  }

  if (password.value.length === 0) {
    error_invalid_password.value = true;
    handling_request.value = false;
    return null;
  }

  try {
    await $fetch('/a/log-in', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    await refreshSession();
    handling_request.value = false;
    return navigateTo(CONNECTED_USER_LANDING_PAGE);
  } catch (error) {
    const error_message = error?.data?.error_message;

    switch (error_message) {
      case 'error_account_not_confirmed':
        error_account_not_confirmed.value = true;
        handling_request.value = false;
        break;
      case 'error_invalid_email':
        error_invalid_email.value = true;
        handling_request.value = false;
        break;
      case 'error_invalid_password':
        error_invalid_password.value = true;
        handling_request.value = false;
        break;
      case 'error_wrong_credentials':
        error_wrong_credentials.value = true;
        handling_request.value = false;
        break;
      case 'error_email_already_in_use':
        error_email_already_in_use.value = true;
        handling_request.value = false;
        break;
      default:
        handleFrontendError(error, error_message);
        break;
    }
  }
};

const resetErrors = () => {
  error_invalid_email.value = false;
  error_wrong_credentials.value = false;
  error_account_not_confirmed.value = false;
};
</script>

<template>
  <section>
    <h1 class="center">
      {{ $t('t_log_in') }}
    </h1>

    <i18n-t
      v-if="error_account_not_confirmed"
      keypath="t_account_not_confirmed_message"
      tag="p"
      class="centered-max-width-400 alert-danger"
    >
      <template #link>
        <NuxtLink
          to="/a/sign-up-1"
          class="pseudo-link"
        >{{ $t('t_account_not_confirmed_link') }}</NuxtLink>
      </template>
    </i18n-t>

    <form
      v-if="!error_account_not_confirmed"
      class="centered-max-width-400"
      @submit.prevent="logIn"
    >
      <i18n-t
        v-if="error_wrong_credentials"
        keypath="t_wrong_credentials_message"
        tag="p"
        class="centered-max-width-400 alert-danger"
      >
        <template #link>
          <NuxtLink
            to="/a/sign-up-1"
            class="pseudo-link"
          >{{ $t('t_wrong_credentials_link') }}</NuxtLink>
        </template>
      </i18n-t>

      <label for="email">{{ $t('t_email') }}</label>
      <input
        id="email"
        v-model="email"
        type="text"
        name="email"
        autocomplete="email"
        class="input-type-text"
        required
        @focus="resetErrors"
      >

      <p
        v-if="error_invalid_email"
        class="alert-danger"
      >
        {{ $t('t_enter_valid_email_address') }}
      </p>

      <hr class="separator-0-5">

      <label for="password">{{ $t('t_password') }}</label>
      <input
        id="password"
        v-model="password"
        :type="show_password ? 'text' : 'password'"
        name="password"
        autocomplete="password"
        class="input-type-password"
        required
      >

      <section class="show-password">
        <label for="toggle-password">
          <input
            id="toggle-password"
            v-model="show_password"
            type="checkbox"
          >
          {{ $t('t_show_password') }}
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
          {{ $t('t_log_in') }}
        </GenericButtonElement>
      </nav>

      <hr class="separator-1">

      <NuxtLink
        to="/a/password-forgotten"
        class="pseudo-link"
      >{{ $t('t_password_forgotten_question') }}</NuxtLink>
    </form>
  </section>
</template>

<style scoped>
.show-password {
  margin-top: 10px;
}
</style>
