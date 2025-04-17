import type { USER_LOGIN } from '@constants';
import type { UserLoginPayload, WebSocketMessage } from '@ts-types';

export type UserLoginMessage = WebSocketMessage<typeof USER_LOGIN, UserLoginPayload>;
