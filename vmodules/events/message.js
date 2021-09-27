const wink = require(`jaro-winkler`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

exports.name = `messageCreate`;
exports.run = async (message) => {
  const bot = memory.client;
  const member = message.member;

  if (bot.booting) return;
  if (message.author.bot || message.author.system || message.system || message.type !== `DEFAULT`) return;
};