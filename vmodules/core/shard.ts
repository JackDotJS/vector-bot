/**
 * VECTOR :: SHARD PROCESS
 */

if (!process.send) throw new Error(`Cannot run standalone.`);

const djs = require(`discord.js`);
const fs = require(`fs`);
const util = require(`util`);
const Vector = require(`../classes/client.js`);
const log = require(`../util/logger.js`).write;

const djs_opts = {
  presence: {
    status: `online`,
    activities: [
      {
        type: `LISTENING`,
        name: `port 69 haha lol`
      }
    ]
  },
  allowedMentions: { parse: [`users`, `roles`] }, // remove this line to die instantly
  intents: [
    // https://discord.com/developers/docs/topics/gateway#list-of-intents
    djs.Intents.FLAGS.GUILDS,
    djs.Intents.FLAGS.GUILD_MESSAGES,
    djs.Intents.FLAGS.DIRECT_MESSAGES
  ]
};

const vec_opts = {
  debug: (process.argv[2] === `true`)
};

const bot = new Vector(djs_opts, vec_opts);

// load event handlers
for (const file of fs.readdirSync(`./vmodules/events/`)) {
  const event = require(`../events/${file}`);
  bot.on(event.name, event.run);
  log(`Loaded event handler "${event.name}" from ${file}`);
}

// finally log in
bot.login().catch(err => {
  log(err.stack, `fatal`);
  log(`Failed to connect to Discord API. Restarting in 5 minutes...`);

  // 5 minute timeout to give the API some time to be restored.
  // this is assuming the issue is on Discord's end.
  setTimeout(() => {
    process.exit(1);
  }, (1000 * 60 * 5));
});