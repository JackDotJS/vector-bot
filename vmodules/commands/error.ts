import Command from '../classes/command.js';

const metadata: Command = {
  name: `error`,
  dm: true,
  perm: `SEND_MESSAGES`,
  guilds: [ `627527422312710154` ],
  run: null,
};

metadata.run = async () => {
  throw new Error(`ErrorTest`);
};

export default new Command(metadata);