const djs = require(`discord.js`);
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
    this.memory = {};

    this.managers = {
      assets: require(`../managers/asset_manager.js`)
    };

    log(`client instance ready`);
  }

  exit(code = 0) {
    this.destroy();
    process.exit(code);
  }
};