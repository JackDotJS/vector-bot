"use strict";
const log = require(`../util/logger.js`).write;
exports.name = `warn`;
exports.run = (content) => log(content, `warn`);
