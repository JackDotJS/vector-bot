"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const shard_memory_1 = __importDefault(require("../core/shard_memory"));
const bot_config_1 = __importDefault(require("../util/bot_config"));
const logger_1 = require("../util/logger");
class Vector extends discord_js_1.default.Client {
    constructor(djs_opts, options = {}) {
        super(djs_opts);
        this.keys = require(`../../cfg/keys.json`);
        this.log = logger_1.write;
        this.cfg = (0, bot_config_1.default)(options.debug);
        this.debug = options.debug;
        this.booting = true;
        this.version = require(`../../package.json`).version;
        this.managers = {
            assets: require(`../managers/asset_manager.js`),
            locale: require(`../managers/locale_manager.js`),
            commands: require(`../managers/command_manager.js`),
            configs: require(`../managers/config_manager.js`)
        };
        shard_memory_1.default.client = this;
        this.managers.commands.load();
        this.managers.locale.load();
        (0, logger_1.write)(`client instance ready`);
        // will be adding more stuff here later
        // dont worry, this property isnt completely pointless
        this.booting = false;
    }
    exit(code = 0) {
        this.destroy();
        process.exit(code);
    }
}
exports.default = Vector;
;
