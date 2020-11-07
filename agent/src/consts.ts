import { IFunctionPointer } from './lib/interfaces';
import { xpcConnectionSendMessage,
            xpcConnectionSendMessageWithReply,
            xpcConnectionSendMessageWithReplySync,
            xpcConnectionSendNotification } from './lib/systemFunctions';


export const outgoingXPCMessagesFunctionPointer: IFunctionPointer[] = [
    xpcConnectionSendMessage,
    xpcConnectionSendMessageWithReply,
    xpcConnectionSendMessageWithReplySync,
    xpcConnectionSendNotification    
]
