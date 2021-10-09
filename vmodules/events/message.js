const util = require(`util`);
const djs = require(`discord.js`);
const wink = require(`jaro-winkler`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

exports.name = `messageCreate`;
exports.run = async (message) => {
  const bot = memory.client;
  const member = message.member;

  // not ready to work
  if (bot.booting) return;
  // not a message we can/should process.
  if (message.author.bot || message.author.system || message.system || message.type !== `DEFAULT`) return;
  // bot is in debug mode and the message author is not whitelisted
  if (bot.debug && ![bot.cfg.dev.discord_user_id, ...bot.cfg.dev.user_whitelist].includes(message.author.id)) return;

  const gcfg = await bot.managers.configs.get(message.guild);
  const perms = null; // todo

  const first_line = message.content.split(`\n`, 1)[0];
  const input_split = first_line.split(` `);
  const input = {
    // checks if the input starts with the command prefix, immediately followed by valid characters.
    valid: new RegExp(`^(\\${gcfg.commands.prefixes.join(`|\\`)})(?![^a-zA-Z0-9])[a-zA-Z0-9]+(?=\\s|$)`).test(first_line),
    cmd: input_split[0].toLowerCase().substr(1),
    args: input_split.slice(1).filter((arg) => arg.length !== 0)
  };

  if (input.valid) return handle_command(bot, message, input, gcfg, perms);
};

async function handle_command(bot, message, input, gcfg, perms) {
  const cmd = await bot.managers.commands.get(input.cmd);

  if (cmd == null || gcfg.commands.hidden.includes(cmd.name)) {
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
        distance: wink(input.cmd, searchcmd.name)
      });
    }

    ratings.sort((a,b) => b.distance - a.distance);

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
  }

  try {
    return cmd.run(message, input, gcfg);
  }
  catch (err) {
    log(err.stack, `error`);
  }
}