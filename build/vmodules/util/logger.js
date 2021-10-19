"use strict";
/**
 * VECTOR :: CUSTOM LOGGER
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.opts = void 0;
const chalk_1 = __importDefault(require("chalk"));
const util_1 = __importDefault(require("util"));
function getSrc(trace) {
    const match = trace.split(`\n`)[2].match(/(?<=at\s|\()([^(]*):(\d+):(\d+)\)?$/);
    if (match != null && match.length >= 4) {
        const file_name = match[1].replace(process.cwd(), `.`).replace(/\\/g, `/`);
        const line = match[2];
        const column = match[3];
        return `${file_name}:${line}:${column}`;
    }
    return;
}
exports.opts = {
    onlywrite: false,
    debug: false,
    stream: null
};
function write(content, level, file, prefix = ``) {
    if (process.send && !exports.opts.onlywrite) {
        if (file == null) {
            const result = getSrc(new Error().stack);
            if (result)
                file = result;
        }
        process.send({
            t: `LOG`,
            c: {
                content,
                level,
                file,
                prefix
            }
        });
        return;
    }
    const now = new Date();
    const hh = now.getUTCHours().toString().padStart(2, `0`);
    const mm = now.getUTCMinutes().toString().padStart(2, `0`);
    const ss = now.getUTCSeconds().toString().padStart(2, `0`);
    const ms = now.getUTCMilliseconds().toString().padStart(3, `0`);
    const timestamp = {
        color: chalk_1.default.white,
        content: `${hh}:${mm}:${ss}.${ms}`
    };
    const file_path = {
        color: chalk_1.default.yellow,
        content: file
    };
    const log_level = {
        color: chalk_1.default.magenta,
        content: `DEBUG`
    };
    const message = {
        content,
        color: chalk_1.default.white
    };
    if (file == null) {
        const result = getSrc(new Error().stack);
        if (result)
            file_path.content = result;
    }
    if (typeof level === `string`) {
        if ([`fatal`, `error`, `warn`, `info`].includes(level.toLowerCase())) {
            log_level.content = level.toUpperCase();
        }
        switch (level.toLowerCase()) {
            case `fatal`:
                log_level.color = chalk_1.default.inverse.bgRedBright;
                message.color = chalk_1.default.redBright;
                break;
            case `error`:
                log_level.color = chalk_1.default.red;
                message.color = chalk_1.default.red;
                break;
            case `warn`:
                log_level.color = chalk_1.default.yellowBright;
                message.color = chalk_1.default.yellowBright;
                break;
            case `info`:
                log_level.color = chalk_1.default.white;
                message.color = chalk_1.default.whiteBright;
                break;
            default:
                if (!exports.opts.debug)
                    return;
        }
    }
    if (typeof content !== `string`) {
        message.color = chalk_1.default.yellowBright;
        if (content instanceof Error) {
            message.content = content.stack;
        }
        else if (Buffer.isBuffer(content)) {
            message.content = content.toString();
        }
        else {
            message.content = util_1.default.inspect(content, { getters: true, showHidden: true });
        }
    }
    const plain1 = `[${timestamp.content}] [${file_path.content}] [${log_level.content}] : `;
    const plain2 = (prefix.trim() + ` ` + message.content.replace(/\n/g, `\n${(` `.repeat(plain1.length))}`)).trim() + `\n`;
    const terminal1 = [
        timestamp.color(`[${timestamp.content}]`),
        file_path.color(`[${file_path.content}]`),
        log_level.color(`[${log_level.content}]`),
        `: `
    ].join(` `);
    const terminal2 = message.color((prefix.trim() + ` ` + message.content.replace(/\n/g, `\n${(` `.repeat(plain1.length))}`)).trim());
    console.log(terminal1 + terminal2);
    if (exports.opts.stream)
        exports.opts.stream.write(plain1 + plain2);
}
exports.write = write;
;
