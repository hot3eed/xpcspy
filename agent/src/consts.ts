export namespace consts {

	export const publicXPCSymbols: string[] = [
		'xpc_connection_send_message',
		'xpc_connection_send_message_with_reply',
		'xpc_connection_send_message_with_reply_sync',
		'xpc_connection_send_notification'
	];

	/**
	 * The offset in the `OS_xpc_connection` object/struct.
	 */
	export const offsetConnectionName: number = 0xc0;
}
