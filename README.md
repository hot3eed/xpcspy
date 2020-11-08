# xpc-spy - Bidirectional XPC message interception and more

## Features:
* Bidirectional XPC messages interception.
* iOS and macOS support.
* `bplist00`, and the infamous `bplist15` [deserialization].
* Filter by message direction (incoming or outgoing) and service name.
* More to come?

## TODO:
* Add support for `bplist16`.
* Deserialize data within the parsed `bplist`s recursively.
* Improve script loading performance, kinda slow for some reason.
* Add an option to get the address, perhaps ASLR adjusted, for the XPC event handler, by spawning the process and hooking `xpc_connection_set_event_handler`.
* Add fancy colors.
* More pretty printing?

## FAQ 
* Why are you reinventing the [wheel]?
    * XPoCE doesn't intercept incoming messages, and doesn't support `bplist00` or `bplist15`. Plus, why not? It's a learning experience.


[wheel]: http://newosxbook.com/tools/XPoCe2.html
[deserialization]: http://newosxbook.com/bonus/bplist.pdf