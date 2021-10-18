const util = require(`util`);
const path = require(`path`);
const djs = require(`discord.js`);
const wink = require(`jaro-winkler`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

exports.name = `messageCreate`;
exports.run = async (message) => {
  const bot = memory.client;

  // not ready to work
  if (bot.booting) return;
  // not a message we can/should process.
  if (message.author.bot || message.author.system || message.system || message.type !== `DEFAULT`) return;
  // bot is in debug mode and the message author is not whitelisted
  if (bot.debug && ![bot.cfg.dev.discord_user_id, ...bot.cfg.dev.user_whitelist].includes(message.author.id)) return;

  if (message.channel.type === `DM`) {
    // can't use locale in DM since there's no access to guild configs
    const embed = new djs.MessageEmbed()
      .setAuthor(`Vector`, await bot.managers.assets.getIcon(`info`, bot.cfg.colors.default))
      .setTitle(`A Discord bot for advanced moderation & server management.`)
      .setDescription(`[placeholder url](https://discord.gg/s5nQBxFPp2)`)
      .setColor(bot.cfg.colors.default);

    return message.channel.send({ embeds: [embed] });
  }

  const gcfg = await bot.managers.configs.get(message.guild);
  const perms = null; // todo

  // checks if the input starts with the command prefix, immediately followed by valid characters.
  const valid_cmd = new RegExp(`^(\\${gcfg.commands.prefixes.join(`|\\`)})[a-zA-Z0-9]+`).test(message.content);

  if (valid_cmd) return handle_command(bot, message, gcfg, perms);
};

async function handle_command(bot, message, gcfg, perms) {
  const input_args = message.content.slice(1).trim().split(/ +/g);
  const input_cmd = input_args.shift().toLowerCase();

  const cmd = await bot.managers.commands.get(input_cmd);

  const unknown = async () => {
    const embed = new djs.MessageEmbed()
      .setAuthor(bot.managers.locale.text(
        `cmd.unknown.title`,
        gcfg.lang
      ), await bot.managers.assets.getIcon(`info`, bot.cfg.colors.default))
      .setFooter(bot.managers.locale.text(
        `cmd.unknown.help`,
        gcfg.lang,
        gcfg.commands.prefixes[0] + `help`
      ))
      .setColor(bot.cfg.colors.default);

    if (memory.commands.length === 0) return message.reply({ embeds: [embed] });

    const ratings = [];

    for (const searchcmd of memory.commands) {
      if (searchcmd.guilds != null && searchcmd.guilds.includes(message.guild.id)) continue;
      if (gcfg.commands.hidden.includes(searchcmd.name)) continue;
      if (gcfg.commands.disabled.includes(searchcmd.name)) continue;

      ratings.push({
        name: searchcmd.name,
        distance: wink(input_cmd, searchcmd.name)
      });
    }

    ratings.sort((a, b) => b.distance - a.distance);

    if (ratings[0].distance > 0.5) {
      const desc = bot.managers.locale.text(
        `cmd.unknown.suggestion`,
        gcfg.lang,
        gcfg.commands.prefixes[0] + ratings[0].name,
        (ratings[0].distance * 100).toFixed(1)
      );

      embed.setDescription(desc);
    }

    return message.reply({ embeds: [embed] });
  };

  // command doesnt exist
  if (cmd == null) return unknown();

  // command is disabled by server manager
  if (gcfg.commands.disabled.includes(cmd.name)) return unknown();

  // command cannot be used in this server
  if (cmd.guilds != null && !cmd.guilds.includes(message.guild.id)) return unknown();

  try {
    await cmd.run(message, input_args, gcfg);
  }
  catch (err) {
    log(err.stack, `error`);

    // the following is a bunch of code to print out a clean and simplified version of the error stack
    // of course the full, unedited stack will still appear in the bot's console
    // this code just makes stack traces easier to read without flooding text channels
    let formatted = [err.toString()];

    const file_rgx = new RegExp(`${path.parse(process.cwd()).root}\\[^,]+\\d+:\\d+`);
    const trace_rgx = /(?<=at\s)[^\r\n\t\f\v(< ]+/;
    const evaltrace_rgx = /(?<=<anonymous>):\d+:\d+/;

    for (const line of err.stack.split(`\n`)) {
      if (line.includes(`node_modules`)) break;

      let file = line.match(file_rgx);
      let trace = line.match(trace_rgx);
      let evalTrace = line.match(evaltrace_rgx);

      if (file == null) continue;
      file = file[0];
      if (trace) trace = trace[0];
      if (evalTrace) evalTrace = evalTrace[0];

      // just to be fucking sure
      file_rgx.lastIndex = 0;
      trace_rgx.lastIndex = 0;
      evaltrace_rgx.lastIndex = 0;

      let str = ``;

      const fileshort = file.replace(process.cwd(), `~`);

      if (trace && trace !== file) {
        if (trace === `eval`) {
          str += trace + evalTrace;
          formatted.push(str);
          formatted.push(fileshort);
        } else if (evalTrace) {
          str += `${trace} (at eval${evalTrace}, ${fileshort})`;
          formatted.push(str);
        } else {
          str += `${trace} (${fileshort})`;
          formatted.push(str);
        }
      } else {
        str += fileshort;
        formatted.push(str);
      }
    }

    // remove duplicate lines and combine into final string
    formatted = [...new Set(formatted)].join(`\n    at `);

    const embed = new djs.MessageEmbed()
      .setAuthor(`Something went wrong.`, await bot.managers.assets.getIcon(`error`, bot.cfg.colors.error))
      .setColor(bot.cfg.colors.error)
      .setDescription([
        `\`\`\`diff`,
        `- ${formatted}`,
        `\`\`\``
      ].join(`\n`));

    message.reply({ embeds: [embed] });
  }
}