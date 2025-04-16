import type { UserLogoutPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type UserLogoutMessage = WebSocketMessage<UserLogoutPayload>;
