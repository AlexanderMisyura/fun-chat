import type { USER_LOGOUT } from '@constants';
import type { UserPayload, WebSocketMessage } from '@ts-types';

export type UserLogoutResponseMessage = WebSocketMessage<typeof USER_LOGOUT, UserPayload>;
