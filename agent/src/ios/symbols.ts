import { SymbolicatedPointer } from '../lib/types';

export namespace symbols {
    export function getXPCReceivingPointer(): SymbolicatedPointer {
        const p_xpc_data_set_value: NativePointer = Module.getExportByName(null, '_xpc_data_set_value');  // This is the nearest global symbol to the one we're hooking, as of iOS 13.6
        const p__xpc_connection_call_event_handler: NativePointer = p_xpc_data_set_value.sub(0xBFC);

        return ['_xpc_connection_call_event_handler', p__xpc_connection_call_event_handler];
    } 
}
