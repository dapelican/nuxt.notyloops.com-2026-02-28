<script setup>
import isEmail from 'validator/lib/isEmail';

definePageMeta({ middleware: 'auth' });

useSeoMeta({
  title: `${$t('t_my_connection_information')} | OptiLeague`,
});

const current_email = ref('');
const current_password = ref('');
const error_email_already_in_use = ref(false);
const error_invalid_email = ref(false);
const error_invalid_password = ref(false);
const error_wrong_credentials = ref(false);
const handling_request = ref(false);
const new_email = ref('');
const new_password_1 = ref('');
const new_password_2 = ref('');
const show_passwords = ref(false);
const show_new_email = ref(false);
const show_new_password = ref(false);

// Keep at top level to avoid hydratation issues
const {
  data: user_data,
  error: user_error,
} = await useFetch('/a/user');

if (user_error.value) {
  handleFrontendError(null, user_error.value.data?.error_message);
}

const email = computed(() => user_data.value?.email);

current_email.value = email.value;

const changeEmail = async () => {
  handling_request.value = true;

  if (!isEmail(new_email.value)) {
    error_invalid_email.value = true;
    handling_request.value = false;
    return null;
  }

  try {
    const {
      email: seached_new_email,
    } = await $fetch('/a/change-email', {
      method: 'POST',
      body: {
        current_email: current_email.value,
        new_email: new_email.value,
      },
    });

    current_email.value = seached_new_email;
    handling_request.value = false;
    return navigateTo('/a/log-in');
  } catch (error) {
    const error_message = error?.data?.error_message;

    switch (error_message) {
      case 'error_invalid_email':
        error_invalid_email.value = true;
        handling_request.value = false;
        break;
      case 'error_email_already_in_use':
        error_email_already_in_use.value = true;
        handling_request.value = false;
        break;
      default:
        handleFrontendError(null, error_message);
        break;
    }
  }
};

const changePassword = async () => {
  handling_request.value = true;

  if (
    new_password_1.value.length === 0
    || new_password_2.value.length === 0
    || new_password_1.value !== new_password_2.value
  ) {
    error_invalid_password.value = true;
    handling_request.value = false;
    return null;
  }

  try {
    await $fetch('/a/change-password', {
      method: 'POST',
      body: {
        email: current_email.value,
        current_password: current_password.value,
        new_password_1: new_password_1.value,
        new_password_2: new_password_2.value,
      },
    });

    handling_request.value = false;
    return navigateTo('/a/log-in');
  } catch (error) {
    const error_message = error?.data?.error_message;

    switch (error_message) {
      case 'error_invalid_password':
        error_invalid_password.value = true;
        handling_request.value = false;
        break;
      case 'error_wrong_credentials':
        error_wrong_credentials.value = true;
        handling_request.value = false;
        break;
      default:
        handleFrontendError(error, error_message);
        break;
    }
  }
};

const resetEmailErrors = () => {
  error_invalid_email.value = false;
};

const resetPasswordErrors = () => {
  error_invalid_password.value = false;
  error_wrong_credentials.value = false;
};
</script>

<template>
  <section>
    <LoadingSpinnerElement v-if="handling_request" />

    <template v-if="!handling_request">
      <h1 class="center">
        {{ $t('t_my_connection_information') }}
      </h1>

      <main class="centered-max-width-400">
      <section>
        <h2>{{ $t('t_email') }}</h2>

        <p v-if="!show_new_email">
          {{ current_email }}
        </p>

        <button
          v-if="!show_new_email"
          class="button-2"
          @click="show_new_email = true"
        >
          {{ $t('t_change_email_address') }}
        </button>

        <form
          v-if="show_new_email"
          @submit.prevent="changeEmail"
        >
          <label for="new-email">{{ $t('t_new_email') }}</label>
          <input
            id="new-email"
            v-model="new_email"
            type="text"
            name="new-email"
            autocomplete="email"
            class="input-type-text"
            required
            @focus="resetEmailErrors"
          >

          <p
            v-if="error_invalid_email"
            class="alert-danger"
          >
            {{ $t('t_enter_valid_email_address') }}
          </p>

          <p
            v-if="error_email_already_in_use"
            class="alert-danger"
          >
            {{ $t('t_email_already_used') }}
          </p>

          <hr class="separator-1">

          <nav class="flex-ce-ce-gap-2">
            <button
              class="button-2"
              @click="show_new_email = false"
            >
              {{ $t('t_cancel') }}
            </button>

            <button
              type="submit"
              class="button-1"
              :disabled="handling_request"
              :class="{ 'button-1-disabled': handling_request }"
            >
              {{ $t('t_change') }}
            </button>
          </nav>
        </form>
      </section>

      <hr class="separator-1">

      <section>
        <h2>{{ $t('t_password') }}</h2>

        <button
          v-if="!show_new_password"
          class="button-2"
          @click="show_new_password = true"
        >
          {{ $t('t_change_password') }}
        </button>

        <form
          v-if="show_new_password"
          @submit.prevent="changePassword"
        >
          <label for="current-password">{{ $t('t_current_password') }}</label>
          <input
            id="current-password"
            v-model="current_password"
            :type="show_passwords ? 'text' : 'password'"
            name="current-password"
            autocomplete="password"
            class="input-type-password"
            required
            @focus="resetPasswordErrors"
          >

          <hr class="separator-0-5">

          <label for="new-password-1">{{ $t('t_new_password') }}</label>
          <input
            id="new-password-1"
            v-model="new_password_1"
            :type="show_passwords ? 'text' : 'password'"
            name="new-password-1"
            autocomplete="password"
            class="input-type-password"
            required
            @focus="resetPasswordErrors"
          >

          <hr class="separator-0-5">

          <label for="new-password-2">{{ $t('t_confirm_new_password') }}</label>
          <input
            id="new-password-2"
            v-model="new_password_2"
            :type="show_passwords ? 'text' : 'password'"
            name="new-password-2"
            autocomplete="password"
            class="input-type-password"
            required
            @focus="resetPasswordErrors"
          >

          <section class="show-password">
            <label for="toggle-password">
              <input
                id="toggle-password"
                v-model="show_passwords"
                type="checkbox"
              >
              {{ $t('t_show_passwords') }}
            </label>
          </section>

          <p
            v-if="error_invalid_password"
            class="alert-danger"
          >
            {{ $t('t_enter_new_identical_passwords') }}
          </p>

          <p
            v-if="error_wrong_credentials"
            class="alert-danger"
          >
            {{ $t('t_current_password_incorrect') }}
          </p>

          <hr class="separator-1">

          <nav class="flex-ce-ce-gap-2">
            <button
              class="button-2"
              @click="show_new_password = false"
            >
              {{ $t('t_cancel') }}
            </button>

            <button
              type="submit"
              class="button-1"
              :disabled="handling_request"
              :class="{ 'button-1-disabled': handling_request }"
            >
              {{ $t('t_change') }}
            </button>
          </nav>
        </form>
      </section>
    </main>
    </template>


  </section>
</template>

<style scoped>
.show-password {
  margin-top: 10px;
}
</style>
