const log = require(`../util/logger.js`).write;

exports.name = `ready`;
exports.run = (client) => {
  log(`Successfully connected to Discord API.`, `info`);
  log(`This shard is handling ${client.guilds.cache.size} guild(s)!`, `info`);
};