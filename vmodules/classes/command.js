const djs = require(`discord.js`);
const log = require(`../util/logger.js`).write;

module.exports = class Command {
  constructor(cmd = {}) {
    this.name = cmd.name;
    this.description = {
      short: `This command has no set description.`,
      long: `This command has no set description.`
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
    if (cmd.description != null && cmd.description.constructor !== Object) {
      throw new TypeError(`Invalid Command property: description`);
    } else {
      if (cmd.description.short != null && typeof cmd.description.short === `string`) {
        // apply SHORT description, if it exists.
        this.description.short = cmd.description.short;
      }

      if (cmd.description.long != null && typeof cmd.description.long === `string`) {
        // apply LONG description, if it exists.
        this.description.long = cmd.description.long;
      } else {
        // ...otherwise just copy the short description.
        this.description.long = this.description.short;
      }
    }

    // argument validation
    if (!Array.isArray(cmd.args)) {
      throw new TypeError(`Invalid Command property: args`);
    } else {
      for (const arg of cmd.args) {
        if (arg == null || arg.constructor !== Object) {
          throw new TypeError(`Invalid Command property: args (Invalid Element Type)`);
          // todo
        }
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
    if (!Array.isArray(cmd.guilds)) {
      throw new TypeError(`Invalid Command property: guilds`);
    } else {
      for (const id in cmd.guilds) {
        if (id == null || typeof id !== `string`) {
          throw new TypeError(`Invalid Command property: guilds (Invalid Element Type)`);
        }
      }
    }

    // validate default perm
    if (typeof cmd.perm !== `string`) {
      throw new TypeError(`Invalid Command property: perm`);
    } else {
      const flags = Object.keys(djs.Permissions.FLAGS);

      if (!flags.includes(cmd.perm)) {
        throw new TypeError(`Invalid Command property: perm (Invalid Permission)`);
      }
    }

    // validate image
    if (typeof cmd.image !== `string`) {
      throw new TypeError(`Invalid Command property: image`);
    }

    // validate allow dm
    if (typeof cmd.dm !== `boolean`) {
      throw new TypeError(`Invalid Command property: dm`);
    }

    // validate use typing indicator
    if (typeof cmd.typer !== `boolean`) {
      throw new TypeError(`Invalid Command property: typer`);
    }

    // validate command func
    if (cmd.run != null && typeof cmd.run !== `function`) {
      throw new TypeError(`Invalid Command property: run`);
    }
  }
};