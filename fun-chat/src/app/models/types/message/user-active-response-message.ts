import type { UserActivePayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type UserActiveResponseMessage = WebSocketMessage<UserActivePayload>;
