import type { USER_INACTIVE } from '@constants';
import type { WebSocketMessage } from '@ts-types';
export type UserInactiveMessage = WebSocketMessage<typeof USER_INACTIVE, null>;
