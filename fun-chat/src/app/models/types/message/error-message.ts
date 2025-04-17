import type { ERROR } from '@constants';
import type { ErrorPayload, WebSocketMessage } from '@ts-types';

export type ErrorMessage = WebSocketMessage<typeof ERROR, ErrorPayload>;
