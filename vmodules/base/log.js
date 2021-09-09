/**
 * VECTOR :: CUSTOM LOGGER
 */

const chalk = require(`chalk`);

module.log = (content, level, file) => {
  const now = new Date();
  const hh = now.getUTCHours().toString().padStart(2, `0`);
  const mm = now.getUTCMinutes().toString().padStart(2, `0`);
  const ss = now.getUTCSeconds().toString().padStart(2, `0`);
  const ms = now.getUTCMilliseconds().toString().padStart(3, `0`);

  const timestamp = {
    color: chalk.white,
    content: `${hh}:${mm}:${ss}.${ms}`
  };

  const filename = {
    color: chalk.yellow,
    content: `N/A`
  };
};