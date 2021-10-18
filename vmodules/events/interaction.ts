const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

exports.name = `interactionCreate`;
exports.run = (int) => {
  const bot = memory.client;
  log(`interaction received`);
  log(int);
};