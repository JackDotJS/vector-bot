/**
 * VECTOR :: BOOT MANAGER
 */

console.clear();

const child = require(`child_process`);
const readline = require(`readline`);
const fs = require(`fs`);
const util = require(`util`);
const AZip = require(`adm-zip`);
const pkg = require(`../../package.json`);

const log = require(`./log.js`);

process.title = `Vector Bot ${pkg.version} | Initializing...`;

const opts = {
  debug: false,
  log: {
    stream: null,
    filename: null,
  },
  recovery: {
    log: null
  }
};

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

  init();
};

function init() {
}