import { IParsingResult } from '../lib/interfaces';
import { SystemFunctionsManager as SFM } from './systemFunctionsManager';
import { objcObjectDebugDesc } from '../lib/helpers';


export function parseBPlistKeysRecursively(xpcDict: NativePointer): IParsingResult[] {
    /**
     * Enumerates all an XPC dictionary's keys recrusively, and parses binary plists after detecting its format.
     */

    const result: IParsingResult[] = [];

    /**
     * An `xpc_dictionary_applier_t` block.
     * See: https://developer.apple.com/documentation/xpc/xpc_dictionary_applier_t
    */
     const impl = function(key: NativePointer, value: NativePointer): void {
         const valueType = objcObjectDebugDesc(<NativePointer>SFM.sharedInstance().xpcGetType.func(value));

         if (valueType == 'OS_xpc_dictionary') {
             parseBPlistKeysRecursively(value);
         } else if (valueType == 'OS_xpc_data') {
             const len = <number>SFM.sharedInstance().xpcDataGetLength.func(value);
             const bytesPtr = <NativePointer>SFM.sharedInstance().xpcDataGetBytesPtr.func(value);

             const bplistFmt = bytesPtr.readCString(8);  //See: http://newosxbook.com/bonus/bplist.pdf
             switch (bplistFmt) {
                 case 'bplist15':
                    const parsedBPlist = objcObjectDebugDesc(<NativePointer>SFM.sharedInstance().__CFBinaryPlistCreate15.func(bytesPtr, len, null));
                    result.push({
                                key: objcObjectDebugDesc(key), 
                                dataType: 'bplist15', 
                                data: parsedBPlist
                            });
                default:
                    console.log("Unimplemented bplist format!");
             }
         }
     }
     const block = new ObjC.Block({
         implementation: impl,
         retType: 'void',
         argTypes: ['pointer', 'pointer']
     });

     SFM.sharedInstance().xpcDictionaryApply.func(xpcDict, block.handle);

     return result;
}


function parseBPlist15(xpcDict: NativePointer): string {
	const impl = function (key: NativePointer, value: NativePointer): void {
		console.log("FUCK " + key.readCString());
	}
	const block = new ObjC.Block({implementation: impl, retType: 'void', argTypes: ['pointer', 'pointer']});
    SFM.sharedInstance().xpcDictionaryApply.func(xpcDict, block.handle);

    return '';
}
