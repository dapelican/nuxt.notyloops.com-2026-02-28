'use strict';

import {
  HTTP_CODE_201_CREATED,
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
      note_details,
      tag_id_list,
      title,
    } = await readBody(event);

    if (!title) {
      setResponseStatus(event, HTTP_CODE_400_BAD_REQUEST);
      return { error_message: 'error_invalid_input' };
    }

    const { rows: new_note_list } = await executeSQLQuery(
      'INSERT INTO notes (user_id, title) VALUES ($1, $2) RETURNING id',
      [user.id, title]
    );

    const note_id = new_note_list.at(0).id;

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

    if (Array.isArray(tag_id_list) && tag_id_list.length > 0) {
      for (const tag_id of tag_id_list) {
        await executeSQLQuery(
          'INSERT INTO note_tags (user_id, note_id, tag_id) VALUES ($1, $2, $3)',
          [user.id, note_id, tag_id]
        );
      }
    }

    setResponseStatus(event, HTTP_CODE_201_CREATED);

    return {
      success: true,
    };
  } catch (error) {
    /* c8 ignore next */
    return handleBackendError(error, event);
  }
});
