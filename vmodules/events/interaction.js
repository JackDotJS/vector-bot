const log = require(`../util/logger.js`).write;

exports.name = `interactionCreate`;
exports.run = (int) => {
  log(`interaction received`);

  log(int.client);
  log(int.client.debug);

  if (!int.isCommand()) return;
  //if (bot.debug && ![bot.cfg.dev.discord_user_id, ...bot.cfg.dev.user_whitelist].includes(int.user)) return;
};