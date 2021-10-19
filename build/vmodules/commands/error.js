"use strict";
const djs = require(`discord.js`);
const memory = require(`../core/shard_memory.js`);
const Command = require(`../classes/command.js`);
const log = require(`../util/logger.js`).write;
const metadata = {
    name: `error`,
    dm: true,
    perm: `SEND_MESSAGES`,
    guilds: [`627527422312710154`],
    run: null,
};
metadata.run = async () => {
    throw new Error(`ErrorTest`);
};
module.exports = new Command(metadata);
