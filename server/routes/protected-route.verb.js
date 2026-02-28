// 'use strict';

// import {
//   HTTP_CODE_204_NO_CONTENT,
//   HTTP_CODE_400_BAD_REQUEST,
//   HTTP_CODE_401_UNAUTHORIZED,
// } from '../../helpers/http-status-codes.js';

// import {
//   defineEventHandler,
//   readBody,
//   setResponseStatus,
// } from 'h3';

// import {
//   executeSQLQuery,
// } from '../../database/query.js';

// import {
//   handleBackendError,
// } from '../../helpers/handle-backend-error.js';

// import {
//   verifySessionAndReturnUser,
// } from '../../helpers/verify-session-and-return-user.js';

// export default defineEventHandler(async (event) => {
//   try {
//     const user = await verifySessionAndReturnUser(event);

//     if (user === null) {
//       setResponseStatus(event, HTTP_CODE_401_UNAUTHORIZED);

//       return {
//         error_message: 'error_unauthorized',
//       };
//     }

//     setResponseStatus(event, HTTP_CODE_200_OK);

//     return {};
//   } catch (error) {
//     /* c8 ignore next */
//     return handleBackendError(error, event);
//   }
// });
