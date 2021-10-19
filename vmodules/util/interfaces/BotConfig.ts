import { ColorResolvable, ChannelResolvable, RoleResolvable, PermissionString } from "discord.js";
import Command from '../../classes/command';

export interface VectorPermission {
  name: string | null,
  type: "PERM" | "USER" | "ROLE",
  target: PermissionString, // TODO: check with jack on this
  nodes: string[],
  priority: number,
  parent: VectorPermission | null
}

export default interface BotConfig {
  dev: {
    discord_user_id: string,
    user_whitelist: string[],
    exec: {
      verbose: boolean,
      inspect_depth: number,
    }
  },
  cache: {
    guild_id: string,
    channel_id: string,
  },
  resetcheck: {
    min_reset_warning: number,
    max_resets_per_hour: number,
  },
  api: {
    port: number
  },
  colors: {
    default: ColorResolvable,
    error: ColorResolvable,
    warn: ColorResolvable,
    okay: ColorResolvable
  },
  metadata: {
    version: number,
    updated: number
  },
  lang: 'en_us' | 'en_test',
  default_lang: string,
  automation: {
    auto_cmd: any[],
    auto_react: any[],
    auto_reply: any[],
    auto_mod: any[]
  },
  commands: {
    owo: boolean,
    prefixes: string[],
    hidden: Command['name'][], // TODO: check with Jack on this
    disabled: Command['name'][], // TODO: check with jack on this
    channel_locked: {
      name: string,
      blacklist_mode: boolean,
      commands: Command['name'], // TODO: check with jack on this
      allow_bypass: boolean
    }[],
    github_repos: string[],
    about_splash: string[]
  },
  logging: {
    input: {
      blacklist_mode: boolean,
      channels: ChannelResolvable[]
    },
    output: {
      use_webhook: boolean,
      channels: {
        channel_add: ChannelResolvable,
        channel_delete: ChannelResolvable,
        channel_update: ChannelResolvable,
        member_ban: ChannelResolvable,
        member_unban: ChannelResolvable,
        member_mute: ChannelResolvable,
        member_unmute: ChannelResolvable,
        member_kick: ChannelResolvable,
        member_join: ChannelResolvable,
        member_leave: ChannelResolvable,
        record_note_add: ChannelResolvable,
        record_note_delete: ChannelResolvable,
        record_update: ChannelResolvable,
        record_pardon: ChannelResolvable,
        message_delete: ChannelResolvable,
        message_edit: ChannelResolvable
      }
    }
  },
  roles: {
    vacation: RoleResolvable,
    muted: RoleResolvable,
    staffping_groups: any[],
    grantable_command: any[],
    grantable_reaction: any[]
  },
  permissions: VectorPermission[]
}