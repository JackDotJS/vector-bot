import djs, { Message, PermissionString } from 'discord.js';
import BotConfig from '../util/interfaces/BotConfig';

interface ICommand {
  name: string;
  description?: { short: string, long: string };
  args?: string[] | null;
  subcmds?: string[] | null;
  guilds?: string[] | null;
  image?: string | null;
  perm: PermissionString | null;
  dm: boolean;
  typer?: boolean;
  run: ((m: Message, args: string[], gcfg: BotConfig) => void) | null; 
}

export default class Command implements ICommand {

  public name: string;
  public description?: { short: string, long: string };
  public args?: string[] | null;
  public subcmds?: string[] | null;
  public guilds?: string[] | null;
  public image?: string | null;
  public perm: PermissionString | null;
  public dm: boolean;
  public typer?: boolean;
  public run: ((m: Message, args: string[], gcfg: BotConfig) => void) | null;

  constructor(cmd: ICommand) {

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
    if (cmd.name.match(/[^a-zA-Z0-9]/) !== null) {
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
        // apply SHORT description, if it exists.
        this.description.short = short;
      }

      if (long != null) {
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