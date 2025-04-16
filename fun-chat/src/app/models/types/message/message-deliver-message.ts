import type { MessageDeliverPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type MessageDeliverMessage = WebSocketMessage<MessageDeliverPayload>;
