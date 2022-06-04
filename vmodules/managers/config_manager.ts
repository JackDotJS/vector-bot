/**
 * VECTOR :: GUILD CONFIG MANAGER
 */

import fetch from 'node-fetch';
import memory from '../core/shard_memory.js';
import { write as log } from '../util/logger';

export default class ConfigManager {
  constructor() {
    throw new Error(`Why are you doing this? (Cannot instantiate this class.)`);
  }

  static async update() {
    // todo
  }

  static async get(id) {
    const bot = memory.client;

    if (bot.guilds.resolveId(id) == null) return null;
    
    const template = require(`../../cfg/guild.json`);

    const res = await fetch(`http://localhost:${bot.cfg.api.port}/guildcfg?key=${bot.keys.db}&guild=${id}`);
    const data = await res.json();

    log(data);

    // @ts-ignore // TODO: what the fuck is the `unknown` type and how do i type check it against APIMessage
    if (data.doc == null) return template;

    // @ts-ignore // TODO: what the fuck is the `unknown` type and how do i type check it against APIMessage
    return Object.assign(template, data.doc);
  }
};