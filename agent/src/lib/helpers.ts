import { format } from "path";
import { xpcDictionaryGetCount,
    xpcGetType, 
    xpcDataGetBytesPtr, 
    xpcDataGetLength, 
    xpcDictionaryApply
    } from './systemFunctions';

export function wildcardMatch(target: string, pattern: string): boolean {
    /**
     * Matches a wildcard pattern, .e.g. 'com.apple.*', with `target`.
     */

    pattern = pattern.replace('*', '\.\*');
    pattern = '\^' + pattern;
    let exp = new RegExp(pattern);
    return exp.test(target);
}

export function objcObjectDebugDesc_old(ptr: NativePointer) {
    return (new ObjC.Object(ptr)).toString();
}

/**
 * Enhanced debug printing. For XPC dicitionaries we print entire byte arrays instead of just the beginning. This enhances the output compared to the standard output by debugPrinting 
 * @param ptr Objective C Pointer 
 * @returns A debug string with all raw data contents 
 */
export function objcObjectDebugDesc(ptr: NativePointer) {
    // We enhance the debug description by actually printing complete data blobs as base64 instead of trimming the data when using the current implementation 

    let objcObject = new ObjC.Object(ptr);
    let className = objcObject.$className;  
    let outString = ""


    if (className === "OS_xpc_dictionary") {
        let entries = xpcDictionaryGetCount.call(objcObject); 

        if (entries > 0) {
            outString += debugDescriptionForXPCDictionary(objcObject, entries); 
        }else {
            outString += objcObject.toString(); 
        }
    }else {
        outString += objcObject.toString(); 
    }

    return outString;
}

export function debugDescriptionForXPCDictionary(xpcDict: ObjC.Object, count) {

    let outString = "<OS_xpc_dictionary> { count = " + count + " "; 
    outString += "contents = \n\t"

    /**
     * See: https://developer.apple.com/documentation/xpc/1505404-xpc_dictionary_apply?language=objc
     */
     const block_impl = function(key: NativePointer, value: NativePointer): boolean {
        const valueType = objcObjectDebugDesc(<NativePointer>xpcGetType.call(value));
        
        let keyString = key.readCString(); 
        outString += "\"" + keyString + "\" => "; 

        let objcValue = new ObjC.Object(value); 

        switch (valueType) {
            case 'OS_xpc_dictionary':
                let entriesCount = xpcDictionaryGetCount.call(value); 
                outString += debugDescriptionForXPCDictionary(objcValue, entriesCount); 
                break;
            case 'OS_xpc_data':
                const bytesPtr = <NativePointer>xpcDataGetBytesPtr.call(value);
                const length = <NativePointer>xpcDataGetLength.call(value); 
                let hexString = hexStringForBytes(bytesPtr,length); 
                // let hexString = "empty"; 
                outString += `<data> { length = ${length.valueOf()} bytes, contents = \n\t\t${hexString}\n\t\t}\n\t`; 
                break;
            default:
                outString += objcValue.toString() + "\n\t"; 
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

    outString += "\n}"

    return outString; 
}


export function objcDebugDescriptionNSData(data: ObjC.Object) {
    let dataBuffer = data.bytes(); 
    let length = data.length(); 

    if (!dataBuffer) {
        return "{length = " + length.valueOf() + " bytes, contents = empty}\n\t";
    }

    let hexString = hexStringForBytes(dataBuffer, length); 

    let outString = "{length = " + length.valueOf() + " bytes, contents = "
    outString += hexString.toString() + "}\n\t"

    return outString;
}

function hexStringForBytes(bytesPtr: NativePointer, length: Object) {
    const {NSMutableString} = ObjC.classes; 
    const {NSString} = ObjC.classes;
    let lenghtInt: number = <number> length.valueOf(); 
    let hexString = "";
    let formatString = "%02lx"
    for (let i = 0; i < length.valueOf(); i++ ) {
        let byte = bytesPtr.add(i); 
        let byteVal = byte.readU8();
        // send({
        //     'type': 'agent:debug', 
        //     message: `Byte at ${byte.toString()}, Value: ${byteVal}`
        // }) 
        let hex = Buffer.from([byteVal]).toString("hex");
        hexString += hex;
    } 

    return hexString; 
}



export function isSupportedBPListData(bytesPtr: NativePointer): boolean {
    const magic = bytesPtr.readCString(8);
    return magic == 'bplist00' || magic == 'bplist15'; 
}