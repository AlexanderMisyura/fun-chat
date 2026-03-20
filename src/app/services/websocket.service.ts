import config from '@config';
import type { PARSED_MESSAGE } from '@constants';
import type { WebSocketEvent } from '@ts-enums';
import type { WebSocketBaseMessage, WebSocketResponseMessageUnion } from '@ts-types';
import { parseJSONData } from '@utils/parse-json-data';

import { EmitterWebSocketEvent, EmitterWebSocketMessage } from './event-emitter-websocket';
import Validator from './validator.service';

export default class WebSocketService {
  private static _instance: WebSocketService | undefined;
  public readonly eventsMapEvent: EmitterWebSocketEvent['eventsMap'];
  public readonly eventsMapParsedMessage: EmitterWebSocketMessage['eventsMap'];
  private emitterEvent: EmitterWebSocketEvent = new EmitterWebSocketEvent();
  private emitterParsedMessage: EmitterWebSocketMessage = new EmitterWebSocketMessage();
  private connection: WebSocket | undefined = undefined;
  private reconnectDelay: number = config.RECONNECT_DELAY;
  private boundHandleOpen: (event: Event) => void;
  private boundHandleClose: (event: CloseEvent) => void;
  private boundHandleMessage: (event: MessageEvent<string>) => void;
  private boundHandleError: (event: Event) => void;

  private constructor() {
    this.eventsMapEvent = this.emitterEvent.eventsMap;
    this.eventsMapParsedMessage = this.emitterParsedMessage.eventsMap;
    this.boundHandleOpen = this.handleOpen.bind(this);
    this.boundHandleClose = this.handleClose.bind(this);
    this.boundHandleMessage = this.handleMessage.bind(this);
    this.boundHandleError = this.handleError.bind(this);
  }

  public static get instance(): WebSocketService {
    if (!WebSocketService._instance) {
      WebSocketService._instance = new WebSocketService();
    }

    return WebSocketService._instance;
  }

  public openConnection(): void {
    if (this.checkConnectionOpen())
      throw new Error('Cannot open connection. Connection is already open');

    this.connection = new WebSocket(config.API_URL);
    this.addListeners();
  }

  public checkConnectionOpen(): boolean {
    return this.connection?.readyState === WebSocket.OPEN;
  }

  public closeConnection(): void {
    if (!this.checkConnectionOpen())
      throw new Error('Cannot close connection. Connection is already closed');

    this.removeListeners();
    this.connection?.close();
    this.connection = undefined;
  }

  public send(data: string): void {
    if (!this.checkConnectionOpen()) throw new Error('Cannot send message. Connection is not open');

    this.connection?.send(data);
  }

  public onEvent(event: WebSocketEvent, callback: () => void): void {
    this.emitterEvent.on(event, callback);
  }

  public offEvent(event: WebSocketEvent, callback: () => void): void {
    this.emitterEvent.off(event, callback);
  }

  public onMessage(
    event: typeof PARSED_MESSAGE,
    callback: (message: WebSocketResponseMessageUnion) => void
  ): void {
    this.emitterParsedMessage.on(event, callback);
  }

  public offMessage(
    event: typeof PARSED_MESSAGE,
    callback: (message: WebSocketResponseMessageUnion) => void
  ): void {
    this.emitterParsedMessage.off(event, callback);
  }

  private reconnect(): void {
    if (this.checkConnectionOpen()) throw new Error('Cannot reconnect. Connection is already open');

    setTimeout(() => {
      this.openConnection();
    }, this.reconnectDelay);
  }

  private addListeners(): void {
    this.connection?.addEventListener('open', this.boundHandleOpen);
    this.connection?.addEventListener('close', this.boundHandleClose);
    this.connection?.addEventListener('message', this.boundHandleMessage);
    this.connection?.addEventListener('error', this.boundHandleError);
  }

  private removeListeners(): void {
    this.connection?.removeEventListener('open', this.boundHandleOpen);
    this.connection?.removeEventListener('close', this.boundHandleClose);
    this.connection?.removeEventListener('message', this.boundHandleMessage);
    this.connection?.removeEventListener('error', this.boundHandleError);
  }

  private handleOpen(event: Event): void {
    this.emitterEvent.emit(this.eventsMapEvent.open, event);
  }

  private handleClose(event: CloseEvent): void {
    this.emitterEvent.emit(this.eventsMapEvent.close, event);
    this.reconnect();
  }

  private handleMessage(event: MessageEvent<string>): void {
    const baseMessage = parseJSONData<WebSocketBaseMessage>(
      event.data,
      Validator.instance.isWebSocketBaseMessage.bind(Validator.instance)
    );

    if (!baseMessage) return;

    const typedMessage = Validator.instance.getValidatedWebSocketResponseMessageUnion(baseMessage);

    if (!typedMessage) return;

    this.emitterParsedMessage.emit(this.eventsMapParsedMessage.PARSED_MESSAGE, typedMessage);
    this.emitterEvent.emit(this.eventsMapEvent.message, event);
  }

  private handleError(event: Event): void {
    this.emitterEvent.emit(this.eventsMapEvent.error, event);
  }
}
