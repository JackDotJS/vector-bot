"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const shard_memory_1 = __importDefault(require("../core/shard_memory"));
const command_1 = __importDefault(require("../classes/command"));
const metadata = {
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
    const bot = shard_memory_1.default.client;
    const embed = new discord_js_1.default.MessageEmbed()
        .setColor(bot.cfg.colors.default)
        .setAuthor(`About`, await bot.managers.assets.getIcon(`info`, bot.cfg.colors.default))
        .setThumbnail(bot.user.displayAvatarURL({ format: `png`, size: 64 }))
        .setTitle(`Vector: The Server Management Bot`)
        .setURL(`https://github.com/JackDotJS/vector-bot`)
        .setDescription(gcfg.commands.about_splash[~~(Math.random() * gcfg.commands.about_splash.length)])
        .addField(`List Commands`, `\`\`\`${gcfg.commands.prefixes[0]}help\`\`\``, true)
        .addField(`Search Commands`, `\`\`\`${gcfg.commands.prefixes[0]}help <query>\`\`\``, true)
        .addField(`Command Information`, `\`\`\`${gcfg.commands.prefixes[0]}help <command>\`\`\``)
        .setFooter(`Version: ${bot.version}`);
    m.reply({ embeds: [embed] });
};
module.exports = new command_1.default(metadata);
