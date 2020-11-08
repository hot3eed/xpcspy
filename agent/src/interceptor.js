/**
 * TODO:
 * 	- (DONE) Synchronize messages between Frida script and server.
 * 	- (DONE) Add different non-exported function pointers for different OS's.
 *  - (DONE) Add attaching to PID.
 * 	- (DONE) Add incoming and outgoing messages filter.
 * 	- (DONE) Add service filter by name.
 * 	- (DONE) Refactor systemsFunctionsManager module.
 *  	- Use wrappers instead of having to cast each time?
 * 	- Handle peer connection. (They have no name)
 * 	- Add service filter by PID.
 * 	- Add XPC event handler backtrace viewer.
 * 	- (DONE) Add formatting.
 *  - (PARTIALLY DONE) Add data serializers.
 *  - Add nice logging messages.
 *  - Add option to output to file.
 * 
*/


/*
 * Sending messages
*/
var p_xpc_connection_send_message = Module.getExportByName(null, "xpc_connection_send_message");
var p_xpc_connection_send_message_with_reply = Module.getExportByName(null, "xpc_connection_send_message_with_reply");
var p_xpc_connection_send_message_with_reply_sync = Module.getExportByName(null, "xpc_connection_send_message_with_reply_sync");
var p_xpc_connection_send_notification = Module.getExportByName(null, "xpc_connection_send_notification");

/*
 * Receiving messages
*/

/* for iOS
var p_xpc_data_set_value = Module.getExportByName(null, "_xpc_data_set_value");  // This is the nearest global symbol to the one we're hooking, as of iOS 13.6
var p_xpc_connection_call_event_handler = p_xpc_data_set_value.sub(0xBFC);
*/

var p_xpc_connection_suspend = Module.getExportByName(null, "xpc_connection_suspend");
var p_xpc_connection_call_event_handler = p_xpc_connection_suspend.add(0x3B);

var _onEnterHandler = function(symbol, args) {
	const ts = Date.now();  // Resolution isn't 
	
	/*
	 * Send a message to the application as soon as a new function is traced,
	 * then collect/parse data (connection & dict objects, etc.) and send them to the app.
	 * The app then will output full invocation data in sync, using the timestamp.
	*/
	send({
		type: 'agent:trace:symbol',
		message: {timestamp: ts, symbol: symbol}
	});
	
	var p_connection = new NativePointer(args[0]);	
	var p_xdict = new NativePointer(args[1]);
	
	send({
		type: 'agent:trace:data',
		message: 
		{
			timestamp: ts, 
			data: { conn: ObjC.Object(p_connection).debugDescription().toString(), message: ObjC.Object(p_xdict).debugDescription().toString()  } 
		}
	});
}


Interceptor.attach(p_xpc_connection_send_message, {
	onEnter: function(args) {
		_onEnterHandler("xpc_connection_send_message", args);
	}
});

Interceptor.attach(p_xpc_connection_send_message_with_reply, {
	onEnter: function(args) {
		_onEnterHandler("xpc_connection_send_message_with_reply", args);
	}
});

Interceptor.attach(p_xpc_connection_send_message_with_reply_sync, {
	onEnter: function(args) {
		_onEnterHandler("xpc_connection_send_message_with_reply", args);
	}
});
Interceptor.attach(p_xpc_connection_send_notification, {
	onEnter: function(args) {
		_onEnterHandler("xpc_connection_send_notification", args);
	}
});

Interceptor.attach(p_xpc_connection_call_event_handler, {
	onEnter: function(args) {
		_onEnterHandler("_xpc_connection_call_event_handler", args);
	}
});
