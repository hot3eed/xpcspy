const p_xpc_connection_get_name: NativePointer = Module.getExportByName(null, 'xpc_connection_get_name');
const p_xpc_dictionary_apply: NativePointer = Module.getExportByName(null, 'xpc_dictionary_apply');
const p_xpc_get_type: NativePointer = Module.getExportByName(null, 'xpc_get_type');
const p_xpc_data_get_bytes_ptr: NativePointer = Module.getExportByName(null, 'xpc_data_get_bytes_ptr');
const p_xpc_data_get_length: NativePointer = Module.getExportByName(null, 'xpc_data_get_length');
const p__CFBinaryPlistCreate15: NativePointer = Module.getExportByName(null, '__CFBinaryPlistCreate15');

export const xpcConnectionGetName: NativeFunction = new NativeFunction(p_xpc_connection_get_name, 'pointer', ['pointer']);
export const xpcDictionaryApply: NativeFunction = new NativeFunction(p_xpc_dictionary_apply, 'pointer', ['pointer', 'pointer']);
export const xpcGetType: NativeFunction = new NativeFunction(p_xpc_get_type, 'pointer', ['pointer']);
export const xpcDataGetBytesPtr: NativeFunction = new NativeFunction(p_xpc_data_get_bytes_ptr, 'pointer', ['pointer']);
export const xpcDataGetLength: NativeFunction = new NativeFunction(p_xpc_data_get_length, 'pointer', ['int']);
//See: https://opensource.apple.com/source/CF/CF-855.14/CFBinaryPList.c.auto.html
export const __CFBinaryPlistCreate15: NativeFunction=  new NativeFunction(p__CFBinaryPlistCreate15, 'pointer', ['pointer', 'number', 'pointer']);
