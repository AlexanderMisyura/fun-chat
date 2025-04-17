import type { USER_INACTIVE } from '@constants';
import type { UserInactivePayload, WebSocketMessage } from '@ts-types';

export type UserInactiveResponseMessage = WebSocketMessage<
  typeof USER_INACTIVE,
  UserInactivePayload
>;
