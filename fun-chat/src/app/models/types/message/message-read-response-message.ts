import type { MESSAGE_READ } from '@constants';
import type { MessageReadResponsePayload, WebSocketMessage } from '@ts-types';

export type MessageReadResponseMessage = WebSocketMessage<
  typeof MESSAGE_READ,
  MessageReadResponsePayload
>;
