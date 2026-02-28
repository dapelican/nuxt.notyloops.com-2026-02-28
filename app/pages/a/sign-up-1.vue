<script setup>
import isEmail from 'validator/lib/isEmail';

const { t } = useI18n();

useSeoMeta({
  title: `${t('t_sign_up_step_1_of_2')} | OptiLeague`,
});

const email = ref('');
const error_invalid_email = ref(false);
const error_email_already_in_use = ref(false);
const error_email_token_already_sent = ref(false);
const error_maximum_retries_reached = ref(false);
const handling_request = ref(false);
const show_check_your_inbox_message = ref(false);

const sendValidateEmailToken = async () => {
  handling_request.value = true;

  if (!isEmail(email.value)) {
    error_invalid_email.value = true;
    handling_request.value = false;
    return null;
  }

  try {
    // useAsyncData, useFetch or $fetch
    await $fetch('/a/send-token-to-validate-email', {
      method: 'POST',
      body: {
        email: email.value,
      },
    });

    show_check_your_inbox_message.value = true;
  } catch (error) {
    const error_message = error?.data?.error_message;

    switch (error_message) {
      case 'error_invalid_email':
        error_invalid_email.value = true;
        break;
      case 'error_corrupt_email':
        error_invalid_email.value = true;
        break;
      case 'error_email_already_in_use':
        error_email_already_in_use.value = true;
        break;
      case 'error_email_token_already_sent':
        error_email_token_already_sent.value = true;
        break;
      case 'error_maximum_retries_reached':
        error_maximum_retries_reached.value = true;
        break;
      default:
        handleFrontendError(error, error_message);
        break;
    }
  } finally {
    handling_request.value = false;
  }
};

const resetErrors = () => {
  error_invalid_email.value = false;
  error_email_already_in_use.value = false;
  error_email_token_already_sent.value = false;
  error_maximum_retries_reached.value = false;
};
</script>

<template>
  <section>
    <h1 class="center">
      {{ $t('t_sign_up_step_1_of_2') }}
    </h1>

    <form
      v-if="!show_check_your_inbox_message"
      class="centered-max-width-400"
      @submit.prevent="sendValidateEmailToken"
    >
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
        v-if="error_email_already_in_use"
        class="alert-danger"
      >
        {{ $t('t_email_already_used') }}
      </p>

      <i18n-t
        v-if="error_email_token_already_sent"
        keypath="t_email_token_already_sent_message"
        tag="p"
        class="alert-danger"
      >
        <template #link>
          <NuxtLink to="mailto:support@optileague.com">support@optileague.com</NuxtLink>
        </template>
      </i18n-t>

      <i18n-t
        v-if="error_maximum_retries_reached"
        keypath="t_maximum_retries_reached_message"
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
          {{ $t('t_confirm_email_address') }}
        </GenericButtonElement>
      </nav>
    </form>

    <p
      v-if="show_check_your_inbox_message"
      class="centered-max-width-400 alert-info"
    >
      {{ $t('t_check_your_inbox_message') }}
    </p>
  </section>
</template>

<style scoped>
.show-password {
  margin-top: 10px;
}
</style>
