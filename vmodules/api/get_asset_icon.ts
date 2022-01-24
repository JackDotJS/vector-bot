import path from 'path';
import fs from 'fs';
import memory from '../core/api_memory';
import APIHandler from './interfaces/APIHandler';

const handler: APIHandler = {
  route: `/assets/icons`,
  method: `GET`,
  run: null
};

handler.run = async (req, res) => {
  const query = req.query.name;

  for (const file of fs.readdirSync(`./assets/icons`, { withFileTypes: true })) {
    if (file == null || !file.isFile()) continue;

    const rp = `./assets/icons/${file.name}`;

    const pathinfo = path.parse(rp);

    if (pathinfo.name !== query) continue;

    return res.status(200).json({
      path: path.resolve(rp),
      buffer: fs.readFileSync(rp)
    });
  }

  res.status(404).json({ message: `wtf are u looking for` });
};

module.exports = handler;