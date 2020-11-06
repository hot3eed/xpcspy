import { IFunctionPointer } from '../lib/interfaces';

export namespace functionPointers {
    export function get_xpc_connection_call_event_handler(): IFunctionPointer {
        const p_xpc_data_set_value: NativePointer = Module.getExportByName(null, '_xpc_data_set_value');  // This is the nearest global symbol to the one we're hooking, as of iOS 13.6
        const p__xpc_connection_call_event_handler: NativePointer = p_xpc_data_set_value.sub(0xBFC);

        return {
            name: '_xpc_connection_call_event_handler', 
            ptr: p__xpc_connection_call_event_handler,
            func: new NativeFunction(p__xpc_connection_call_event_handler, 'void', ['pointer', 'pointer'])};
    } 
}
