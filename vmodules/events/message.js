const util = require(`util`);
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

    return message.channel.send({ embeds: [ embed ]});
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

  const cmd_not_exist = (cmd == null);
  const cmd_hidden = gcfg.commands.hidden.includes(cmd.name);
  const cmd_guild_exclusive = (cmd.guilds != null && !cmd.guilds.includes(message.guild.id));

  if (cmd_not_exist || cmd_hidden || cmd_guild_exclusive) {
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
    return cmd.run(message, input_args, gcfg);
  }
  catch (err) {
    log(err.stack, `error`);
  }
}