import { IParsingResult, SupportedBPListFormat } from '../lib/interfaces';
import { objcObjectDebugDesc } from '../lib/helpers';
import { xpcGetType, 
        xpcDictionaryApply,
        __CFBinaryPlistCreate15, 
        xpcDataGetBytesPtr,
        xpcDataGetLength} from '../lib/systemFunctions';
import { resourceLimits } from 'worker_threads';

export function parseBPListKeysRecursively(
    connection: NativePointer,
    xpcDict: NativePointer
): IParsingResult[] {
    const objType = objcObjectDebugDesc(<NativePointer>xpcGetType.call(xpcDict));
    if (objType != 'OS_xpc_dictionary') { throw Error("Bad object type " + objType); }

    const parsingResult: IParsingResult[] = [];

    /**
     * See: https://developer.apple.com/documentation/xpc/1505404-xpc_dictionary_apply?language=objc
     */
    const block_impl = function(key: NativePointer, value: NativePointer): boolean {
        const valueType = objcObjectDebugDesc(<NativePointer>xpcGetType.call(value));
        switch (valueType) {
            case 'OS_xpc_dictionary':
                parsingResult.push(...parseBPListKeysRecursively(connection, value));
                break;
            case 'OS_xpc_data':
                const bytesPtr = <NativePointer>xpcDataGetBytesPtr.call(value);
                const format = bytesPtr.readCString(8);
                if (!format.startsWith("bplist")) {
                    break;
                }

                const length = xpcDataGetLength.call(value) as number;
                let result: IParsingResult;

                if (isKnownBPListData(format)) {
                    result = parseKnownBPList(bytesPtr, length);
                } else {
                    result = parseGenericBPList(connection, xpcDict);
                    result.format = format as SupportedBPListFormat;
                }

                result.key = key.readCString();
                parsingResult.push(result);
                break;
            default:
                break;
        }
        return true;
    }
    const applierBlock = new ObjC.Block({
        implementation: block_impl,
        retType: 'bool',
        argTypes: ['pointer', 'pointer']
    });

    xpcDictionaryApply.call(xpcDict, applierBlock.handle);

    return parsingResult;
}


function parseKnownBPList(
    bytesPtr: NativePointer,
    length: number
): IParsingResult {
    /**
     * Parse binary plist data after detecting its format
     */

    const bplistFmt = bytesPtr.readCString(8);
    if (bplistFmt == 'bplist15') {
        return {
            key: null,
            data: objcObjectDebugDesc(<NativePointer>__CFBinaryPlistCreate15.call(bytesPtr, length, ptr(0x0))),
            format: 'bplist15'
        }
    } else if (bplistFmt == 'bplist00') {
        return parseBPlist00(bytesPtr, length);
    }

    throw new Error("Unknown bplist format");
}

function parseGenericBPList(
    connection: NativePointer,
    message: NativePointer
): IParsingResult {
    const decoder = ObjC.classes.NSXPCDecoder.alloc().init();
    decoder["- set_connection:"](connection);
    decoder["- _startReadingFromXPCObject:"](message);

    /* TODO: return only the data object, let the user provide format and key */
    const result = {
        format: null,
        data: decoder.debugDescription(),
        key: null,
    };

    decoder.dealloc();
    return result;
}

function parseBPlist00(bytesPtr: NativePointer, length: number): IParsingResult {
    const data: NativePointer = ObjC.classes.NSData.dataWithBytes_length_(bytesPtr, length);
    const format: NativePointer = Memory.alloc(8);
    format.writeU64(0xaaaaaaaa);

    const plist = ObjC.classes.NSPropertyListSerialization.propertyListWithData_options_format_error_(data, 0, format, ptr(0x0));
    return {
        key: null,
        data: objcObjectDebugDesc(plist),
        format: 'bplist00'
    }
}

function isKnownBPListData(magic: string): boolean {
    return magic === "bplist00" || magic === "bplist15";
}
