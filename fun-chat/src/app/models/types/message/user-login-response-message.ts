import type { USER_LOGIN } from '@constants';
import type { UserPayload, WebSocketMessage } from '@ts-types';

export type UserLoginResponseMessage = WebSocketMessage<typeof USER_LOGIN, UserPayload>;
