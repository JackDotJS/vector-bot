// Logger class for easy and aesthetically pleasing console logging

import chalk from "chalk";
import { DateTime } from "luxon";
import { inspect } from "util";
import { appendFile } from "fs/promises";

type LogType = `all` | `archive` | `crash`;
interface LoggerOptions {
  writeToFile?: boolean
}

export default class Logger {

  private readonly timestamp: string = chalk.grey(`[${DateTime.now().toLocaleString()}]`);
  private readonly writeToFile = true; // Write to log files by default
  private readonly isShard: boolean;

  constructor(options?: LoggerOptions) {
    if (options?.writeToFile) {
      this.writeToFile = options.writeToFile;
    }
    
    // Check for the existence of a process.send function. If it exists, we know we've been spawned from another process.
    this.isShard = Boolean(process.send);     
  }

  /**
   * generic, everyday logging.
   */
  public log(info: string): void {
    return console.log(`${this.timestamp} ${chalk.blue(`info:`)} ${info} `);
  }

  /**
   * for things that *could* be a problem but *should* be fine..?    
   */
  public warn(info: string): void {
    return console.warn(`${this.timestamp} ${chalk.yellow(`warn:`)} ${info} `);
  }

  /**
   * generic, everyday erroring
   */
  public error(info: Error | string): void {
    if (info instanceof Error) {
      info = (info.stack ?? info.message)
        .split(`\n`)
        .join(`\n${this.timestamp} ${chalk.red(`error:`)}`);

      console.error(`${this.timestamp} ${chalk.red(`error:`)} ${info}`);
    } else {
      console.error(`${this.timestamp} ${chalk.red(`error:`)} ${info}`);
    }
  }

  /**
   * for when there's an unexpected error that we haven't sent to logger.error
   */
  public fatal(info: Error | string): void {
    if (info instanceof Error) {
      info = (info.stack ?? info.message)
        .split(`\n`)
        .join(`\n${this.timestamp} ${chalk.bgRed.white(`FATAL:`)}`);

      console.error(`${this.timestamp} ${chalk.bgRed.white(`FATAL:`)} ${chalk.red(info)}`);
    } else {
      console.error(`${this.timestamp} ${chalk.bgRed.white(`FATAL:`)} ${chalk.red(info)}`);
    }
  }

  /**
   * SPAM SPAM SPAM SPAM SPAM
   */
  public verbose(info: unknown): void {
    if (typeof info === `object`)
      info = inspect(info, { depth: 0, colors: true });

    if (info instanceof Error)
      info = (info.stack ?? info.message)
        .split(`\n`)
        .join(`\n${this.timestamp} ${chalk.grey(`verbose:`)}`);

    return console.log(`${this.timestamp} ${chalk.gray(`verbose:`)} ${chalk.gray(info)} `);
  }

  private async appendToLog(log: LogType, content: string): Promise<void> {
    if (!this.writeToFile) return;

    const toWrite = `${this.timestamp} ${log.toUpperCase()} ${content}`;
    await appendFile(`./logs/${log}/`, toWrite);
  }

}
