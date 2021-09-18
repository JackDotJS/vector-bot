/**
 * VECTOR :: BOOTSTRAPPER
 */

console.clear();

const setup_opts = JSON.parse(process.argv[2]);

const env = {
  debug: setup_opts.debug,
  crashlog: setup_opts.crashlog,
  api: null,
  manager: null
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
      log(data.c.content, data.c.level, data.c.file, `[API]`);
      break;
    default:
      log(util.inspect(data)); // to the debugeon with you
  }
});

env.api.on(`exit`, (code) => {
  log(`API subprocess closed prematurely! (code: ${code})`, `error`);

  env.manager.broadcast({
    t: `APICLOSED`
  });
});

function init() {
  log(`Launching Vector...`, `info`);

  const shard_opts = {
    token: keys.discord,
    shardArgs: [env.debug, env.crashlog],
    //totalShards: 3, // FOR TESTING ONLY
  };

  env.manager = new djs.ShardingManager(`./vmodules/core/shard.js`, shard_opts);

  env.manager.on(`shardCreate`, shard => {
    log(`[SHARD ${shard.id}] New shard created!`, `info`);

    shard.on(`message`, (data = {}) => {
      switch (data.t) {
        case `LOG`:
          log(data.c.content, data.c.level, data.c.file, `[SHARD ${shard.id}]`);
          break;
        default:
          log(util.inspect(data)); // to the debugeon with you
      }
    });

    shard.on(`death`, p => {
      log(`[SHARD ${shard.id}] Process ended with exit code ${p.exitCode}`, `warn`);
    });
  });

  env.manager.spawn();
}

init();