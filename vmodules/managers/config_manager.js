/**
 * VECTOR :: GUILD CONFIG MANAGER
 */

const fetch = require(`node-fetch`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

module.exports = class ConfigManager {
  constructor() {
    throw new Error(`Why are you doing this? (Cannot instantiate this class.)`);
  }

  static async get(id) {
    if (id == null || typeof id !== `string` || id.length === 0) return null;

    const bot = memory.client;

    const res = await fetch(`localhost:${bot.cfg.api.port}/guildcfg?key=${bot.keys.db}&guild=${id}`);
    const data = await res.json();

    return Object.assign(require(`../../cfg/guild.json`), data);
  }
};