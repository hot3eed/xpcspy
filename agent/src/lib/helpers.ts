export function wildcardMatch(target: string, pattern: string): boolean {
    /**
     * Matches a wildcard pattern, .e.g. 'com.apple.*', with `target`.
     */

    pattern = pattern.replace('*', '\.\*');
    pattern = '\^' + pattern;
    let exp = new RegExp(pattern);
    return exp.test(target);
}

export function objcObjectDebugDesc(ptr: NativePointer) {
    return (new ObjC.Object(ptr)).toString();
}

export function isBPListData(bytesPtr: NativePointer): boolean {
    return bytesPtr.readCString(6) == 'bplist';
}