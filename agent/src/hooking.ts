import { FilterType } from './lib/types';
import { IFilter, IFunctionPointer } from './lib/interfaces';
import { objcObjectDebugDesc, wildcardMatch } from './lib/helpers';
import { xpcConnectionGetName,
		xpcConnectionCallEventHandler,
		} from './lib/systemFunctions';
import { formatConnectionDescription } from './lib/formatters';
import { outgoingXPCMessagesFunctionPointer } from './consts';


export function installHooks(os: string, filter: IFilter) {
	const pointers: IFunctionPointer[] = [];

	if (filter.type & FilterType.Outgoing) {
		pointers.push(...outgoingXPCMessagesFunctionPointer);
	}

	if (filter.type & FilterType.Incoming) {
		pointers.push(xpcConnectionCallEventHandler);
	}
	
	for (let pointer of pointers) {
		Interceptor.attach(pointer.ptr, 
			{ 
				onEnter: function(this: InvocationContext, args: InvocationArguments) {
					_onEnterHandler(pointer.name, args, filter.connectionNamePattern);
				} 
			});
	}
}

const _onEnterHandler = function(symbol: string, args: InvocationArguments, connectionNamePattern: string): void {
	const p_connection = new NativePointer(args[0]);
	const connectionName = (<NativePointer>xpcConnectionGetName.call(p_connection)).readCString();
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
	
	const p_message = new NativePointer(args[1]);
	let connectionDesc = objcObjectDebugDesc((p_connection));
	connectionDesc = formatConnectionDescription(connectionDesc);
	//console.log(objcObjectDebugDesc(p_message));

	send({
		type: 'agent:trace:data',
		message: 
		{
			timestamp: ts, 
			data: { conn: connectionDesc, message: new ObjC.Object(p_message).debugDescription().toString()  } 
		}
	});
}
