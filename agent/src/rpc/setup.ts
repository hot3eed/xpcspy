import { installHooks } from "../hooking";

export function setUp(os: string) {
   installHooks(os);
}
