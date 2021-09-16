/**
 * VECTOR :: SETUP MANAGER
 */

const child = require(`child_process`);
const fs = require(`fs`);
const path = require(`path`);
const util = require(`util`);
const readline = require(`readline`);
const AZip = require(`adm-zip`); // will be using this later
const pkg = require(`./package.json`);
const logger = require(`./vmodules/util/logger.js`);
const log = logger.write;

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
  crashlog: null,
  log: {
    filename: null,
    stream: null
  }
};

process.title = `Vector Bot ${pkg.version}`;

// make some required directories

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

// setup questions

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// app head

function start() {
  opts.log.filename = new Date().toUTCString().replace(/[/\\?%*:|"<>]/g, `.`);
  opts.log.stream = fs.createWriteStream(`./logs/all/${opts.log.filename}.log`);

  logger.opts.debug = opts.debug;
  logger.opts.stream = opts.log.stream;

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
    stdio: [`pipe`,`pipe`,`pipe`,`ipc`]
  });

  sm.stdout.setEncoding(`utf8`);
  sm.stderr.setEncoding(`utf8`);

  sm.stdout.on(`data`, (data) => {
    log(data);
  });

  sm.stderr.on(`data`, (data) => {
    log(data, `error`);
  });

  sm.on(`message`, (data = {}) => {
    switch (data.t) {
      case `LOG`:
        log(data.c.content, data.c.level, data.c.file);
        break;
      default:
        log(util.inspect(data)); // to the debugeon with you
    }
  });

  sm.on(`error`, err => {
    log(err.stack, `fatal`);
  });

  sm.on(`close`, exit);
}

function exit(code) {
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

  opts.log.stream.close();

  if (report) {
    opts.crashlog = `./logs/crash/${path.basename(opts.log.stream.path)}`;
    fs.copyFileSync(opts.log.stream.path, opts.crashlog);
  } else {
    opts.crashlog = null;
  }

  setTimeout(() => {
    if (exit) {
      return process.exit(code);
    }

    start();
  }, timeout);
}