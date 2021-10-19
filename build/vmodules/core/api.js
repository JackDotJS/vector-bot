"use strict";
const util = require(`util`);
const fs = require(`fs`);
const express = require(`express`);
const helmet = require(`helmet`);
const cfg = require(`../util/bot_config.js`)(process.argv[2] === `true`);
const keys = require(`../../cfg/keys.json`);
const log = require(`../util/logger.js`).write;
const memory = require(`./api_memory.js`);
const app = express();
let server = null;
app.use(helmet());
app.use(express.json());
// save to memory
memory.cfg = cfg;
memory.app = app;
memory.server = server;
// default route act as status check
app.get(`/`, (req, res) => {
    res.status(200).json({ message: `we fresh asf` });
});
// load api routes
for (const file of fs.readdirSync(`./vmodules/api/`)) {
    const route = require(`../api/${file}`);
    log(util.inspect(route));
    const params = [route.route, (req, res) => {
            log(`${route.method} ${route.route}`);
            // this probably isn't 100% secure but it's better than leaving everything completely open.
            // ...probably
            if (req.query.key !== keys.db) {
                // pretend it doesnt exist lol
                return res.status(404).json({ message: `wtf are u looking for` });
            }
            return route.run(req, res);
        }];
    switch (route.method) {
        case `GET`:
            app.get(...params);
            break;
        case `POST`:
            app.post(...params);
            break;
        case `PUT`:
            app.put(...params);
            break;
        case `PATCH`:
            app.patch(...params);
            break;
        case `DELETE`:
            app.delete(...params);
            break;
        default:
            throw new TypeError(`Unknown HTTP Method: ${route.method}`);
    }
    log(`Loaded route handler from ${file}`);
}
// open server
server = app.listen(cfg.api.port, () => {
    log(`Server started on port ${cfg.api.port}`, `info`);
});
// unknown routes
app.use((req, res) => {
    res.status(404).json({ message: `wtf are u looking for` });
});
// handle errors
app.use((err, req, res, next) => {
    log(err.stack);
    res.status(500).json({ message: err.stack });
});
process.on(`message`, (data) => {
    if (data == null || data.constructor !== Object || data.t == null) {
        return log(util.inspect(data)); // to the debugeon with you
    }
    switch (data.t) {
        case `STOP`:
            server.close(() => {
                log(`Server closed.`, `info`);
                process.exit();
            });
            break;
        default:
            log(util.inspect(data)); // to the debugeon with you... again
    }
});
