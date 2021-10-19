import cfg from '../../cfg/bot.json';
import dcfg from '../../cfg/bot_debug.json';
import merge from '../util/deep_merge';
import BotConfig from './interfaces/BotConfig';

export default function botConfig(debug: boolean): BotConfig {
  if (debug) {
    // if bot is running in debug mode, load debug config and overwrite main cfg properties.
    // this means the main config is used as a base, and the debug config only needs to specify
    // properties that need to be changed.

    return merge(cfg, dcfg);
  }

  return cfg;
};