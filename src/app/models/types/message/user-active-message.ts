import type { USER_ACTIVE } from '@constants';
import type { WebSocketMessage } from '@ts-types';

export type UserActiveMessage = WebSocketMessage<typeof USER_ACTIVE, null>;
