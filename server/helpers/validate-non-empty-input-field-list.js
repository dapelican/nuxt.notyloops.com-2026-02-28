'use strict';

const validateNonEmptyInputFieldList = (field_list) => {
  for (const field of field_list) {
    if (!field) {
      return false;
    }
  }
  return true;
};

export {
  validateNonEmptyInputFieldList,
};
