"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_json_1 = __importDefault(require("../../cfg/bot.json"));
const bot_debug_json_1 = __importDefault(require("../../cfg/bot_debug.json"));
const deep_merge_1 = __importDefault(require("../util/deep_merge"));
function botConfig(debug) {
    if (debug) {
        // if bot is running in debug mode, load debug config and overwrite main cfg properties.
        // this means the main config is used as a base, and the debug config only needs to specify
        // properties that need to be changed.
        return (0, deep_merge_1.default)(bot_json_1.default, bot_debug_json_1.default);
    }
    return bot_json_1.default;
}
exports.default = botConfig;
;
