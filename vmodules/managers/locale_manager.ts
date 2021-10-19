/**
 * VECTOR :: COMMAND MANAGER
 */

import path from 'path';
import fs from 'fs';
import memory from '../core/shard_memory.js';
import { write as log } from '../util/logger';
import merge from '../util/deep_merge.js';

export default class LocaleManager {
  constructor() {
    throw new Error(`Why are you doing this? (Cannot instantiate this class.)`);
  }

  static async load() {
    const bot = memory.client!;

    memory.lang.index = [];

    for (const file of fs.readdirSync(`./locale/`, { withFileTypes: true })) {
      try {
        if (file == null || !file.isFile() || !file.name.toLowerCase().endsWith(`.json`)) continue;
        const pathinfo = path.parse(`../../locale/${file.name}`);
        const fulldir = path.resolve(`./locale/${file.name}`);

        delete require.cache[fulldir]; // forces Node to read the file from disk rather than cache
        const index = require(fulldir);

        const set = {
          name: pathinfo.name,
          phrases: index
        };

        memory.lang.index.push(set);
        log(`Loaded language index "${file.name}"`);

        if (pathinfo.name === bot.cfg.default_lang) {
          memory.lang.default = set;
          log(`Default language index "${file.name}" set.`);
        }
      }
      catch (err) {
        log(`Could not load language index "${file.name}" \n${err instanceof Error ? err.stack : err}`, `error`);
      }
    }

    log(`Successfully loaded ${memory.lang.index.length} language(s)!`, `info`);

    return memory.lang.index;
  }

  static text(query: string, lang: string, ...opts: string[]) {
    const defaultstr = `locale_text_error`;

    query = query.toLowerCase();

    // find selected language
    let selectLang = null;
    for (const langidx of memory.lang.index) {
      if (lang === langidx.name) selectLang = langidx;
    }

    // if language doesn't exist, use default
    if (selectLang == null) selectLang = memory.lang.default;

    // if not default, merge language with default
    if (selectLang.name !== memory.lang.default.name) selectLang = merge(memory.lang.default, selectLang);

    // we only need the phrases from this point forward
    selectLang = selectLang.phrases;

    // converts query to usable dot notation and parse each key sequentially
    let str = query.toLowerCase().split(`.`).reduce((p,c) => p ? p[c] : null, selectLang);

    // check if phrase exists
    if (str == null) return defaultstr;

    // replace variable string elements
    for (const i in opts) {
      str = str.replace(new RegExp(`%%${i}%%`, `gm`), opts[i]);
    }

    return str;
  }
};