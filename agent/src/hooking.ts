import { consts } from './consts';
import { symbols as iosSymbols } from './ios/symbols';
import { symbols as macosSymbols } from './macos/symbols';
import { SymbolicatedPointer, FilterType } from './lib/types';
import { IFilter } from './lib/interfaces';
import { wildcardMatch } from './lib/helpers';
import { xpcConnectionGetName } from './lib/systemfunctions';
import { formatConnectionDescription } from './lib/formatter';


export function installHooks(os: string, filter: IFilter) {
	const pointers: SymbolicatedPointer[] = [];

	if (filter.type & FilterType.Outgoing) {
		for (let symbol of consts.publicXPCSymbols) {
			pointers.push([symbol, Module.getExportByName(null, symbol)]);
		}
	}

	if (filter.type & FilterType.Incoming) {
		if (os == 'ios') {
			pointers.push(iosSymbols.getXPCReceivingPointer());
		} else if (os == 'macos') {
			pointers.push(macosSymbols.getXPCReceivingPointer());
		}
	}
	
	for (let pointer of pointers) {
		Interceptor.attach(pointer[1], 
			{ 
				onEnter: function(this: InvocationContext, args: InvocationArguments) {
					_onEnterHandler(pointer[0], args, filter.connectionNamePattern);
				} 
			});
	}
}

const _onEnterHandler = function(symbol: string, args: InvocationArguments, connectionNamePattern: string): void {
	const p_connection = new NativePointer(args[0]);
	const connectionName = (<NativePointer>xpcConnectionGetName(p_connection)).readCString();
	if (connectionNamePattern != '*' && !wildcardMatch(connectionName, connectionNamePattern)) {
		return;
	}

	const ts = Date.now();  // Resolution isn't high enough, will have to use a dict of stacks in Python
	/*
	 * Send a message to the application as soon as a new function is traced,
	 * then collect/parse data (connection & dict objects, etc.) and send them to the app.
	 * The app then will output full invocation data in sync, using the timestamp.
	*/
	send({
		type: 'agent:trace:symbol',
		message: {timestamp: ts, symbol: symbol}
	});
	
	const p_xdict = new NativePointer(args[1]);
	let connectionDesc = new ObjC.Object(p_connection).debugDescription().toString();
	connectionDesc = formatConnectionDescription(connectionDesc);
	
	send({
		type: 'agent:trace:data',
		message: 
		{
			timestamp: ts, 
			data: { conn: connectionDesc, message: new ObjC.Object(p_xdict).debugDescription().toString()  } 
		}
	});
}
