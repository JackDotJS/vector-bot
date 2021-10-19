import { Guild } from 'discord.js';
import { write as log } from '../util/logger';

export const name = `guildUpdate`;
export const run = (oldg: Guild, newg: Guild) => {
  if (oldg.available && newg.available) return;
  log([
    `Guild Available!`,
    `"${newg.name}" has recovered.`,
    `Guild ID: ${newg.id}`
  ].join(`\n`), `warn`);
};