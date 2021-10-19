import memory from '../core/api_memory';
import APIHandler from '../util/interfaces/APIHandler';

const handler: APIHandler = {
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