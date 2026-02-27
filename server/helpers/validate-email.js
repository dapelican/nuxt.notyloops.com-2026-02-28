'use strict';

import validator from 'validator';

const validateEmail = (email) => validator.isEmail(email);

export {
  validateEmail,
};
