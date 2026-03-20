import type { USER_ACTIVE } from '@constants';
import type { UserArrayPayload, WebSocketMessage } from '@ts-types';

export type UserActiveResponseMessage = WebSocketMessage<typeof USER_ACTIVE, UserArrayPayload>;
