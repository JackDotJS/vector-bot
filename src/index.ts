import * as fs from 'fs';
import * as pkg from '../package.json';


process.title = `Vector Bot ${pkg.version}`;

// create directories that may or may not exist because Git(TM)
const mkdirs = [
  `./.local`,
  `./data`,
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