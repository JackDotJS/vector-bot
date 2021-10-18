/**
 * VECTOR :: CUSTOM LOGGER
 */

import chalk from 'chalk';
import util from 'util';

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

const opts = {
  onlywrite: false,
  debug: false,
  stream: null
};

exports.opts = opts;

exports.write = (content, level, file, prefix = ``) => {
  if (process.send && !opts.onlywrite) {
    if (file == null) {
      const result = getSrc(new Error().stack);

      if (result) file = result;
    }

    return process.send({
      t: `LOG`,
      c: {
        content,
        level,
        file,
        prefix
      }
    });
  }

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
    const result = getSrc(new Error().stack);

    if (result) file_path.content = result;
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
        if (!opts.debug) return;
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
  const plain2 = (prefix.trim() + ` ` + message.content.replace(/\n/g, `\n${(` `.repeat(plain1.length))}`)).trim() + `\n`;

  const terminal1 = [
    timestamp.color(`[${timestamp.content}]`),
    file_path.color(`[${file_path.content}]`),
    log_level.color(`[${log_level.content}]`),
    `: `
  ].join(` `);
  const terminal2 = message.color((prefix.trim() + ` ` + message.content.replace(/\n/g, `\n${(` `.repeat(plain1.length))}`)).trim());

  console.log(terminal1 + terminal2);
  if (opts.stream) opts.stream.write(plain1 + plain2);
};