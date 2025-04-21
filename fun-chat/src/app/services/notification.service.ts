import Modal from '@components/modal/modal';
import Preloader from '@components/preloader/preloader';
import tag from '@components/utility-components';
import { ERROR, PARSED_MESSAGE, USER_LOGIN, USER_LOGOUT } from '@constants';
import { WebSocketEvent } from '@ts-enums';
import type { WebSocketResponseMessageUnion } from '@ts-types';

import WebSocketService from './websocket.service';

const websocket = WebSocketService.instance;

const modal = new Modal();

export default class NotificationService {
  private static _instance: NotificationService | undefined;

  private constructor() {
    this.addListeners();
  }

  public static get instance(): NotificationService {
    if (!NotificationService._instance) {
      NotificationService._instance = new NotificationService();
    }

    return NotificationService._instance;
  }

  public showMessage(message: string): void {
    modal.showModal(tag.p({ text: message }), { isCloseButton: false, isCloseOnClickWithin: true });
  }

  public showPreloader(message?: string): void {
    modal.showModal(new Preloader(message), { canBeClosed: false, isCloseButton: false });
  }

  public forceClose(): void {
    modal.unLock();
    modal.closeModal();
  }

  private addListeners(): void {
    websocket.onEvent(WebSocketEvent.OPEN, () => this.forceClose());
    websocket.onEvent(WebSocketEvent.CLOSE, () => this.showPreloader());
    websocket.onMessage(PARSED_MESSAGE, (message: WebSocketResponseMessageUnion) => {
      if (message.type === ERROR) {
        this.forceClose();
        this.showMessage(message.payload.error);
      }

      if (message.type === USER_LOGIN) this.forceClose();

      if (message.type === USER_LOGOUT) this.forceClose();
    });
  }
}
