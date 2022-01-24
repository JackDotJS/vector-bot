/**
 * VECTOR :: DEEP MERGE UTIL
 */

import { write as log } from './logger';

const isObject = (item: any) => {
  return (item && typeof item === `object` && !Array.isArray(item));
};

// this is an interesting function here. not sure how to convert it into TS.
// this is my best shot.
export default function merge(target: any, ...sources: any[]): any {

  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (!isObject(source[key])) {
        Object.assign(target, { [key]: source[key] });
        continue;
      }

      if (!target[key]) {
        Object.assign(target, { [key]: {} });
        continue;
      }

      target[key] = Object.assign({}, target[key]);

      merge(target[key], source[key]);
    }
  }

  return merge(target, ...sources);

};