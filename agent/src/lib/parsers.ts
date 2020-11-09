import { IParsingResult } from '../lib/interfaces';
import { isBPListData, objcObjectDebugDesc } from '../lib/helpers';
import { xpcGetType, 
        xpcDictionaryApply,
        __CFBinaryPlistCreate15, 
        xpcDataGetBytesPtr,
        xpcDataGetLength} from '../lib/systemFunctions';
import { resourceLimits } from 'worker_threads';

export function parseBPListKeysRecursively(xpcDict: NativePointer): IParsingResult[] {
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
                parsingResult.push(...parseBPListKeysRecursively(value));
                break;
            case 'OS_xpc_data':
                const bytesPtr = <NativePointer>xpcDataGetBytesPtr.call(value);
                if (isBPListData(bytesPtr)) {
                    const length = <number>xpcDataGetLength.call(value);
                    const r = parseBPList(bytesPtr, length);
                    r.key = key.readCString();
                    parsingResult.push(r);
                }    
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


function parseBPList(bytesPtr: NativePointer, length: number): IParsingResult {
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
   } // Add bplist16 serialization
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