/**
 * VECTOR :: SHARD MEMORY CORE
 */

import Vector from '../classes/client';
import Command from '../classes/command';

export interface ShardMemory {
  client: Vector | null,
  commands: Command[] | null,
  lang: {
    default: {
      name: string,
      phrases: object // lang file that is too large to possibly fit into an interface. just pray.
    },
    index: {
      name: string,
      phrases: object // lang file that is too large to possibly fit into an interface. just pray.
    }[]
  },
  assets_cache: []
}

const shardMemory: ShardMemory = {
  client: null,
  commands: [],
  lang: {
    default: null,
    index: []
  },
  assets_cache: []
}

export default shardMemory;