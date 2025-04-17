import type { USER_EXTERNAL_LOGIN } from '@constants';
import type { UserExternalLoginPayload, WebSocketMessage } from '@ts-types';

export type UserExternalLoginMessage = WebSocketMessage<
  typeof USER_EXTERNAL_LOGIN,
  UserExternalLoginPayload
>;
