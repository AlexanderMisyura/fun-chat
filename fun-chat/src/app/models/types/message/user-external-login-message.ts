import type { UserExternalLoginPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type UserExternalLoginMessage = WebSocketMessage<UserExternalLoginPayload>;
