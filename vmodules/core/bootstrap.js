/**
 * VECTOR :: BOOTSTRAPPER
 */

console.clear();

const env = {
  debug: false,
  api: null,
  recovery: {
    log: null
  }
};

const setup_opts = JSON.parse(process.argv[2]);
env.debug = setup_opts.debug;

const child = require(`child_process`);
const fs = require(`fs`);
const util = require(`util`);
const AZip = require(`adm-zip`);
const djs = require(`discord.js`);
const keys = require(`../../cfg/keys.json`);
const cfg = require(`../util/bot_config.js`)(env.debug);
const pkg = require(`../../package.json`);
const log = require(`../util/logger.js`).write;

process.title = `Vector Bot ${pkg.version} | Initializing...`;

env.api = child.spawn(`node`, [`vmodules/core/api.js`, env.debug], {
  stdio: [`inherit`, `inherit`, `inherit`, `ipc`]
});

env.api.on(`message`, (data = {}) => {
  switch (data.t) {
    case `LOG`:
      log(`[API] ${data.c.content}`, data.c.level, data.c.file);
      break;
    default:
      log(util.inspect(data)); // to the debugeon with you
  }
});

env.api.on(`exit`, (code) => {
  if (code != 0) {
    log(`API subprocess closed prematurely!`, `error`);
  }
});

function init() {
  log(`Launching Vector...`, `info`);

  const shard_opts = {
    token: keys.discord,
    shardArgs: [env.debug, env.log.filename],
    //totalShards: 3, // FOR TESTING ONLY
  };

  const manager = new djs.ShardingManager(`./vmodules/core/shard.js`, shard_opts);

  manager.on(`shardCreate`, shard => {
    log(`[SHARD ${shard.id}] New shard created!`, `info`);

    shard.on(`message`, (data = {}) => {
      switch (data.t) {
        case `LOG`:
          log(`[S-${shard.id}] ${data.c.content}`, data.c.level, data.c.file);
          break;
        case `READY`:
          log(`Bot ready`);
          if (env.recovery.log != null) {
            // send crash data
            const payload = {
              t: `CRASHLOG`,
              c: env.recovery.log
            };

            shard.send(payload, (err) => {
              if (err) return log(`Failed to send payload to shard: ${err.stack}`, `error`);

              // once finished, clear crash data so it's not sent again during next scheduled restart.
              env.recovery.log = null;
            });
          }
          break;
        default:
          log(util.inspect(data)); // to the debugeon with you
      }
    });

    shard.on(`death`, p => {
      log(`[SHARD ${shard.id}] Process ended with exit code ${p.exitCode}`, `warn`);
    });
  });

  manager.spawn();
}

init();