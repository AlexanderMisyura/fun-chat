import type { USER_LOGIN } from '@constants';
import type { UserLoginLogoutPayload, WebSocketMessage } from '@ts-types';

export type UserLoginMessage = WebSocketMessage<typeof USER_LOGIN, UserLoginLogoutPayload>;
