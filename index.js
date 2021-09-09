/**
 * VECTOR :: SETUP MANAGER
 */

const readline = require(`readline`);
const mem = require(`./vmodules/core/memory.js`);
const pkg = require(`./package.json`);

process.title = `Vector Bot ${pkg.version}`;

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// theres probably a better way to do this

(function q1() {
  console.clear();

  cli.question(`START VECTOR [Y/N]`, (res) => {
    if (res.trim().toLowerCase() === `y`) return q2();
    if (res.trim().toLowerCase() === `n`) return process.exit();
    q1();
  });
})();

function q2() {
  console.clear();

  console.log([
    `Debug mode enables "DEBUG" level log messages and places the bot into a "development mode", which only allows input from whitelisted users.`,
    ``
  ].join(`\n`));

  cli.question(`ENABLE DEBUG MODE [Y/N]`, (res) => {
    if (res.trim().toLowerCase() === `y`) {
      mem.debug = true;
      return start();
    }
    if (res.trim().toLowerCase() === `n`) return start();
    q2();
  });
}

function start() {
  require(`./vmodules/core/boot.js`);
}