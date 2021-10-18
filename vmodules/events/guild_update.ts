const log = require(`../util/logger.js`).write;

exports.name = `guildUpdate`;
exports.run = (oldg, newg) => {
  if (oldg.available && newg.available) return;
  log([
    `Guild Available!`,
    `"${newg.name}" has recovered.`,
    `Guild ID: ${newg.id}`
  ].join(`\n`), `warn`);
};