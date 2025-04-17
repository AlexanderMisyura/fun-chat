import type { MESSAGE_SEND } from '@constants';
import type { MessageSendResponsePayload, WebSocketMessage } from '@ts-types';

export type MessageSendResponseMessage = WebSocketMessage<
  typeof MESSAGE_SEND,
  MessageSendResponsePayload
>;
