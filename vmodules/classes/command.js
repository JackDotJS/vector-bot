const djs = require(`discord.js`);
const log = require(`../util/logger.js`).write;

module.exports = class Command {
  constructor(cmd = {}) {
    this.name = cmd.name;
    this.description = {
      short: `This command has no short description.`,
      long: `This command has no long description.`
    };
    this.args = null;
    this.subcmds = null;
    this.guilds = null;
    this.image = null;
    this.perm = null;
    this.dm = false;
    this.typer = true;
    this.run = cmd.run;

    // name validation
    if (typeof cmd.name !== `string` || cmd.name.match(/[^a-zA-Z0-9]/) !== null) {
      throw new TypeError(`Invalid or unspecified Command property: name`);
    }

    // description validation
    if (cmd.description != null) {
      if (cmd.description.constructor !== Object) {
        throw new TypeError(`Invalid Command property: description`);
      }

      const short = cmd.description.short;
      const long = cmd.description.long;

      if (short != null) {
        if (typeof short !== `string`) {
          throw new TypeError(`Invalid Command property: description.short`);
        }

        // apply SHORT description, if it exists.
        this.description.short = short;
      }

      if (long != null) {
        if (typeof long !== `string`) {
          throw new TypeError(`Invalid Command property: description.long`);
        }

        // apply LONG description, if it exists.
        this.description.long = long;
      } 

      if (short != null && long == null) {
        // if long description doesnt exist, use short description
        this.description.long = short;
      }
    }

    // argument validation
    if (cmd.args != null) {
      if (!Array.isArray(cmd.args)) {
        throw new TypeError(`Invalid Command property: args`);
      }

      for (const arg of cmd.args) {
        if (arg == null || arg.constructor !== Object) {
          throw new TypeError(`Invalid Command property: args (Invalid Element Type)`);
        }
        // todo
      }
    }

    // subcommand validation
    if (cmd.subcmds != null && cmd.subcmds.constructor !== Object) {
      throw new TypeError(`Invalid Command property: subcmds`);
    }

    // actually you cant use subcommands and arguments at the same time. you imbecile. you fucking idiot.
    if (cmd.subcmds != null && cmd.args != null) {
      throw new TypeError(`Invalid Command data: Cannot have both args and subcmds`);
    }

    // validate guilds
    if (cmd.guilds != null) {
      if (!Array.isArray(cmd.guilds)) {
        throw new TypeError(`Invalid Command property: guilds`);
      }

      for (const id in cmd.guilds) {
        if (id == null || typeof id !== `string`) {
          throw new TypeError(`Invalid Command property: guilds (Invalid Element Type)`);
        }
      }
    }

    // validate default perm
    if (typeof cmd.perm !== `string`) {
      throw new TypeError(`Invalid Command property: perm`);
    }

    const flags = Object.keys(djs.Permissions.FLAGS);
    if (!flags.includes(cmd.perm)) {
      throw new TypeError(`Invalid Command property: perm (Invalid Permission)`);
    }

    // validate image
    if (cmd.image != null && typeof cmd.image !== `string`) {
      throw new TypeError(`Invalid Command property: image`);
    }

    // validate allow dm
    if (cmd.dm != null && typeof cmd.dm !== `boolean`) {
      throw new TypeError(`Invalid Command property: dm`);
    }

    // validate use typing indicator
    if (cmd.typer != null && typeof cmd.typer !== `boolean`) {
      throw new TypeError(`Invalid Command property: typer`);
    }

    // validate command func
    if (typeof cmd.run !== `function`) {
      throw new TypeError(`Invalid Command property: run`);
    }
  }
};