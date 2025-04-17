import type { MESSAGE_DELIVER } from '@constants';
import type { MessageDeliverResponsePayload, WebSocketMessage } from '@ts-types';

export type MessageDeliverResponseMessage = WebSocketMessage<
  typeof MESSAGE_DELIVER,
  MessageDeliverResponsePayload
>;
