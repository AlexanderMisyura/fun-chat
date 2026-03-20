import type { USER_EXTERNAL_LOGOUT } from '@constants';
import type { UserPayload, WebSocketMessage } from '@ts-types';

export type UserExternalLogoutResponseMessage = WebSocketMessage<
  typeof USER_EXTERNAL_LOGOUT,
  UserPayload
>;
