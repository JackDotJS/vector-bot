const djs = require(`discord.js`);
const fetch = require(`node-fetch`);
const memory = require(`../core/shard_memory.js`);
const Command = require(`../classes/command.js`);
const log = require(`../util/logger.js`).write;

const metadata = {
  name: `cfg`,
  description: {
    short: `Change Vector settings.`,
    long: `Starts a session for Vector's config editor.`
  },
  dm: true,
  perm: `SEND_MESSAGES`,
  run: null,
};

metadata.run = async (m, args, gcfg) => {
  const bot = memory.client;

  const token_res = await fetch(`http://localhost:${bot.cfg.api.port}/auth/create?key=${bot.keys.db}&guild=${m.guild.id}`);
  const token_data = await token_res.json();

  const embed = new djs.MessageEmbed()
    .setColor(bot.cfg.colors.default)
    .setAuthor({ name: `Vector Config`, iconURL: await bot.managers.assets.getIcon(`info`, bot.cfg.colors.default) })
    .setTitle(`Click here to open Config Editor.`)
    .setDescription(`Link valid for 30 seconds, or until used.`)
    .setURL(`${bot.cfg.editor.url}/config?token=${token_data.token}`);

  m.reply({ embeds: [embed] });
};

module.exports = new Command(metadata);