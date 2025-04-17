import type { MESSAGE_DELIVER } from '@constants';
import type { MessageDeliverPayload, WebSocketMessage } from '@ts-types';

export type MessageDeliverMessage = WebSocketMessage<typeof MESSAGE_DELIVER, MessageDeliverPayload>;
