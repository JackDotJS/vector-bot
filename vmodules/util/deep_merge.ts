/**
 * VECTOR :: DEEP MERGE UTIL
 */

const log = require(`./logger.js`).write;

const isObject = (item) => {
  return (item && typeof item === `object` && !Array.isArray(item));
};

const merge = (target, ...sources) => {
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

module.exports = merge;