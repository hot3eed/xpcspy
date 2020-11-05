import { FilterType } from "./types";

export interface IFilter {
    type: FilterType,
    connectionNamePattern: string
}

export interface IParsingResult {
    key: string,
    dataType: 'bplist00' | 'bplist15' | 'bplist16',
    data: string
}
