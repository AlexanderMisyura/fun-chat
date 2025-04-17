import type { USER_LOGOUT } from '@constants';
import type { UserLogoutPayload, WebSocketMessage } from '@ts-types';

export type UserLogoutMessage = WebSocketMessage<typeof USER_LOGOUT, UserLogoutPayload>;
