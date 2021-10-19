"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_memory_1 = __importDefault(require("../core/api_memory"));
const handler = {
    route: `/guildcfg`,
    method: `GET`,
    run: null
};
handler.run = async (req, res) => {
    const gid = req.query.guild;
    const doc = await api_memory_1.default.db.guildcfgs.findOne({ _id: gid });
    res.status(200).json({ doc: doc });
};
module.exports = handler;
