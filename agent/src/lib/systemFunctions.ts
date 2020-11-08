import { IFunctionPointer } from './interfaces';

const libXPCDylib = 'libxpc.dylib';

const p_xpc_connection_get_name = Module.getExportByName(libXPCDylib, 'xpc_connection_get_name');
const p_xpc_dictionary_apply = Module.getExportByName(libXPCDylib, 'xpc_dictionary_apply');
const p_xpc_get_type = Module.getExportByName(libXPCDylib, 'xpc_get_type');
const p_xpc_data_get_bytes_ptr = Module.getExportByName(libXPCDylib, 'xpc_data_get_bytes_ptr');
const p_xpc_data_get_length = Module.getExportByName(libXPCDylib, 'xpc_data_get_length');
const p_xpc_connection_send_message = Module.getExportByName(libXPCDylib, 'xpc_connection_send_message');
const p_xpc_connection_send_message_with_reply = Module.getExportByName(libXPCDylib, 'xpc_connection_send_message_with_reply');
const p_xpc_connection_send_message_with_reply_sync = Module.getExportByName(libXPCDylib, 'xpc_connection_send_message_with_reply_sync');
const p_xpc_connection_send_notification = Module.getExportByName(libXPCDylib, 'xpc_connection_send_notification');
const p__xpc_Connection_call_event_handler = DebugSymbol.fromName('_xpc_connection_call_event_handler').address;
const p___CFBinaryPlistCreate15 = DebugSymbol.fromName('__CFBinaryPlistCreate15').address;


export const xpcConnectionGetName: IFunctionPointer = {
    name: 'xpc_connection_get_name',
    ptr: p_xpc_connection_get_name,
    call: new NativeFunction(p_xpc_connection_get_name, 'pointer', ['pointer'])
};

export const xpcDictionaryApply: IFunctionPointer = {
    name: 'xpc_dictionary_apply',
    ptr: p_xpc_dictionary_apply,
    call: new NativeFunction(p_xpc_dictionary_apply, 'pointer', ['pointer', 'pointer'])
};

export const xpcGetType: IFunctionPointer = {
    name: 'xpc_get_type',
    ptr: p_xpc_get_type,
    call: new NativeFunction(p_xpc_get_type, 'pointer', ['pointer'])
};

export const xpcDataGetBytesPtr: IFunctionPointer = {
    name: 'xpc_data_get_bytes_ptr',
    ptr: p_xpc_data_get_bytes_ptr,
    call: new NativeFunction(p_xpc_data_get_bytes_ptr, 'pointer', ['pointer'])
};

export const xpcDataGetLength: IFunctionPointer = {
    name: 'xpc_data_get_length',
    ptr: p_xpc_data_get_length,
    call: new NativeFunction(p_xpc_data_get_length, 'uint32', ['pointer'])
};

export const xpcConnectionSendMessage: IFunctionPointer = {
    name: 'xpc_connection_send_message',
    ptr: p_xpc_connection_send_message,
    call: new NativeFunction(p_xpc_connection_send_message, 'void', ['pointer', 'pointer'])
}

export const xpcConnectionSendMessageWithReply: IFunctionPointer = {
    name: 'xpc_connection_send_message_with_reply',
    ptr: p_xpc_connection_send_message_with_reply,
    call: new NativeFunction(p_xpc_connection_send_message_with_reply, 'void', ['pointer', 'pointer', 'pointer', 'pointer'])
}

export const xpcConnectionSendMessageWithReplySync: IFunctionPointer = {
    name: 'xpc_connection_send_message_with_reply_sync',
    ptr: p_xpc_connection_send_message_with_reply_sync,
    call: new NativeFunction(p_xpc_connection_send_message_with_reply_sync, 'void', ['pointer', 'pointer', 'pointer', 'pointer'])
}

export const xpcConnectionSendNotification: IFunctionPointer = {
    name: 'xpc_connection_send_notification',
    ptr: p_xpc_connection_send_notification,
    call: new NativeFunction(p_xpc_connection_send_notification, 'void', ['pointer', 'pointer'])
}

export const xpcConnectionCallEventHandler: IFunctionPointer = {
    name: '_xpc_connection_call_event_handler',
    ptr: p__xpc_Connection_call_event_handler,
    call: new NativeFunction(p__xpc_Connection_call_event_handler, 'void', ['pointer', 'pointer'])
}

export const __CFBinaryPlistCreate15: IFunctionPointer = {
    name: '__CFBinaryPlistCreate15',
    ptr: p___CFBinaryPlistCreate15,
    call: new NativeFunction(p___CFBinaryPlistCreate15, 'pointer', ['pointer', 'uint64', 'pointer'])
}
