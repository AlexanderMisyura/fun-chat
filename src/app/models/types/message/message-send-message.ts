import type { MESSAGE_SEND } from '@constants';
import type { MessageSendPayload, WebSocketMessage } from '@ts-types';

export type MessageSendMessage = WebSocketMessage<typeof MESSAGE_SEND, MessageSendPayload>;
