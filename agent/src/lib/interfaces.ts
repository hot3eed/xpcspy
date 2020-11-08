import { FilterType } from "./types";

export interface IFilter {
    type: FilterType,
    connectionNamePattern: string
}

export interface IParsingResult {
    key: string | null,
    format: 'bplist00' | 'bplist15' | 'bplist16',
    data: string
}

/**
 * Use this instead of Frida's (naturally) expensive DebugSymbol lookup.
 */
export interface IFunctionPointer {
    name: string,
    ptr: NativePointer,
    call: NativeFunction
}