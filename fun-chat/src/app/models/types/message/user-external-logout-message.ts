import type { UserExternalLogoutPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type UserExternalLogoutMessage = WebSocketMessage<UserExternalLogoutPayload>;
