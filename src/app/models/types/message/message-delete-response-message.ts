import type { MESSAGE_DELETE } from '@constants';
import type { MessageDeleteResponsePayload, WebSocketMessage } from '@ts-types';

export type MessageDeleteResponseMessage = WebSocketMessage<
  typeof MESSAGE_DELETE,
  MessageDeleteResponsePayload
>;
