import { Interaction } from 'discord.js';
import { write as log } from '../util/logger';

export const name = `interactionCreate`;
export const run = (int: Interaction) => {
  log(`interaction received`);
  log(int);
};