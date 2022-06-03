const util = require(`util`);
const djs = require(`discord.js`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;

exports.name = `interactionCreate`;
exports.run = async (int) => {
  const bot = memory.client;
  log(`interaction received`);
  log(int);

  // not ready to work
  if (bot.booting) return;
  // bot is in debug mode and the command issuer is not whitelisted
  if (bot.debug && ![bot.cfg.dev.discord_user_id, ...bot.cfg.dev.user_whitelist].includes(int.user.id)) return;

  if (!int.isCommand()) return;

  if (int.guild == null) {
    const embed = new djs.MessageEmbed()
      .setAuthor({ name: 
        `Sorry, this bot cannot be used in direct messages.`, 
        iconURL: await bot.managers.assets.getIcon(`error`, bot.cfg.colors.error)
      })
      .setColor(bot.cfg.colors.error);

    return int.reply({ embeds: [embed] });
  }

  const gcfg = await bot.managers.configs.get(int.guild);
  const perms = null; // todo

  if (gcfg.commands.disabled.includes(int.commandName)) {
    const embed = new djs.MessageEmbed()
      .setAuthor({ name: 
        bot.managers.locale.text(`cmd.disabled.title`, gcfg.lang), 
        iconURL: await bot.managers.assets.getIcon(`error`, bot.cfg.colors.error)
      })
      .setColor(bot.cfg.colors.error);
    
    return int.reply({ embeds: [embed] });
  }

  const cmd = await bot.managers.commands.get(int.commandName);
  log(`cmd: ${cmd}`);

  // todo: actually do stuff

  int.reply(`placeholder`);
};