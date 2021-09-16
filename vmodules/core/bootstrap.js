/**
 * VECTOR :: BOOTSTRAPPER
 */

console.clear();

const setup_opts = JSON.parse(process.argv[2]);

const env = {
  debug: setup_opts.debug,
  crashlog: setup_opts.crashlog,
  api: null
};

const child = require(`child_process`);
const util = require(`util`);
const djs = require(`discord.js`);
const keys = require(`../../cfg/keys.json`);
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
    shardArgs: [env.debug, env.crashlog],
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