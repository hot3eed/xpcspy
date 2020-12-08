import { installHooks } from "./hooking";
import { IFilter } from './lib/interfaces';


rpc.exports = {
	installHooks: (filter: IFilter, shouldParse: boolean): void => installHooks(filter, shouldParse),
};
