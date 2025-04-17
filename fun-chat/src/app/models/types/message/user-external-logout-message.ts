import type { USER_EXTERNAL_LOGOUT } from '@constants';
import type { UserExternalLogoutPayload, WebSocketMessage } from '@ts-types';

export type UserExternalLogoutMessage = WebSocketMessage<
  typeof USER_EXTERNAL_LOGOUT,
  UserExternalLogoutPayload
>;
