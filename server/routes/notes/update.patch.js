'use strict';

import {
  HTTP_CODE_200_OK,
  HTTP_CODE_400_BAD_REQUEST,
  HTTP_CODE_401_UNAUTHORIZED,
} from '../../helpers/http-status-codes.js';

import {
  defineEventHandler,
  readBody,
  setResponseStatus,
} from 'h3';

import {
  executeSQLQuery,
} from '../../database/query.js';

import {
  handleBackendError,
} from '../../helpers/handle-backend-error.js';

import {
  verifySessionAndReturnUser,
} from '../../helpers/verify-session-and-return-user.js';

export default defineEventHandler(async (event) => {
  try {
    const user = await verifySessionAndReturnUser(event);

    if (user === null) {
      setResponseStatus(event, HTTP_CODE_401_UNAUTHORIZED);

      return {
        error_message: 'error_unauthorized',
      };
    }

    const {
      note_id,
      title,
      note_details,
    } = await readBody(event);

    if (!note_id || !title) {
      setResponseStatus(event, HTTP_CODE_400_BAD_REQUEST);

      return {
        error_message: 'error_invalid_input',
      };
    }

    // Make sure the note to update belongs to the user
    const {
      rows: note_list,
    } = await executeSQLQuery(
      'SELECT id FROM notes WHERE user_id = $1 AND id = $2',
      [user.id, note_id]
    );

    if (note_list.length === 0) {
      setResponseStatus(event, HTTP_CODE_400_BAD_REQUEST);

      return {
        error_message: 'error_invalid_input',
      };
    }

    await executeSQLQuery(
      'UPDATE notes SET title = $1 WHERE id = $2',
      [title, note_id]
    );

    await executeSQLQuery(
      'DELETE FROM note_details WHERE note_id = $1',
      [note_id]
    );

    for (const detail of note_details) {
      await executeSQLQuery(
        `INSERT INTO note_details (note_id,
        position,
        plain_content,
        html_content,
        to_be_hidden,
        is_correct)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          note_id,
          detail.position,
          detail.plain_content,
          detail.html_content,
          detail.to_be_hidden,
          detail.is_correct,
        ]
      );
    }

    setResponseStatus(event, HTTP_CODE_200_OK);

    return {};
  } catch (error) {
    /* c8 ignore next */
    return handleBackendError(error, event);
  }
});
