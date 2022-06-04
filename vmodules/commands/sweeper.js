const util = require(`util`);
const djs = require(`discord.js`);
const memory = require(`../core/shard_memory.js`);
const Command = require(`../classes/command.js`);
const log = require(`../util/logger.js`).write;

const metadata = {
  name: `sweeper`,
  dm: true,
  perm: `SEND_MESSAGES`,
  run: null,
};

metadata.run = async (m) => {
  const bot = memory.client;

  const sizeX = 5;
  const sizeY = 5;
  const mines = Math.floor(Math.random() * (4 - 2 + 1) + 2);
  
  const grid = [];
  const components = [];

  let buried = sizeX * sizeY;
  let currentMines = 0;
  let firstTile = true;
  let playing = true;

  for (let i = 0; i < sizeY; i++) {
    const crow = new djs.MessageActionRow();
    const grow = [];

    for (let i2 = 0; i2 < sizeX; i2++) {
      const cbutton = new djs.MessageButton()
        .setCustomId(i + `-` + i2)
        .setStyle(`SECONDARY`)
        .setEmoji(`⬜`);

      const gbutton = {
        buried: true,
        mine: false,
        flagged: false,
        x: i2,
        y: i
      };

      crow.addComponents(cbutton);
      grow.push(gbutton);
    }

    components.push(crow);
    grid.push(grow);
  }

  const getTile = (x, y) => {
    x = parseInt(x);
    y = parseInt(y);

    log(`get tile at ${x},${y}`);

    const data = {
      here: grid[x][y],
      x,
      y,
      nearby: 0,
      positions: null
    };

    const positions = {
      n: [x - 1, y],
      ne: [x - 1, y + 1],
      e: [x, y + 1],
      se: [x + 1, y + 1],
      s: [x + 1, y],
      sw: [x + 1, y - 1],
      w: [x, y - 1],
      nw: [x - 1, y - 1]
    };

    if (x === 0) {
      positions.n = null;
      positions.ne = null;
      positions.nw = null;
    }

    if (x === sizeX - 1) {
      positions.se = null;
      positions.s = null;
      positions.sw = null;
    }

    if (y === 0) {
      positions.sw = null;
      positions.w = null;
      positions.nw = null;
    }

    if (y === sizeY - 1) {
      positions.ne = null;
      positions.e = null;
      positions.se = null;
    }

    for (const key of Object.keys(positions)) {
      const pos = positions[key];
      if (pos == null) continue;
      const ntile = grid[pos[0]][pos[1]];

      if (ntile.mine) data.nearby++;
    }
    
    data.positions = positions;

    return data;
  };

  const clearTile = (tile) => {
    grid[tile.x][tile.y].buried = false;
    buried--;

    if (tile.nearby > 0) return;

    for (const key of Object.keys(tile.positions)) {
      const pos = tile.positions[key];
      if (pos == null) continue;

      const ntile = getTile(pos[0], pos[1]);

      if (ntile.here.buried) clearTile(ntile);
    }
  };

  const generateMines = (x, y) => {
    log(`generate mine ${currentMines+1}/${mines}`);

    const randX = Math.floor(Math.random() * sizeX);
    const randY = Math.floor(Math.random() * sizeY);

    if (x === randX || y === randY) return generateMines(x, y);

    const tile = getTile(randX, randY);

    if (tile.here.mine) return generateMines(x, y);

    grid[randX][randY].mine = true;
    currentMines++;

    if (currentMines < mines) return generateMines(x, y);
  };

  const renderComponents = (state = 0) => {
    for (let i = 0; i < sizeY; i++) {
      for (let i2 = 0; i2 < sizeX; i2++) {
        const cbutton = components[i].components[i2];
        const gtile = getTile(i, i2);

        if (!gtile.here.buried) {
          switch (gtile.nearby) {
            case 1:
              cbutton.setEmoji(`1️⃣`);
              break;
            case 2:
              cbutton.setEmoji(`2️⃣`);
              break;
            case 3:
              cbutton.setEmoji(`3️⃣`);
              break;
            case 4:
              cbutton.setEmoji(`4️⃣`);
              break;
            case 5:
              cbutton.setEmoji(`5️⃣`);
              break;
            case 6:
              cbutton.setEmoji(`6️⃣`);
              break;
            case 7:
              cbutton.setEmoji(`7️⃣`);
              break;
            case 8:
              cbutton.setEmoji(`8️⃣`);
              break;
            default:
              cbutton.setEmoji(`🟦`);
          }
        }

        if (state === 1) {
          cbutton.setStyle(`SUCCESS`);
        }

        if (state === 2) {
          cbutton.setStyle(`DANGER`);
  
          if (grid[i][i2].mine) cbutton.setEmoji(`💣`);
        }
      }
    }
  };

  const embed = new djs.MessageEmbed()
    .setAuthor({ name: `Bombsweeper` })
    .setColor(bot.cfg.colors.default)
    .setDescription([
      `Mines: ${mines}`
    ].join(`\n`));

  const bm = await m.reply({ 
    //content: util.inspect(grid), 
    embeds: [ embed ],
    components 
  });

  const filter = (int) => int.user.id === m.author.id && int.isButton();
  const collector = bm.createMessageComponentCollector({ filter, time: (1000 * 60 * 15) });

  collector.on(`collect`, async int => {
    const nums = int.customId.match(/\d+/g);
    const x = parseInt(nums[0]);
    const y = parseInt(nums[1]);

    if (firstTile) generateMines(x, y);
    firstTile = false;

    const tile = getTile(x, y);

    if (tile.here.buried && !tile.here.mine) {
      clearTile(tile);
    }

    if (tile.here.mine) {
      embed.setTitle(`Game Over!`)
        .setColor(bot.cfg.colors.error);

      renderComponents(2);

      playing = false;
    } else
    if (buried === mines) {
      embed.setTitle(`You Win!`)
        .setColor(bot.cfg.colors.okay);

      renderComponents(1);

      playing = false;
    } else {
      renderComponents();
    }

    if (!playing) {
      delete embed.description;
      collector.stop(); 
    }

    int.update({
      //content: util.inspect(grid),
      embeds: [ embed ],
      components
    });
  });
};

module.exports = new Command(metadata);