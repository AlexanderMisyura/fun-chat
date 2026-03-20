import type { USER_INACTIVE } from '@constants';
import type { UserArrayPayload, WebSocketMessage } from '@ts-types';

export type UserInactiveResponseMessage = WebSocketMessage<typeof USER_INACTIVE, UserArrayPayload>;
