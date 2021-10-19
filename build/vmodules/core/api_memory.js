"use strict";
/**
 * VECTOR :: API MEMORY CORE
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_promises_1 = __importDefault(require("nedb-promises"));
exports.default = {
    app: null,
    server: null,
    cfg: null,
    db: {
        records: nedb_promises_1.default.create({ filename: `./data/records.db`, autoload: true }),
        guildcfgs: nedb_promises_1.default.create({ filename: `./data/guildcfgs.db`, autoload: true })
    }
};
