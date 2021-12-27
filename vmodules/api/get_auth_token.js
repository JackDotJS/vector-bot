const path = require(`path`);
const fs = require(`fs`);
const keys = require(`../../cfg/keys.json`);
const memory = require(`../core/api_memory.js`);
const wait = require(`../util/wait.js`);
const log = require(`../util/logger.js`).write;
const cryptr = require(`cryptr`);

const hasher = new cryptr(keys.authsecret);

const handler = {
  route: `/auth/create`,
  method: `GET`,
  run: null
};

handler.run = async (req, res) => {
  const token = hasher.encrypt(JSON.stringify({
    guild: req.query.guild,
    time: Date.now()
  }));

  res.status(200).json({ token });
};

module.exports = handler;