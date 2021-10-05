/**
 * VECTOR :: API MEMORY CORE
 */

const db = require(`nedb-promises`);

module.exports = {
  app: null,
  server: null,
  cfg: null,
  db: {
    records: db.create({ filename: `./data/records.db`, autoload: true }),
    guildcfg: db.create({ filename: `./data/guildcfg.db`, autoload: true })
  }
};