"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handler = {
    route: `/assets/icons`,
    method: `GET`,
    run: null
};
handler.run = async (req, res) => {
    const query = req.query.name;
    for (const file of fs_1.default.readdirSync(`./assets/icons`, { withFileTypes: true })) {
        if (file == null || !file.isFile())
            continue;
        const rp = `./assets/icons/${file.name}`;
        const pathinfo = path_1.default.parse(rp);
        if (pathinfo.name !== query)
            continue;
        return res.status(200).json({
            path: path_1.default.resolve(rp),
            buffer: fs_1.default.readFileSync(rp)
        });
    }
    res.status(404).json({
        message: `Could not find specified file.`
    });
};
module.exports = handler;
