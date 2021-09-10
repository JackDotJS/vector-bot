const log = require(`../util/logger.js`).write;

exports.name = `ready`;
exports.run = (client) => {
  log(`[SHARD ${client.shard.ids[0]}] Successfully connected to Discord API.`, `info`);
  log(`[SHARD ${client.shard.ids[0]}] This shard is handling ${client.guilds.cache.size} guild(s)!`, `info`);
};