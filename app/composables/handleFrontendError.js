export const handleFrontendError = (error, message) => {
  switch (message) {
    case 'error_no_user_found':
      navigateTo('/a/log-in');
      break;
    default:
      $fetch('/monitoring/save-log', {
        method: 'POST',
        body: {
          content: JSON.stringify({
            error: error.toString(),
            message,
          }),
        },
      });

      showError({
        statusCode: 500,
        statusMessage: message ?? 'Internal Server Error',
        message: message ?? error?.message ?? 'An unexpected error occurred',
      });
      break;
  }
};
