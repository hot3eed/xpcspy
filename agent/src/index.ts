import { setUp } from "./rpc/setup";
import { IFilter } from './lib/interfaces';


rpc.exports = {
	setUp: (os: string, filter: IFilter): void => setUp(os, filter)
};
