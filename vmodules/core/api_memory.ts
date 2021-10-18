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
    guildcfgs: db.create({ filename: `./data/guildcfgs.db`, autoload: true })
  }
};