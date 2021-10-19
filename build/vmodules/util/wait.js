"use strict";
/**
 * VECTOR :: SIMPLE ASYNC TIMEOUT
 */
Object.defineProperty(exports, "__esModule", { value: true });
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.default = wait;
;
