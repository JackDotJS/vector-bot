/**
 * VECTOR :: INITIALIZATION SCRIPT
 */

import * as fs from 'fs';
import * as util from 'util';
import * as pkg from '../package.json';
import * as cfg from '../config/bot.json';

process.title = `Vector Bot ${pkg.version}`;

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

// check login count, to prevent API spam in the case of a boot loop

try {
  // try making file if it does not exist
  const data = {
    logins: 1,
    time: new Date().getTime()
  };

  fs.writeFileSync(`./data/resets`, JSON.stringify(data), { encoding: `utf8`, flag: `ax` });
}

catch (e: any) {
  if (e.code !== `EEXIST`) {
    throw e;
  }

  const oldData = fs.readFileSync(`./data/resets`, { encoding: `utf8` });

  let json = {
    logins: 0,
    time: 0
  };

  try {
    // attempt to parse as JSON.
    // if the data is corrupt or otherwise invalid, we'll simply overwrite it with some default values.
    json = JSON.parse(oldData);

    console.log(`filedata successful read`);
  }
  catch (je) {}

  // if it's been more than an hour, reset the login count
  const now = new Date().getTime();
  if (now - json.time > (1000 * 60 * 60)) {
    json.logins = 0;
    json.time = now;
  }

  json.logins++;

  logins = json.logins;

  console.log(`login count: ${json.logins}`);
  
  fs.writeFileSync(`./data/resets`, JSON.stringify(json), { encoding: `utf8` });
}

if (logins > cfg.loginLimit.warning) {
  console.log(`warning: lots of resets`);
}

if (logins > cfg.loginLimit.shutdown) {
  console.log(`error: too many resets`);
  process.exit(1);
}

// we did it reddit
console.log(`:)`);