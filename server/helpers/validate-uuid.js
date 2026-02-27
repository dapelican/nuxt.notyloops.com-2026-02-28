'use strict';

import validator from 'validator';

const validateUUID = (uuid) => validator.isUUID(uuid, 4) || validator.isUUID(uuid, 7);

export {
  validateUUID,
};
