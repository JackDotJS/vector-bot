const djs = require(`discord.js`);
const memory = require(`../core/shard_memory.js`);
const cfg = require(`../util/bot_config.js`);
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
      commands: require(`../managers/command_manager.js`),
      configs: require(`../managers/config_manager.js`)
    };

    this.managers.commands.loadCommands();

    memory.client = this;
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