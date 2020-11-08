import { setUp } from "./rpc/setup";
import { IFilter } from './lib/interfaces';


rpc.exports = {
	setUp: (os: string, filter: IFilter, shouldParse: boolean): void => setUp(os, filter, shouldParse),
};
