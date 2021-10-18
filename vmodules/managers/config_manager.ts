/**
 * VECTOR :: GUILD CONFIG MANAGER
 */

const djs = require(`discord.js`);
const fetch = require(`node-fetch`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

module.exports = class ConfigManager {
  constructor() {
    throw new Error(`Why are you doing this? (Cannot instantiate this class.)`);
  }

  static async get(id) {
    const bot = memory.client;

    if (bot.guilds.resolveId(id) == null) return null;
    
    const template = require(`../../cfg/guild.json`);

    const res = await fetch(`http://localhost:${bot.cfg.api.port}/guildcfg?key=${bot.keys.db}&guild=${id}`);
    const data = await res.json();

    log(data);

    if (data.doc == null) return template;

    return Object.assign(template, data.doc);
  }
};