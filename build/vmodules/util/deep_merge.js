"use strict";
/**
 * VECTOR :: DEEP MERGE UTIL
 */
Object.defineProperty(exports, "__esModule", { value: true });
const isObject = (item) => {
    return (item && typeof item === `object` && !Array.isArray(item));
};
// this is an interesting function here. not sure how to convert it into TS.
// this is my best shot.
function merge(target, ...sources) {
    if (!sources.length)
        return target;
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
}
exports.default = merge;
;
