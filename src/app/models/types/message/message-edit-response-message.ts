import type { MESSAGE_EDIT } from '@constants';
import type { MessageEditResponsePayload, WebSocketMessage } from '@ts-types';

export type MessageEditResponseMessage = WebSocketMessage<
  typeof MESSAGE_EDIT,
  MessageEditResponsePayload
>;
