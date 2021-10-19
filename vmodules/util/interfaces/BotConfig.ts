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
  }
}