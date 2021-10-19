"use strict";
/**
 * VECTOR :: ASSET MANAGER
 */
const djs = require(`discord.js`);
const Jimp = require(`jimp`);
const gwrap = require(`gifwrap`);
const fetch = require(`node-fetch`);
const memory = require(`../core/shard_memory.js`);
const log = require(`../util/logger.js`).write;
module.exports = class AssetManager {
    constructor() {
        throw new Error(`Why are you doing this? (Cannot instantiate this class.)`);
    }
    static async cache(keep = false, data = {}) {
        const bot = memory.client;
        const guild = await AssetManager.getCacheGuild();
        const channel = await guild.channels.fetch(bot.cfg.cache.channel_id);
        const message = await channel.send({
            files: [
                new djs.MessageAttachment(data.buf, `image.${data.ext}`)
            ]
        });
        data.url = message.attachments.first().url;
        if (keep)
            memory.assets_cache.push(data);
        return data.url;
    }
    static async getIcon(query, color = `#FFFFFF`, rotate = 0) {
        const bot = memory.client;
        if (typeof query !== `string`) {
            throw new TypeError(`Invalid parameter: query`);
        }
        // throws if color isnt resolvable
        djs.Util.resolveColor(color);
        rotate = parseInt(rotate); // just to be sure
        if (Number.isNaN(rotate)) {
            throw new TypeError(`Invalid parameter: rotate`);
        }
        // check memory for existing icon
        for (const icon of memory.assets_cache) {
            if (icon.qry === query && icon.col === color && icon.rot === rotate) {
                return icon.url;
            }
        }
        let mask = null;
        const res = await fetch(`http://localhost:${bot.cfg.api.port}/assets/icons?key=${bot.keys.db}&name=${query}`);
        const data = await res.json();
        data.buffer = Buffer.from(data.buffer); // stupid json serialization breaks everything
        if (data.path == null || data.buffer == null)
            return `https://discord.com/`; // good luck reading this as an image you stupid idiot
        if (data.path.toLowerCase().endsWith(`.png`)) {
            mask = await Jimp.read(data.buffer);
        }
        if (data.path.toLowerCase().endsWith(`.gif`)) {
            mask = await gwrap.GifUtil.read(data.buffer);
        }
        // process PNG
        if (mask.constructor === Jimp) {
            const icon = new Jimp(mask.bitmap.width, mask.bitmap.height, color);
            icon.mask(mask, 0, 0);
            if (rotate !== 0) {
                icon.background(0x00000000) // ensures background doesnt show after rotating
                    .rotate(rotate, false);
            }
            return await AssetManager.cache(true, {
                qry: query,
                col: color,
                rot: rotate,
                buf: await icon.getBufferAsync(Jimp.MIME_PNG),
                ext: `png`,
                url: null
            });
        }
        // process GIF
        const frames = [];
        for (const i in mask.frames) {
            const jcolor = new Jimp(mask.frames[i].bitmap.width, mask.frames[i].bitmap.height, color);
            const fjmask = gwrap.GifUtil.copyAsJimp(Jimp, mask.frames[i].bitmap);
            const newframe = new gwrap.GifFrame(mask.frames[i]);
            jcolor.mask(fjmask, 0, 0);
            if (rotate !== 0) {
                jcolor.background(0x00000000) // ensures background doesnt show after rotating
                    .rotate(rotate, false);
            }
            newframe.bitmap = jcolor.bitmap;
            frames.push(newframe);
        }
        const codec = new gwrap.GifCodec();
        return await AssetManager.cache(true, {
            qry: query,
            col: color,
            rot: rotate,
            hsh: await codec.encodeGif(frames, { loops: 0, colorScope: 0 }).buffer,
            ext: `gif`,
            url: null
        });
    }
    static async getCacheGuild() {
        const bot = memory.client;
        return await bot.guilds.fetch({ guild: bot.cfg.cache.guild_id, withCounts: false });
    }
};
