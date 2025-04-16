import type { UserLoginPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type UserLoginMessage = WebSocketMessage<UserLoginPayload>;
