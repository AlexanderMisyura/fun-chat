import type { MESSAGE_DELETE } from '@constants';
import type { MessageDeletePayload, WebSocketMessage } from '@ts-types';

export type MessageDeleteMessage = WebSocketMessage<typeof MESSAGE_DELETE, MessageDeletePayload>;
