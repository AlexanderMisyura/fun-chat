import type { User } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type UserLoginResponseMessage = WebSocketMessage<User>;
