import { write as log } from '../util/logger';

export const name = `warn`;
export const run = (content: string) => log(content, `warn`);