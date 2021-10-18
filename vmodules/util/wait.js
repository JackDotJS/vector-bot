/**
 * VECTOR :: SIMPLE ASYNC TIMEOUT
 */

module.exports = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};