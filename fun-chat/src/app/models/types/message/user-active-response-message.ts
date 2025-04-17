import type { USER_ACTIVE } from '@constants';
import type { UserActivePayload, WebSocketMessage } from '@ts-types';

export type UserActiveResponseMessage = WebSocketMessage<typeof USER_ACTIVE, UserActivePayload>;
