const memory = require(`../core/api_memory.js`);

const handler = {
  route: `/guildcfg`,
  method: `GET`,
  run: null
};

handler.run = async (req, res) => {
  const gid = req.query.guild;
  const doc = await memory.db.guildcfgs.findOne({ _id: gid });
  res.status(200).json({ doc: doc });
};

module.exports = handler;