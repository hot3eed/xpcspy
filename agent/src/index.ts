import { setUp } from "./rpc/setup";


rpc.exports = {
	setUp: (os: string): void => setUp(os)
};
