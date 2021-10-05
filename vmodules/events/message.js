const wink = require(`jaro-winkler`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

exports.name = `messageCreate`;
exports.run = async (message) => {
  const bot = memory.client;
  const member = message.member;

  // not ready to work
  if (bot.booting) return;
  // not a message we can/should process.
  if (message.author.bot || message.author.system || message.system || message.type !== `DEFAULT`) return;
  // bot is in debug mode and the message author is not whitelisted
  if (bot.debug && ![bot.cfg.dev.discord_user_id, ...bot.cfg.dev.user_whitelist].includes(message.author.id)) return;

  const gcfg = await bot.managers.configs.get(message.guild);

  log(`messij recieved`);
  log(gcfg);
};