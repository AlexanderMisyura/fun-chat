import type { FetchMessageHistoryResponsePayload } from '@ts-types';
import type { WebSocketMessage } from '@ts-types';

export type FetchMessageHistoryResponseMessage =
  WebSocketMessage<FetchMessageHistoryResponsePayload>;
