const util = require(`util`);
const express = require(`express`);
const helmet = require(`helmet`);
const cfg = require(`../../cfg/bot.json`);
const log = require(`../util/logger.js`).write;

const app = express();

let server = null;

app.use(helmet());
app.use(express.json());

if (process.argv[2] === `true`) {
  const dcfg = require(`../../cfg/bot_debug.json`);
  Object.assign(cfg, dcfg);
}

// default routes act as status check
app.get(`/`, (req, res) => {
  res.status(200).json({ message: `we fresh asf` });
});
app.use((req, res) => {
  res.status(200).json({ message: `we fresh asf` });
});

// open server
server = app.listen(cfg.api.port, () => {
  log(`Server started on port ${cfg.api.port}`, `info`);
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

  switch(data.t) {
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