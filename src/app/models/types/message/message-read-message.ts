import type { MESSAGE_READ } from '@constants';
import type { MessageReadPayload, WebSocketMessage } from '@ts-types';

export type MessageReadMessage = WebSocketMessage<typeof MESSAGE_READ, MessageReadPayload>;
