import { installHooks } from '../hooking';
import { IFilter } from '../lib/interfaces';

export function setUp(os: string, filter: IFilter, shouldParse: boolean) {
   installHooks(os, filter, shouldParse);
}
