const memory = require(`../core/api_memory.js`);
const app = memory.app;

exports.route = `/guildcfg`;
exports.method = app.get;
exports.run = async (req, res) => {
  const gid = req.query.guild;
  const doc = memory.db.guildcfgs.findOne({ _id: gid });
  res.status(200).json({ doc: doc });
};