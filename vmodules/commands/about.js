const djs = require(`discord.js`);
const memory = require(`../core/shard_memory.js`);
const Command = require(`../classes/command.js`);
const log = require(`../util/logger.js`).write;

const metadata = {
  name: `about`,
  description: {
    short: `A quick introduction to Vector.`,
    long: `Provides a quick introduction to Vector.`
  },
  dm: true,
  perm: `SEND_MESSAGES`,
  run: null,
};

metadata.run = async (m) => {
  return m.channel.send(`response`);
};

module.exports = new Command(metadata);