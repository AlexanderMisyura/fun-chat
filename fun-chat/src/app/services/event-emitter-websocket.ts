import { PARSED_MESSAGE } from '@constants';
import { WebSocketEvent } from '@ts-enums';
import type { WebSocketResponseMessageUnion } from '@ts-types';
import Emitter from '@utils/event-emitter-generic';

export class EmitterWebSocketEvent extends Emitter<[Event, ...unknown[]]> {
  public eventsMap = {
    open: WebSocketEvent.OPEN,
    close: WebSocketEvent.CLOSE,
    message: WebSocketEvent.MESSAGE,
    error: WebSocketEvent.ERROR,
  } as const;
}

export class EmitterWebSocketMessage extends Emitter<[WebSocketResponseMessageUnion]> {
  public eventsMap = {
    PARSED_MESSAGE,
  } as const;
}
