import djs, { ClientOptions } from 'discord.js';
import memory from '../core/shard_memory';
import cfg from '../util/bot_config';
import { write as log } from '../util/logger';

import KeysConfig from '../util/interfaces/KeysConfig';
import BotConfig from '../util/interfaces/BotConfig';

import assetManager from '../managers/asset_manager';
import localeManager from '../managers/locale_manager';
import commandsManager from '../managers/command_manager';
import configsManager from '../managers/config_manager';

export default class Vector extends djs.Client {

  public keys: KeysConfig;
  public log: typeof log;
  public cfg: BotConfig;
  public debug: boolean;
  public booting: boolean;
  public version: string;
  public managers: {
    assets: typeof assetManager;
    locale: typeof localeManager;
    commands: typeof commandsManager;
    configs: typeof configsManager;
  }

  constructor(djs_opts: ClientOptions, options = { debug: false }) {
    super(djs_opts);

    this.keys = require(`../../cfg/keys.json`);
    this.log = log;
    this.cfg = cfg(options.debug);
    this.debug = options.debug;
    this.booting = true;
    this.version = require(`../../package.json`).version;

    this.managers = {
      assets: assetManager,
      locale: localeManager,
      commands: commandsManager,
      configs: configsManager
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