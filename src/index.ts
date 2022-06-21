import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
// import * as util from 'util';
import { version } from '../package.json';
import isInterface from './util/isInterface';

process.title = `Vector Bot ${version}`;

// create directories that may or may not exist because Git(TM)
const mkdirs = [
  `./.local`,
  `./data/archive`,
  `./logs/crash`,
  `./logs/archive`,
  `./logs/all`
];

for (const item of mkdirs) {
  if (!existsSync(item)) {
    mkdirSync(item, { recursive: true });
  }
}

interface ErrorWithCode extends Error {
  code?: string
}

try {
  // try making file if it does not exist
  const data = {
    logins: 1,
    time: new Date().getTime()
  };

  writeFileSync(`./data/resets`, JSON.stringify(data), { encoding: `utf8`, flag: `ax` });
} catch (e: unknown) {

  if (isInterface<ErrorWithCode>(e, `code`)) {
    if (e.code !== `EEXIST`) {
      throw e;
    }
  }

  const oldData = readFileSync(`./data/resets`, { encoding: `utf8` });

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
  catch (je) { 
    console.warn(`JSON data was invalid or corrupted. Overwriting with default values...`);
  }

  // if it's been more than an hour, reset the login count
  const now = new Date().getTime();
  if (now - json.time > (1000 * 60 * 60)) {
    json.logins = 0;
    json.time = now;
  }

  json.logins++;

  console.log(`login count: ${json.logins}`);
  
  writeFileSync(`./data/resets`, JSON.stringify(json), { encoding: `utf8` });
}

// we did it reddit
console.log(`:)`);