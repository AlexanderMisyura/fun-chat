import type { FetchMessageHistoryPayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type FetchMessageHistoryMessage = WebSocketMessage<FetchMessageHistoryPayload>;
