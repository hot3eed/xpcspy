import { IFunctionPointer } from './interfaces';
import { functionPointers as macOSFunctionPointers } from '../macos/symbols';
import { functionPointers as iOSFunctionPointers } from '../ios/symbols';

const libXPCDylib = 'libxpc.dylib';

export class SystemFunctionsManager {
    public static test(): number {
        return 6;
    }
    private static _singleton: SystemFunctionsManager;
    
    private readonly p_xpc_connection_get_name = Module.getExportByName(libXPCDylib, 'xpc_connection_get_name');
    private readonly p_xpc_dictionary_apply = Module.getExportByName(libXPCDylib, 'xpc_dictionary_apply');
    private readonly p_xpc_get_type = Module.getExportByName(libXPCDylib, 'xpc_get_type');
    private readonly p_xpc_data_get_bytes_ptr = Module.getExportByName(libXPCDylib, 'xpc_data_get_bytes_ptr');
    private readonly p_xpc_data_get_length = Module.getExportByName(libXPCDylib, 'xpc_data_get_length');
    private readonly p_xpc_connection_send_message = Module.getExportByName(libXPCDylib, 'xpc_connection_send_message');
    private readonly p_xpc_connection_send_message_with_reply = Module.getExportByName(libXPCDylib, 'xpc_connection_send_message_with_reply');
    private readonly p_xpc_connection_send_message_with_reply_sync = Module.getExportByName(libXPCDylib, 'xpc_connection_send_message_with_reply_sync');
    private readonly p_xpc_connection_send_notification = Module.getExportByName(libXPCDylib, 'xpc_connection_send_notification');

    private ___xpc_Connection_call_event_handler: IFunctionPointer;
    private ___CFBinaryPlistCreate15: IFunctionPointer;

    private _nonExportedFunctionsLoaded: boolean = false;
    
    private constructor() {}

    public static sharedInstance(): SystemFunctionsManager {
        if (!SystemFunctionsManager._singleton) {
            SystemFunctionsManager._singleton = new SystemFunctionsManager();
        }

        return SystemFunctionsManager._singleton;
    }

    /**
     * OS-independent symbols.
     */
    public readonly xpcConnectionGetName: IFunctionPointer = {
        name: 'xpc_connection_get_name',
        ptr: this.p_xpc_connection_get_name,
        func: new NativeFunction(this.p_xpc_connection_get_name, 'pointer', ['pointer'])
    };

    public readonly xpcDictionaryApply: IFunctionPointer = {
        name: 'xpc_dictionary_apply',
        ptr: this.p_xpc_dictionary_apply,
        func: new NativeFunction(this.p_xpc_dictionary_apply, 'pointer', ['pointer', 'pointer'])
    };

    public readonly xpcGetType: IFunctionPointer = {
        name: 'xpc_get_type',
        ptr: this.p_xpc_get_type,
        func: new NativeFunction(this.p_xpc_get_type, 'pointer', ['pointer'])
    };

    public readonly xpcDataGetBytesPtr: IFunctionPointer = {
        name: 'xpc_data_get_bytes_ptr',
        ptr: this.p_xpc_data_get_bytes_ptr,
        func: new NativeFunction(this.p_xpc_data_get_bytes_ptr, 'pointer', ['pointer'])
    };

    public readonly xpcDataGetLength: IFunctionPointer = {
        name: 'xpc_data_get_length',
        ptr: this.p_xpc_data_get_length,
        func: new NativeFunction(this.p_xpc_data_get_length, 'pointer', ['int'])
    };

    public readonly xpcConnectionSendMessage: IFunctionPointer = {
        name: 'xpc_connection_send_message',
        ptr: this.p_xpc_connection_send_message,
        func: new NativeFunction(this.p_xpc_connection_send_message, 'void', ['pointer', 'pointer'])
    }

    public readonly xpcConnectionSendMessageWithReply: IFunctionPointer = {
        name: 'xpc_connection_send_message_with_reply',
        ptr: this.p_xpc_connection_send_message_with_reply,
        func: new NativeFunction(this.p_xpc_connection_send_message_with_reply, 'void', ['pointer', 'pointer', 'pointer', 'pointer'])
    }

    public readonly xpcConnectionSendMessageWithReplySync: IFunctionPointer = {
        name: 'xpc_connection_send_message_with_reply_sync',
        ptr: this.p_xpc_connection_send_message_with_reply_sync,
        func: new NativeFunction(this.p_xpc_connection_send_message_with_reply_sync, 'void', ['pointer', 'pointer', 'pointer', 'pointer'])
    }

    public readonly xpcConnectionSendNotification: IFunctionPointer = {
        name: 'xpc_connection_send_notification',
        ptr: this.p_xpc_connection_send_notification,
        func: new NativeFunction(this.p_xpc_connection_send_notification, 'void', ['pointer', 'pointer'])
    }

    /**
     * OS-dependent symbols.
     */
    public get xpcConnectionCallEventHandler(): IFunctionPointer {
        return this.___xpc_Connection_call_event_handler;
    }

    public get __CFBinaryPlistCreate15(): IFunctionPointer {
        return this.___CFBinaryPlistCreate15;
    }

    public loadOSNonExportedSymbols(os: string) {
        if (this._nonExportedFunctionsLoaded) {
            return;
        }

        if (os == 'ios') {
            this.___xpc_Connection_call_event_handler = iOSFunctionPointers.get_xpc_connection_call_event_handler();
        } else if (os == 'macos') {
            this.___xpc_Connection_call_event_handler = macOSFunctionPointers.get_xpc_connection_call_event_handler();
            this.___CFBinaryPlistCreate15 = macOSFunctionPointers.get__CFBinaryPlistCreate15();
        } else {
            throw Error("Unsupported platform/OS");
        }

        this._nonExportedFunctionsLoaded = true;
    }    
}
