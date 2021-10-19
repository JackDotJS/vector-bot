import { write as log } from '../util/logger';
import Vector from '../classes/client';

export const name =  `ready`;
export const run = (client: Vector) => {
  log(`Successfully connected to Discord API.`, `info`);
  log(`This shard is handling ${client.guilds.cache.size} guild(s)!`, `info`);
};