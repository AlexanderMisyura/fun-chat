import type { FETCH_MESSAGE_HISTORY } from '@constants';
import type { FetchMessageHistoryPayload, WebSocketMessage } from '@ts-types';

export type FetchMessageHistoryMessage = WebSocketMessage<
  typeof FETCH_MESSAGE_HISTORY,
  FetchMessageHistoryPayload
>;
