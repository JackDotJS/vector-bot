"use strict";
/**
 * VECTOR :: SHARD MEMORY CORE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const shardMemory = {
    client: null,
    commands: [],
    lang: {
        default: null,
        index: []
    },
    assets_cache: []
};
exports.default = shardMemory;
