import { Guild } from 'discord.js';
import { write as log } from '../util/logger';

export const name = `guildUnavailable`;
export const run = (guild: Guild) => {
  log([
    `Guild Unavailable!`,
    `Unable to connect to "${guild.name}"`,
    `Guild ID: ${guild.id}`
  ].join(`\n`), `warn`);
};