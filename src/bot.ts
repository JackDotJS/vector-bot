import { Client, Intents } from 'discord.js';
import Logger from './util/logger';

export const logger = new Logger();

const debugMode = process.argv.includes(`--debug`) || process.argv.includes(`-d`);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
});


