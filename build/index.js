"use strict";
/**
 * VECTOR :: SETUP MANAGER
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const readline_1 = __importDefault(require("readline"));
const package_json_1 = __importDefault(require("./package.json"));
const logger_1 = require("./vmodules/util/logger");
// ensures bot doesnt end up in a boot loop
const resetcheck = {
    resets: 0,
    hour: 0,
    check: setInterval(() => {
        const now = new Date().getHours();
        if (now !== resetcheck.hour) {
            resetcheck.resets = 0;
            resetcheck.hour = now;
        }
    }, 1000)
};
const opts = {
    debug: false,
    crashlog: null,
    log: {
        filename: null,
        stream: null
    }
};
process.title = `Vector Bot ${package_json_1.default.version}`;
// make some required directories
const mkdirs = [
    `./.local`,
    `./data`,
    `./data/archive`,
    `./logs/crash`,
    `./logs/archive`,
    `./logs/all`
];
for (const item of mkdirs) {
    if (!fs_1.default.existsSync(item)) {
        fs_1.default.mkdirSync(item, { recursive: true });
    }
}
// setup questions
const cli = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const setup_qs = [];
// TODO: change Function type to Promise.resolve/reject
setup_qs.push((resolve, reject) => {
    cli.question(`START VECTOR [Y/N]`, (res) => {
        if (res.trim().toLowerCase() === `y`)
            return resolve();
        if (res.trim().toLowerCase() === `n`)
            return process.exit();
        reject();
    });
});
// TODO: change Function type to Promise.resolve/reject
setup_qs.push((resolve, reject) => {
    console.log([
        `Debug mode enables "DEBUG" level log messages and places the bot into a "development mode", which only allows input from whitelisted users.`,
        ``
    ].join(`\n`));
    cli.question(`ENABLE DEBUG MODE [Y/N]`, (res) => {
        if (res.trim().toLowerCase() === `y`) {
            opts.debug = true;
            return resolve();
        }
        if (res.trim().toLowerCase() === `n`)
            return start();
        reject();
    });
});
(async function setup() {
    for (let i = 0; i < setup_qs.length; null) {
        console.clear();
        try {
            await new Promise(setup_qs[i]);
            i++;
        }
        catch (err) {
            // damn bro that sucks
        }
    }
    cli.close();
    start();
})();
// app head
function start() {
    opts.log.filename = new Date().toUTCString().replace(/[/\\?%*:|"<>]/g, `.`);
    opts.log.stream = fs_1.default.createWriteStream(`./logs/all/${opts.log.filename}.log`);
    const cfg = require(`./vmodules/util/bot_config.js`)(opts.debug);
    if (!opts.debug) {
        // if the bot has restarted more than x times within the past hour, print a warning.
        if (resetcheck.resets >= cfg.resetcheck.min_reset_warning) {
            (0, logger_1.write)(`[SETUP]: Unusually high client reset count: ${resetcheck.resets}`, `warn`);
        }
        // if the bot has restarted more than x times within the past hour, stop.
        if (resetcheck.resets >= cfg.resetcheck.max_resets_per_hour) {
            (0, logger_1.write)(`[SETUP]: Potential boot loop detected, shutting down for safety.`, `warn`);
            return exit(18);
        }
    }
    const sm = child_process_1.default.spawn(`node`, [`vmodules/core/bootstrap.js`, JSON.stringify(opts)], {
        stdio: [`pipe`, `pipe`, `pipe`, `ipc`]
    });
    sm.on(`error`, err => {
        (0, logger_1.write)(err.stack, `fatal`);
    });
    sm.stdout.setEncoding(`utf8`);
    sm.stderr.setEncoding(`utf8`);
    sm.stdout.on(`data`, (data) => {
        (0, logger_1.write)(data);
    });
    sm.stderr.on(`data`, (data) => {
        (0, logger_1.write)(data, `error`);
    });
    sm.on(`message`, (data) => {
        switch (data.t) {
            case `LOG`:
                (0, logger_1.write)(data.c.content, data.c.level, data.c.file, data.c.prefix);
                break;
            default:
                (0, logger_1.write)(util_1.default.inspect(data)); // to the debugeon with you
        }
    });
    sm.on(`close`, exit);
}
function exit(code) {
    resetcheck.resets++;
    let exit = true;
    let timeout = 500;
    let report = true;
    switch (code) {
        case 0:
            (0, logger_1.write)(`Vector is now shutting down at user request.`, `info`);
            report = false;
            break;
        case 1:
            (0, logger_1.write)(`Vector seems to have crashed. Restarting...`, `info`);
            exit = false;
            if (opts.debug)
                timeout = 5000;
            break;
        case 2:
            (0, logger_1.write)(`Bash Error.`, `fatal`);
            break;
        case 3:
            (0, logger_1.write)(`Internal JavaScript parse error.`, `fatal`);
            break;
        case 4:
            (0, logger_1.write)(`Internal JavaScript Evaluation Failure.`, `fatal`);
            break;
        case 5:
            (0, logger_1.write)(`Fatal Error.`, `fatal`);
            break;
        case 6:
            (0, logger_1.write)(`Non-function Internal Exception Handler.`, `fatal`);
            break;
        case 7:
            (0, logger_1.write)(`Internal Exception Handler Run-Time Failure.`, `fatal`);
            break;
        case 8:
            (0, logger_1.write)(`Uncaught exception.`, `fatal`);
            break;
        case 9:
            (0, logger_1.write)(`Invalid Launch Argument(s).`, `fatal`);
            break;
        case 10:
            (0, logger_1.write)(`Internal JavaScript Run-Time Failure.`, `fatal`);
            break;
        case 12:
            (0, logger_1.write)(`Invalid Debug Argument(s).`, `fatal`);
            break;
        case 16:
            (0, logger_1.write)(`Vector is now restarting at user request...`, `info`);
            exit = false;
            report = false;
            break;
        case 17:
            (0, logger_1.write)(`Vector is now undergoing scheduled restart.`, `info`);
            exit = false;
            report = false;
            break;
        case 18:
            (0, logger_1.write)(`Vector is shutting down automatically.`, `fatal`);
            break;
    }
    if (code > 128)
        (0, logger_1.write)(`Signal exit code ${code - 128}.`, `fatal`);
    opts.log.stream.close();
    if (report) {
        opts.crashlog = `./logs/crash/${path_1.default.basename(opts.log.stream.path.toString())}`;
        fs_1.default.copyFileSync(opts.log.stream.path, opts.crashlog);
    }
    else {
        opts.crashlog = null;
    }
    setTimeout(() => {
        if (exit) {
            return process.exit(code);
        }
        start();
    }, timeout);
}
