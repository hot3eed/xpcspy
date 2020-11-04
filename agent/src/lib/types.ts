export type SymbolicatedPointer = [string, NativePointer];

export enum FilterType {
    Incoming = 1 << 0,
    Outgoing = 1 << 1,
    All = Incoming | Outgoing
}
