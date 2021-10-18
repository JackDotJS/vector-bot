/**
 * VECTOR :: SIMPLE ASYNC TIMEOUT
 */

export default function wait(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};