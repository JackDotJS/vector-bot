/**
 * VECTOR :: API MEMORY CORE
 */

import db from 'nedb-promises';

export default {
  app: null,
  server: null,
  cfg: null,
  db: {
    records: db.create({ filename: `./data/records.db`, autoload: true }),
    guildcfgs: db.create({ filename: `./data/guildcfgs.db`, autoload: true })
  }
};