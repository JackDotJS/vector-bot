/**
 * VECTOR :: SETUP MANAGER
 */

const child = require(`child_process`);
const fs = require(`fs`);
const readline = require(`readline`);
const pkg = require(`./package.json`);
const log = require(`./vmodules/util/logger.js`).write;

// ensures bot doesnt end up in a boot loop
const resetcheck = {
  resets: 0,
  hour: 0,
  check: setInterval(() => {
    const now = new Date().getHours();
    if (now !== resetcheck.hour) {
      resetcheck.resets = 0;
      resetcheck.hour = now;
    }
  }, 1000)
};

const opts = {
  debug: false,
  recovered: false,
};

process.title = `Vector Bot ${pkg.version}`;

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const mkdirs = [
  `./.local`,
  `./data`,
  `./logs/crash`,
  `./logs/archive`,
  `./logs/all`
];

for (const item of mkdirs) {
  if (!fs.existsSync(item)) {
    fs.mkdirSync(item, { recursive: true });
  }
}

const setup_qs = [];

setup_qs.push((resolve, reject) => {
  cli.question(`START VECTOR [Y/N]`, (res) => {
    if (res.trim().toLowerCase() === `y`) return resolve();
    if (res.trim().toLowerCase() === `n`) return process.exit();
    reject();
  });
});

setup_qs.push((resolve, reject) => {
  console.log([
    `Debug mode enables "DEBUG" level log messages and places the bot into a "development mode", which only allows input from whitelisted users.`,
    ``
  ].join(`\n`));

  cli.question(`ENABLE DEBUG MODE [Y/N]`, (res) => {
    if (res.trim().toLowerCase() === `y`) {
      opts.debug = true;
      return resolve();
    }
    if (res.trim().toLowerCase() === `n`) return start();
    reject();
  });
});

(async function setup() {
  for (let i = 0; i < setup_qs.length; null) {
    console.clear();
    try {
      await new Promise(setup_qs[i]);
      i++;
    }
    catch (err) {
      // damn bro that sucks
    }
  }

  cli.close();
  start();
})();

function start() {
  const cfg = require(`./vmodules/util/bot_config.js`)(opts.debug);

  if (!opts.debug) {
    // if the bot has restarted more than x times within the past hour, print a warning.
    if (resetcheck.resets >= cfg.resetcheck.min_reset_warning) {
      log(`[SETUP]: Unusually high client reset count: ${resetcheck.resets}`, `warn`);
    }

    // if the bot has restarted more than x times within the past hour, stop.
    if (resetcheck.resets >= cfg.resetcheck.max_resets_per_hour) {
      log(`[SETUP]: Potential boot loop detected, shutting down for safety.`, `warn`);
      return exit(18);
    }
  }

  const sm = child.spawn(`node`, [`vmodules/core/bootstrap.js`, JSON.stringify(opts)], {
    stdio: `inherit`
  });

  sm.on(`exit`, exit);
}

function exit(code) {
  // env.api.send({ t: `STOP` }, (err) => {
  //   if (err) log(`Failed to send payload to API subprocess: ${err.stack}`, `error`);
  // });

  resetcheck.resets++;

  let exit = true;
  let timeout = 500;
  let report = true;

  switch (code) {
    case 0:
      log(`Vector is now shutting down at user request.`, `info`);
      report = false;
      break;
    case 1:
      log(`Vector seems to have crashed. Restarting...`, `info`);
      exit = false;
      if (opts.debug) timeout = 5000;
      break;
    case 2:
      log(`Bash Error.`, `fatal`);
      break;
    case 3:
      log(`Internal JavaScript parse error.`, `fatal`);
      break;
    case 4:
      log(`Internal JavaScript Evaluation Failure.`, `fatal`);
      break;
    case 5:
      log(`Fatal Error.`, `fatal`);
      break;
    case 6:
      log(`Non-function Internal Exception Handler.`, `fatal`);
      break;
    case 7:
      log(`Internal Exception Handler Run-Time Failure.`, `fatal`);
      break;
    case 8:
      log(`Uncaught exception.`, `fatal`);
      break;
    case 9:
      log(`Invalid Launch Argument(s).`, `fatal`);
      break;
    case 10:
      log(`Internal JavaScript Run-Time Failure.`, `fatal`);
      break;
    case 12:
      log(`Invalid Debug Argument(s).`, `fatal`);
      break;
    case 16:
      log(`Vector is now restarting at user request...`, `info`);
      exit = false;
      report = false;
      break;
    case 17:
      log(`Vector is now undergoing scheduled restart.`, `info`);
      exit = false;
      report = false;
      break;
    case 18:
      log(`Vector is shutting down automatically.`, `fatal`);
      break;
  }

  if (code > 128) log(`Signal exit code ${code - 128}.`, `fatal`);

  setTimeout(() => {
    if (report) {
      opts.recovered = true;
    }

    if (exit) {
      return process.exit(code);
    }

    start();
  }, timeout);
}