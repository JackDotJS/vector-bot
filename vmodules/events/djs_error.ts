import { write as log } from '../util/logger';

export const name = `error`;
export const run = (err: Error | string) => log(err instanceof Error ? err.stack : err, `error`);