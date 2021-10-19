"use strict";
const log = require(`../util/logger.js`).write;
exports.name = `error`;
exports.run = (err) => log(err.stack || err, `error`);
