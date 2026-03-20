import type { MESSAGE_EDIT } from '@constants';
import type { MessageEditPayload, WebSocketMessage } from '@ts-types';

export type MessageEditMessage = WebSocketMessage<typeof MESSAGE_EDIT, MessageEditPayload>;
