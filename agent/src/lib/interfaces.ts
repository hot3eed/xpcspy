import { FilterType } from "./types";

export interface IFilter {
    type: FilterType,
    connectionNamePattern: string
}
