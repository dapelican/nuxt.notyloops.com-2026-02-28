<script setup>
import isEmail from 'validator/lib/isEmail';

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_password_forgotten')} | OptiLeague`,
});

const email = ref('');
const error_invalid_email = ref(false);
const error_no_user_found = ref(false);
const error_email_token_failure = ref(false);
const handling_request = ref(false);
const show_message = ref(false);

const sendPasswordForgottenEmail = async () => {
  handling_request.value = true;

  if (!isEmail(email.value)) {
    error_invalid_email.value = true;
    handling_request.value = false;
    return null;
  }

  try {
    await $fetch('/a/send-token-to-reset-password', {
      method: 'POST',
      body: {
        email: email.value,
      },
    });

    show_message.value = true;
  } catch (error) {
    const error_message = error?.data?.error_message;

    switch (error_message) {
      case 'error_invalid_email':
        error_invalid_email.value = true;
        handling_request.value = false;
        break;
      case 'error_no_user_found':
        error_no_user_found.value = true;
        handling_request.value = false;
        break;
      case 'error_email_token_failure':
        error_email_token_failure.value = true;
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
  error_no_user_found.value = false;
};
</script>

<template>
  <section>
    <h1 class="center">
      {{ $t('t_password_forgotten') }}
    </h1>

    <form
      v-if="!show_message"
      class="centered-max-width-400"
      @submit.prevent="sendPasswordForgottenEmail"
    >
      <p>
        {{ $t('t_enter_email_address_of_your_account') }}
      </p>

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

      <p
        v-if="error_no_user_found"
        class="alert-danger"
      >
        {{ $t('t_no_account_with_this_email_address') }}
      </p>

      <i18n-t
        v-if="error_email_token_failure"
        keypath="t_email_token_failure_message"
        tag="p"
        class="alert-danger"
      >
        <template #link>
          <NuxtLink to="mailto:support@optileague.com">support@optileague.com</NuxtLink>
        </template>
      </i18n-t>

      <hr class="separator-1">

      <nav class="flex-ce-ce-gap-2">
        <GenericButtonElement
          :design_type="1"
          button_type="submit"
          :waiting="handling_request"
        >
          {{ $t('t_submit') }}
        </GenericButtonElement>
      </nav>
    </form>

    <p
      v-if="show_message"
      class="centered-max-width-400 alert-info"
    >
      {{ $t('t_email_sent_message') }}
    </p>
  </section>
</template>
