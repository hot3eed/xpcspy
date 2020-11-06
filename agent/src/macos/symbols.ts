import { IFunctionPointer } from '../lib/interfaces';

export namespace functionPointers {
    export function get_xpc_connection_call_event_handler(): IFunctionPointer {
        const p_xpc_connection_suspend: NativePointer = Module.getExportByName('libxpc.dylib', 'xpc_connection_suspend');
        const p__xpc_connection_call_event_handler = p_xpc_connection_suspend.add(0x3B);  // As of macOS 10.15.7
        return {
            name: '_xpc_connection_call_event_handler',
            ptr: p__xpc_connection_call_event_handler,
            func: new NativeFunction(p__xpc_connection_call_event_handler, 'void', ['pointer', 'pointer'])
        };
    }

    export function get__CFBinaryPlistCreate15(): IFunctionPointer {
        /**
         * See: https://opensource.apple.com/source/CF/CF-855.14/CFBinaryPList.c.auto.html
         */
        const p___CFXPCCreateCFObjectFromXPCMessage = Module.getExportByName('CoreFoundation', '_CFXPCCreateCFObjectFromXPCMessage');
        const p__CFBinaryPlistCreate15 = p___CFXPCCreateCFObjectFromXPCMessage.add(0x6E);
        return {
            name: '__CFBinaryPlistCreate15',
            ptr: p__CFBinaryPlistCreate15,
            func: new NativeFunction(p__CFBinaryPlistCreate15, 'pointer', ['pointer', 'int', 'pointer'])
        }
    }
}
