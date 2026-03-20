import type { FETCH_MESSAGE_HISTORY } from '@constants';
import type { MessageArrayResponsePayload, WebSocketMessage } from '@ts-types';

export type FetchMessageHistoryResponseMessage = WebSocketMessage<
  typeof FETCH_MESSAGE_HISTORY,
  MessageArrayResponsePayload
>;
