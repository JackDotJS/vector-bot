const djs = require(`discord.js`);
const cfg = require(`../../cfg/bot.json`);
const mem = require(`../core/memory.js`);
const log = require(`../core/log.js`);

module.exports = class Vector extends djs.Client {
  constructor(djs_opts, options = {}) {
    super(djs_opts);

    if (options.debug) {
      // if bot is running in debug mode, load debug config and overwrite main cfg properties.
      // this means the main config is used as a base, and the debug config only needs to specify
      // properties that need to be changed.
      const dcfg = require(`../../cfg/bot_debug.json`);
      Object.assign(cfg, dcfg);
    }

    mem.client = this;

    this.keys = require(`../../cfg/keys.json`);
    this.log = log;
    this.cfg = cfg;
    this.debug = options.debug;
    this.booting = true;
    this.version = require(`../../package.json`).version;

    log(`client instance ready`);
  }

  exit(code = 0) {
    this.destroy();
    process.exit(code);
  }
};