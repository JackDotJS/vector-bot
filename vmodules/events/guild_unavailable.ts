const log = require(`../util/logger.js`).write;

exports.name = `guildUnavailable`;
exports.run = (guild) => {
  log([
    `Guild Unavailable!`,
    `Unable to connect to "${guild.name}"`,
    `Guild ID: ${guild.id}`
  ].join(`\n`), `warn`);
};