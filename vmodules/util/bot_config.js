const cfg = require(`../../cfg/bot.json`);
const dcfg = require(`../../cfg/bot_debug.json`);

module.exports = (debug) => {
  if (debug) {
    // if bot is running in debug mode, load debug config and overwrite main cfg properties.
    // this means the main config is used as a base, and the debug config only needs to specify
    // properties that need to be changed.
    Object.assign(cfg, dcfg);
  }

  return cfg;
};