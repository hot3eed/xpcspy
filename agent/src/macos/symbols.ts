import { SymbolicatedPointer } from '../lib/types';

export namespace symbols {
    export function getXPCReceivingPointer(): SymbolicatedPointer {
        /**
         * See ../ios/symbols.ts for explanation
         */
        const p_xpc_connection_suspend: NativePointer = Module.getExportByName(null, 'xpc_connection_suspend');
        const p__xpc_connection_call_event_handler: NativePointer = p_xpc_connection_suspend.add(0x3B);  // As of macOS 10.15.7
        
        return ['xpc_connection_suspend', p__xpc_connection_call_event_handler];
    }
}
