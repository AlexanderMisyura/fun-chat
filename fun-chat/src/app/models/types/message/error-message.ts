import type { ErrorPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type ErrorMessage = WebSocketMessage<ErrorPayload>;
