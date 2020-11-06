import { installHooks } from '../hooking';
import { IFilter } from '../lib/interfaces';
import { SystemFunctionsManager } from '../lib/systemFunctionsManager';

export function setUp(os: string, filter: IFilter) {
   SystemFunctionsManager.sharedInstance().loadOSNonExportedSymbols(os);
   installHooks(os, filter);
}
