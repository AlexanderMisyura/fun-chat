import type { USER_LOGOUT } from '@constants';
import type { UserLoginLogoutPayload, WebSocketMessage } from '@ts-types';

export type UserLogoutMessage = WebSocketMessage<typeof USER_LOGOUT, UserLoginLogoutPayload>;
