import { fork } from 'child_process';

const child = fork(`./build/bot.js`, process.argv);

child.on(`spawn`, () => console.log(`Child started`));

child.on(`error`, (code: number) => {
  console.log(`Child errored: ${code}`);
  process.exit(code);
});