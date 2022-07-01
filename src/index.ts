/**
 * VECTOR :: INITIALIZATION AND SHARD MANAGEMENT
 */

import * as fs from 'fs';
// import * as util from 'util';
import { ShardingManager } from 'discord.js';
import * as pkg from '../package.json';
import * as cfg from '../config/bot.json';
import isInterface from './util/isInterface';
import Logger, { LoggingLevel } from './util/logger';
import keys from '../config/keys.json';

process.title = `Vector Bot ${pkg.version}`;

const debugMode = process.argv.includes(`--debug`) || process.argv.includes(`-d`);
let logins = 1;

// create directories that may or may not exist because Git(TM)
const mkdirs = [
  `./.local`,
  `./data/archive`,
  `./logs/crash`,
  `./logs/archive`,
  `./logs/all`
];

for (const item of mkdirs) {
  if (!fs.existsSync(item)) {
    fs.mkdirSync(item, { recursive: true });
  }
}

Logger.compressLogs(); // Compress the log files before instantiating a new Logger class as to clean up any files from a previous session

// check login count, to prevent API spam in the case of a boot loop
interface ErrorWithCode extends Error {
  code?: string
}

try {
  // try making file if it does not exist
  const data = {
    logins: 1,
    time: new Date().getTime()
  };

  fs.writeFileSync(`./data/resets`, JSON.stringify(data), { encoding: `utf8`, flag: `ax` });
} catch (e: unknown) {

  if (isInterface<ErrorWithCode>(e, `code`)) {
    if (e.code !== `EEXIST`) {
      throw e;
    }
  }

  const oldData = fs.readFileSync(`./data/resets`, { encoding: `utf8` });

  let json = {
    logins: 0,
    time: 0
  };

  // Attempt to parse as JSON.
  // If the JSON data is corrupt, it'll be up to the user to fix it.
  // Simply overwriting with default values could cause problems down the line.
  json = JSON.parse(oldData);

  // if it's been more than an hour, reset the login count
  const now = new Date().getTime();
  if (now - json.time > (1000 * 60 * 60)) {
    json.logins = 0;
    json.time = now;
  }

  json.logins++;

  logins = json.logins;

  fs.writeFileSync(`./data/resets`, JSON.stringify(json), { encoding: `utf8` });
}

const logger = new Logger({ loginCount: logins });

// check login count before proceeding
if (debugMode) {
  if (logins === cfg.loginLimit.absolute) {
    logger.fatal(`too many resets`);
    process.exit(1);
  }
} else {
  if (logins > cfg.loginLimit.warning) {
    logger.warn(`lots of resets`);
  }

  if (logins > cfg.loginLimit.shutdown) {
    logger.fatal(`too many resets`);
    process.exit(1);
  }
}

// we did it reddit
logger.verbose(`:)`);

interface ShardMessage {
  type: LoggingLevel,
  content: string
}

const options = {
  token: keys.discord,
  shardArgs: [debugMode.toString()]
};

const shardManager = new ShardingManager(`./build/src/shard.js`, options);

shardManager.on(`shardCreate`, shard => {
  logger.log(`Launched shard ${shard.id}`);

  shard.on(`message`, (message: ShardMessage) => {
    switch (message.type) {
      case `log`: {
        logger.log(`[Shard ${shard.id}] ${message.content}`);
        break;
      }
      case `warn`: {
        logger.warn(`[Shard ${shard.id}] ${message.content}`);
        break;
      }
      case `error`: {
        logger.error(`[Shard ${shard.id}] ${message.content}`);
        break;
      }
      case `fatal`: {
        logger.fatal(`[Shard ${shard.id}] ${message.content}`);
        break;
      }
      case `verbose`: {
        logger.verbose(`[Shard ${shard.id}] ${message.content}`);
        break;
      }
      default: {
        logger.warn(`[Master] Unexpected message from shard ${shard.id}: ${message}`);
        break;
      }
    }
  });
});

shardManager.spawn();
