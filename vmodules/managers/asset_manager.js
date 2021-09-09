const mem = require(`../core/memory.js`);
const log = require(`../core/log.js`);

module.exports = class AssetManager {
  constructor() {
    throw new Error(`Why are you doing this? (Cannot instantiate this class.)`);
  }

  static async getCacheGuild() {
    const bot = mem.client;
    return await this.guilds.fetch({ guild: bot.cfg.cache.guild_id, withCounts: false });
  }
};