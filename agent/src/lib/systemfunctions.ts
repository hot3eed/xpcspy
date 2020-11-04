const p_xpc_connection_get_name: NativePointer = Module.getExportByName(null, 'xpc_connection_get_name');

export const xpcConnectionGetName: NativeFunction = new NativeFunction(p_xpc_connection_get_name, 'pointer', ['pointer']);
