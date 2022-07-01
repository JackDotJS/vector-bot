// Logger class for easy and aesthetically pleasing console logging

import chalk from "chalk";
import { DateTime } from "luxon";
import { inspect } from "util";
import { PathLike } from "fs";
import { appendFile, readdir, rm, stat, access, mkdir, rename } from "fs/promises";
import { zip } from "compressing";

const defaultFilePath: PathLike = `logs`;

export type LoggingLevel = `log` | `warn` | `error` | `fatal` | `verbose`;

// https://cdn.discordapp.com/attachments/275344239850946561/990825655082049586/unknown.png
type strange = string;

interface LoggerOptions {
  loginCount?: number,
  writeToFile?: boolean,
  filePath?: strange
}

export default class Logger {

  private readonly writeToFile = true; // Write to log files by default
  private readonly filePath: PathLike = defaultFilePath;
  private loginCount?: number;

  constructor(options?: LoggerOptions) {
    if (options?.writeToFile) {
      this.writeToFile = options.writeToFile;
    }

    if (options?.filePath) {
      this.filePath = options.filePath;
    }

    if (options?.loginCount) {
      if (process.send)
        throw new Error(`Cannot set login count when running as a shard`);

      this.loginCount = options.loginCount;
    }

    if (!process.send && !this.loginCount)
      throw new Error(`Must set login count when not running as a shard`);

  }

  /**
   * generic, everyday logging.
   */
  public log(info: string): void {
    if (process.send) {
      process.send({ type: `log`, content: info });
      return;
    }

    this.appendToLog(`log`, info);
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

    this.appendToLog(`warn`, info);
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
    }

    this.appendToLog(`error`, info);
    console.error(`${this.getTimestamp()} ${chalk.red(`error:`)} ${info}`);
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
    }

    this.appendToLog(`fatal`, info);
    console.error(`${this.getTimestamp()} ${chalk.bgRed.white(`FATAL:`)} ${chalk.red(info)}`);
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

    const contentTimestamp = DateTime.utc().toFormat(`yyyy-MM-dd HH:mm:ss.SSS`);
    const toWrite = `${contentTimestamp} ${level.toUpperCase()} ${content}\n`;
    const fileTimestamp = DateTime.utc().toFormat(`yyyy-MM-dd`);
    await appendFile(`./${this.filePath}/${fileTimestamp}.${this.loginCount}.log`, toWrite);
  }

  // This is static so we can call it even before the logger is initialized if we want.
  public static async compressLogs(filePath?: PathLike): Promise<void> {
    if (!filePath)
      filePath = defaultFilePath;

    const date = new Date();
    const currentYear = date.getUTCFullYear();
    const currentMonth = date.getUTCMonth() + 1; // month is 0-indexed annoyingly
    const currentDay = date.getUTCDate();

    try {
      await access(`${filePath}/archive/${currentYear}/${currentMonth}/`);
    } catch (e) {
      await mkdir(`${filePath}/archive/${currentYear}/${currentMonth}/`, { recursive: true });
    }

    const minimumFileSize = 250; // bytes
    // 250 (give or take) is the minimum number of bytes for these zip files from what I've seen.
    // That's just the login information with no extra data. If we compress the log file, 
    // the resulting zip file is actually bigger because of the additional zip header data. 
    // This can add up if the bot goes through a bunch of restarts with no additional data.

    const files = await readdir(filePath);
    for (const file of files) {
      const fileStats = await stat(`${filePath}/${file}`);
      if (fileStats.isDirectory()) // File is a directory, skip to next iteration.
        continue;

      const restartNumber = file.match(/(?<=\d\.)\d+(?=\.log)/i)?.[0] ?? `0`;

      if (fileStats.size <= minimumFileSize) { 
        // File is too small to be worth compressing, just move it to the archive folder.
        await rename(`./${filePath}/${file}`, `./${filePath}/archive/${currentYear}/${currentMonth}/${currentDay}.${restartNumber}.log`);
      } else {
        zip.compressFile(`./${filePath}/${file}`, `./${filePath}/archive/${currentYear}/${currentMonth}/${currentDay}.${restartNumber}.zip`);
        rm(`./${filePath}/${file}`);
      }
      
    }
  }

  private getTimestamp(): string {
    return chalk.grey(DateTime.utc().toFormat(`[yyyy-MM-dd HH:mm:ss.SSS]`));
  }
}
