// Logger class for easy and aesthetically pleasing console logging

import chalk from "chalk";
import { DateTime } from "luxon";
import { inspect } from "util";
import { appendFile, readdir } from "fs/promises";
import { zip } from "compressing";

export type LoggingLevel = `log` | `warn` | `error` | `fatal` | `verbose`;

// https://cdn.discordapp.com/attachments/275344239850946561/990825655082049586/unknown.png
type strange = string;

interface LoggerOptions {
  writeToFile?: boolean,
  filePath?: strange
}

export default class Logger {

  private readonly writeToFile = true; // Write to log files by default
  private readonly filePath: string = `./logs/`;

  constructor(options?: LoggerOptions) {
    if (options?.writeToFile) {
      this.writeToFile = options.writeToFile;
    }
    
    if (options?.filePath) {
      this.filePath = options.filePath;
    }
  }

  /**
   * generic, everyday logging.
   */
  public log(info: string): void {
    if (process.send) {
      process.send({ type: `log`, content: info });
      return;
    }
    
    return console.log(`${this.getTimestamp()} ${chalk.blue(`info:`)} ${info} `);
  }

  /**
   * for things that *could* be a problem but *should* be fine..?    
   */
  public warn(info: string): void {
    if (process.send) {
      process.send({ type: `warn`, content: info });
      return;
    }

    return console.warn(`${this.getTimestamp()} ${chalk.yellow(`warn:`)} ${info} `);
  }

  /**
   * generic, everyday erroring
   */
  public error(info: Error | string): void {
    if (process.send) {
      process.send({ type: `error`, content: info });
      return;
    }

    if (info instanceof Error) {
      info = (info.stack ?? info.message)
        .split(`\n`)
        .join(`\n${this.getTimestamp()} ${chalk.red(`error:`)}`);

      console.error(`${this.getTimestamp()} ${chalk.red(`error:`)} ${info}`);
    } else {
      console.error(`${this.getTimestamp()} ${chalk.red(`error:`)} ${info}`);
    }
  }

  /**
   * for when there's an unexpected error that we haven't sent to logger.error
   */
  public fatal(info: Error | string): void {
    if (process.send) {
      process.send({ type: `fatal`, content: info });
      return;
    }

    if (info instanceof Error) {
      info = (info.stack ?? info.message)
        .split(`\n`)
        .join(`\n${this.getTimestamp()} ${chalk.bgRed.white(`FATAL:`)}`);

      console.error(`${this.getTimestamp()} ${chalk.bgRed.white(`FATAL:`)} ${chalk.red(info)}`);
    } else {
      console.error(`${this.getTimestamp()} ${chalk.bgRed.white(`FATAL:`)} ${chalk.red(info)}`);
    }
  }

  /**
   * SPAM SPAM SPAM SPAM SPAM
   */
  public verbose(info: unknown): void {
    if (typeof info === `object`)
      info = inspect(info, { depth: 0, colors: true });
    
    if (process.send) {
      process.send({ type: `verbose`, content: info });
      return;
    }
      
    if (info instanceof Error)
      info = (info.stack ?? info.message)
        .split(`\n`)
        .join(`\n${this.getTimestamp()} ${chalk.grey(`verbose:`)}`);

    return console.log(`${this.getTimestamp()} ${chalk.gray(`verbose:`)} ${chalk.gray(info)} `);
  }

  private async appendToLog(level: LoggingLevel, content: string): Promise<void> {
    if (!this.writeToFile) return;

    const toWrite = `${this.getTimestamp()} ${level.toUpperCase()} ${content}`;
    await appendFile(`./logs/${level}/`, toWrite);
  }

  // private async compressLogs(): Promise<void> {
    
  // }

  private getTimestamp(): string {
    return chalk.grey(DateTime.utc().toFormat(`[yyyy-MM-dd HH:mm:ss.SSS]`));
  }
}
