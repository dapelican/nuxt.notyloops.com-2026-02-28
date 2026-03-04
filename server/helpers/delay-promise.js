'use strict';

const delayPromise = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export {
  delayPromise,
};
