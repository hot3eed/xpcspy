import { IFunctionPointer } from './lib/interfaces';
import { SystemFunctionsManager as SFM } from './lib/systemFunctionsManager';

const sharedSFM = SFM.sharedInstance();

export const outgoingXPCMessagesFunctionPointer: IFunctionPointer[] = [
    sharedSFM.xpcConnectionSendMessage,
    sharedSFM.xpcConnectionSendMessageWithReply,
    sharedSFM.xpcConnectionSendMessageWithReplySync,
    sharedSFM.xpcConnectionSendNotification    
]
