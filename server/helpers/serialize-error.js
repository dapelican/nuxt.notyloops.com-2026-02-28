'use strict';

import { DateTime } from 'luxon';

const serializeError = (error) => ({
  cause: error?.cause instanceof Error ? serializeError(error.cause) : error?.cause,
  code: error?.code,
  column: error?.column,
  constraint: error?.constraint,
  data: error?.data,
  detail: error?.detail,
  hint: error?.hint,
  message: error?.message,
  name: error?.name,
  position: error?.position,
  severity: error?.severity,
  stack: error?.stack,
  statusCode: error?.statusCode ?? error?.status,
  statusText: error?.statusText,
  table: error?.table,
  timestamp: DateTime.utc().toISO(),
});

export {
  serializeError,
};
