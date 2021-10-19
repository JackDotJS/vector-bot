"use strict";
/**
 * VECTOR :: COMMAND MANAGER
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const shard_memory_js_1 = __importDefault(require("../core/shard_memory.js"));
const log = require('../util/logger.js').write;
const deep_merge_js_1 = __importDefault(require("../util/deep_merge.js"));
class LocaleManager {
    constructor() {
        throw new Error(`Why are you doing this? (Cannot instantiate this class.)`);
    }
    static async load() {
        const bot = shard_memory_js_1.default.client;
        shard_memory_js_1.default.lang.index = [];
        for (const file of fs_1.default.readdirSync(`./locale/`, { withFileTypes: true })) {
            try {
                if (file == null || !file.isFile() || !file.name.toLowerCase().endsWith(`.json`))
                    continue;
                const pathinfo = path_1.default.parse(`../../locale/${file.name}`);
                const fulldir = path_1.default.resolve(`./locale/${file.name}`);
                delete require.cache[fulldir]; // forces Node to read the file from disk rather than cache
                const index = require(fulldir);
                const set = {
                    name: pathinfo.name,
                    phrases: index
                };
                shard_memory_js_1.default.lang.index.push(set);
                log(`Loaded language index "${file.name}"`);
                if (pathinfo.name === bot.cfg.default_lang) {
                    shard_memory_js_1.default.lang.default = set;
                    log(`Default language index "${file.name}" set.`);
                }
            }
            catch (err) {
                log(`Could not load language index "${file.name}" \n${err.stack}`, `error`);
            }
        }
        log(`Successfully loaded ${shard_memory_js_1.default.lang.index.length} language(s)!`, `info`);
        return shard_memory_js_1.default.lang.index;
    }
    static text(query, lang, ...opts) {
        const defaultstr = `locale_text_error`;
        if (query == null || typeof query != `string` || query.length === 0)
            return defaultstr;
        query = query.toLowerCase();
        // find selected language
        let selectLang = null;
        for (const langidx of shard_memory_js_1.default.lang.index) {
            if (lang === langidx.name)
                selectLang = langidx;
        }
        // if language doesn't exist, use default
        if (selectLang == null)
            selectLang = shard_memory_js_1.default.lang.default;
        // if not default, merge language with default
        if (selectLang.name !== shard_memory_js_1.default.lang.default.name)
            selectLang = (0, deep_merge_js_1.default)(shard_memory_js_1.default.lang.default, selectLang);
        // we only need the phrases from this point forward
        selectLang = selectLang.phrases;
        // converts query to usable dot notation and parse each key sequentially
        let str = query.toLowerCase().split(`.`).reduce((p, c) => p ? p[c] : null, selectLang);
        // check if phrase exists
        if (str == null)
            return defaultstr;
        // replace variable string elements
        for (const i in opts) {
            str = str.replace(new RegExp(`%%${i}%%`, `gm`), opts[i]);
        }
        return str;
    }
}
exports.default = LocaleManager;
;
