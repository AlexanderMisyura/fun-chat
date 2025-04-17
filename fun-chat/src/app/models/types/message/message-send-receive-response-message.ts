import type { MESSAGE_SEND } from '@constants';
import type { MessageResponsePayload, WebSocketMessage } from '@ts-types';

export type MessageSendReceiveResponseMessage = WebSocketMessage<
  typeof MESSAGE_SEND,
  MessageResponsePayload
>;
