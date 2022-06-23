import { Client, Intents } from 'discord.js';
import Logger from './util/logger';
import keys from '../cfg/keys.json';

export const logger = new Logger();

// const debugMode = process.argv.includes(`--debug`) || process.argv.includes(`-d`);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
});

client.login(keys.discord)
  .then(() => {
    logger.verbose(client.shard?.ids);
    logger.log(`Successfully logged in as ${client.user?.tag}! Shard: [${client.shard?.ids.map(s => s + 1).join(`, `)}/${client.shard?.count}]`);
  })
  .catch(error => {
    logger.fatal(`Unexpected error when logging into Discord:\n${error}`);
    process.exit(1);
  });