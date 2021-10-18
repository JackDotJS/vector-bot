import djs from 'discord.js';
import memory from '../core/shard_memory';
import cfg from '../util/bot_config';
const log = require(`../util/logger.js`).write;

module.exports = class Vector extends djs.Client {
  constructor(djs_opts, options = {}) {
    super(djs_opts);

    this.keys = require(`../../cfg/keys.json`);
    this.log = log;
    this.cfg = cfg(options.debug);
    this.debug = options.debug;
    this.booting = true;
    this.version = require(`../../package.json`).version;

    this.managers = {
      assets: require(`../managers/asset_manager.js`),
      locale: require(`../managers/locale_manager.js`),
      commands: require(`../managers/command_manager.js`),
      configs: require(`../managers/config_manager.js`)
    };

    memory.client = this;

    this.managers.commands.load();
    this.managers.locale.load();
    
    log(`client instance ready`);

    // will be adding more stuff here later
    // dont worry, this property isnt completely pointless
    this.booting = false;
  }

  exit(code = 0) {
    this.destroy();
    process.exit(code);
  }
};