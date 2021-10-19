import djs from 'discord.js';
import memory from '../core/shard_memory';
import Command from '../classes/command';

const metadata: Command = {
  name: `about`,
  description: {
    short: `A quick introduction to Vector.`,
    long: `Provides a quick introduction to Vector.`
  },
  dm: true,
  perm: `SEND_MESSAGES`,
  run: null,
};

metadata.run = async (m, args, gcfg) => {
  const bot = memory.client!;

  const embed = new djs.MessageEmbed()
    .setColor(bot.cfg.colors.default)
    .setAuthor(`About`, await bot.managers.assets.getIcon(`info`, (bot.cfg.colors.default as string)))
    .setThumbnail(bot.user!.displayAvatarURL({ format: `png`, size: 64 }))
    .setTitle(`Vector: The Server Management Bot`)
    .setURL(`https://github.com/JackDotJS/vector-bot`)
    .setDescription(gcfg.commands.about_splash[~~(Math.random() * gcfg.commands.about_splash.length)])
    .addField(`List Commands`, `\`\`\`${gcfg.commands.prefixes[0]}help\`\`\``, true)
    .addField(`Search Commands`, `\`\`\`${gcfg.commands.prefixes[0]}help <query>\`\`\``, true)
    .addField(`Command Information`, `\`\`\`${gcfg.commands.prefixes[0]}help <command>\`\`\``)
    .setFooter(`Version: ${bot.version}`);

  m.reply({ embeds: [embed] });
};

module.exports = new Command(metadata);