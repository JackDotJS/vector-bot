/**
 * VECTOR :: BOOT MANAGER
 */

const child = require(`child_process`);
const readline = require(`readline`);
const fs = require(`fs`);
const util = require(`util`);
const AZip = require(`adm-zip`);
const cfg = require(`../../cfg/bot.json`);
const pkg = require(`../../package.json`);
const opts = require(`./envopts.js`);
const log = require(`./log.js`);

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

// get launch options from setup manager before starting
module.exports = (data) => {
  opts.debug = data.debug;

  preinit();
};

function preinit() {
  console.clear();

  process.title = `Vector Bot ${pkg.version} | Initializing...`;

  opts.log.filename = new Date().toUTCString().replace(/[/\\?%*:|"<>]/g, `.`);
  opts.log.stream = fs.createWriteStream(`./logs/${opts.log.filename}.log`);

  // If the bot has restarted more than x times within the past hour, print a warning.
  if (resetcheck.resets >= cfg.resetcheck.minimum_reset_warn && !opts.debug) {
    log(`[PREINIT]: Unusually high client reset count: ${resetcheck.resets}`, `warn`);
  }

  // If the bot has restarted more than x times within the past hour, stop.
  if (resetcheck.resets >= cfg.resetcheck.max_resets_per_hour) {
    log(`[PREINIT]: Potential boot loop detected, shutting down for safety.`, `warn`);
    return exit(18);
  }
}

function exit(code) {
  resetcheck.resets++;
  opts.log.stream.end();

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
      const crashlog = `../../crashlogs/${opts.log.filename}.log`;

      fs.copyFileSync(`../../logs/${opts.log.filename}.log`, crashlog);

      opts.recovery.log = crashlog;
    }

    if (exit) {
      return process.exit(code);
    }

    preinit();
  }, timeout);
}