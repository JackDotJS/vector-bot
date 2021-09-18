const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

exports.name = `interactionCreate`;
exports.run = (int) => {
  const bot = memory.client;
  log(`interaction received`);

  if (!int.isCommand()) return;
  if (bot.debug && ![bot.cfg.dev.discord_user_id, ...bot.cfg.dev.user_whitelist].includes(int.user.id)) return;

  int.reply(`asdfghjlk`);
};