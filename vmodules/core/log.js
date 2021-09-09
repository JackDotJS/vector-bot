/**
 * VECTOR :: CUSTOM LOGGER
 */

const chalk = require(`chalk`);
const util = require(`util`);
const mem = require(`./memory.js`);

module.exports = (content, level, file) => {
  const now = new Date();
  const hh = now.getUTCHours().toString().padStart(2, `0`);
  const mm = now.getUTCMinutes().toString().padStart(2, `0`);
  const ss = now.getUTCSeconds().toString().padStart(2, `0`);
  const ms = now.getUTCMilliseconds().toString().padStart(3, `0`);

  const timestamp = {
    color: chalk.white,
    content: `${hh}:${mm}:${ss}.${ms}`
  };

  const file_path = {
    color: chalk.yellow,
    content: file
  };

  const log_level = {
    color: chalk.magenta,
    content: `DEBUG`
  };

  const message = {
    content,
    color: chalk.white
  };

  if (file == null) {
    const trace = new Error().stack;
    const match = trace.split(`\n`)[2].match(/(?<=at\s|\()([^(]*):(\d+):(\d+)\)?$/);

    if (match != null && match.length >= 4) {
      const file_name = match[1].replace(process.cwd(), `.`).replace(/\\/g, `/`);
      const line = match[2];
      const column = match[3];

      file_path.content = `${file_name}:${line}:${column}`;
    }
  }

  if (typeof level === `string`) {
    if ([`fatal`, `error`, `warn`, `info`].includes(level.toLowerCase())) {
      log_level.content = level.toUpperCase();
    }

    switch (level.toLowerCase()) {
      case `fatal`:
        log_level.color = chalk.inverse.bgRedBright;
        message.color = chalk.redBright;
        break;
      case `error`:
        log_level.color = chalk.red;
        message.color = chalk.red;
        break;
      case `warn`:
        log_level.color = chalk.yellowBright;
        message.color = chalk.yellowBright;
        break;
      case `info`:
        log_level.color = chalk.white;
        message.color = chalk.whiteBright;
        break;
      default:
        if (!mem.debug) return;
    }
  }

  if (typeof content !== `string`) {
    message.color = chalk.yellowBright;
    if (content instanceof Error) {
      message.content = content.stack;
    } else if (Buffer.isBuffer(content)) {
      message.content = content.toString();
    } else {
      message.content = util.inspect(content, { getters: true, showHidden: true });
    }
  }

  const plain1 = `[${timestamp.content}] [${file_path.content}] [${log_level.content}] : `;
  const plain2 = message.content.replace(/\n/g, `\n${(` `.repeat(plain1.length))}`) + `\n`;

  const terminal1 = [
    timestamp.color(`[${timestamp.content}]`),
    file_path.color(`[${file_path.content}]`),
    log_level.color(`[${log_level.content}]`),
    `: `
  ].join(` `);
  const terminal2 = message.color(message.content.replace(/\n/g, `\n${(` `.repeat(plain1.length))}`));

  console.log(terminal1 + terminal2);
  if (mem.log.stream) mem.log.stream.write(plain1 + plain2);
};