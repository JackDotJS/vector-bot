import djs from 'discord.js';
import fetch from 'node-fetch';
import memory from '../core/shard_memory';
import Command from '../classes/command';
import { write } from '../util/logger';

const metadata: Command = {
  name: `cfg`,
  description: {
    short: `Change Vector settings.`,
    long: `Starts a session for Vector's config editor.`
  },
  dm: false,
  perm: `SEND_MESSAGES`,
  run: null,
};

metadata.run = async (m, args, gcfg) => {
  const bot = memory.client!;

  const token_res = await fetch(`http://localhost:${bot.cfg.api.port}/auth/create?key=${bot.keys.db}&guild=${m.guild!.id}`);
  const token_data = await token_res.json();

  if (!hasKeys(token_data, "token")) {
    throw new Error('Invalid JSON response. Missing token in body');
  }

  const embed = new djs.MessageEmbed()
    .setColor(bot.cfg.colors.default)
    .setAuthor(`Vector Config`, await bot.managers.assets.getIcon(`info`, (bot.cfg.colors.default as string)))
    .setTitle(`Click here to open Config Editor.`)
    .setDescription(`Link valid for 30 seconds, or until used.`)
    .setURL(`${bot.cfg.editor.url}/config?token=${token_data.token}`);

  m.reply({ embeds: [embed] });
};

export default new Command(metadata);

function hasKeys<K extends PropertyKey>(o: unknown, ...keys: K[]): o is { [P in K]?: unknown } {
  return typeof o === "object" && o !== null;
}