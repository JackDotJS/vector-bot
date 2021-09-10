/**
 * VECTOR :: SETUP MANAGER
 */

const child = require(`child_process`);
const fs = require(`fs`);
const readline = require(`readline`);
const pkg = require(`./package.json`);

const opts = {
  debug: false
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
      opts.debug = true;
      return start();
    }
    if (res.trim().toLowerCase() === `n`) return start();
    q2();
  });
}

function start() {
  cli.close();

  // this was only really done to pass options slightly easily
  // using a child process for this is probably immensely overkill
  // idk who cares lol
  const sm = child.spawn(`node`, [`vmodules/core/bootstrap.js`, JSON.stringify(opts)], {
    stdio: `inherit`
  });

  sm.on(`exit`, process.exit);
}