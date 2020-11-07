import { installHooks } from '../hooking';
import { IFilter } from '../lib/interfaces';

export function setUp(os: string, filter: IFilter) {
   installHooks(os, filter);
}
