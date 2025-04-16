import type { MessageSendPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type MessageSendResponseMessage = WebSocketMessage<MessageSendPayload>;
