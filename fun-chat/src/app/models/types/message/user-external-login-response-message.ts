import type { USER_EXTERNAL_LOGIN } from '@constants';
import type { UserPayload, WebSocketMessage } from '@ts-types';

export type UserExternalLoginResponseMessage = WebSocketMessage<
  typeof USER_EXTERNAL_LOGIN,
  UserPayload
>;
