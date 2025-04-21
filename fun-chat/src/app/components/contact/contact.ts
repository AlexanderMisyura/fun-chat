import eyeCloseSvg from '@assets/img/eye-close.svg';
import eyeOpenSvg from '@assets/img/eye-open.svg';
import BaseComponent from '@components/base-component';
import Conversation from '@components/conversation/conversation';
import { createSvgChunk } from '@components/create-svg-chunk';
import tag from '@components/utility-components';
import {
  FETCH_MESSAGE_HISTORY,
  PARSED_MESSAGE,
  USER_EXTERNAL_LOGIN,
  USER_EXTERNAL_LOGOUT,
} from '@constants';
import Controller from '@controller/controller';
import WebSocketService from '@services/websocket.service';
import machine from '@state-machine/machine';
import { CustomAppEvent } from '@ts-enums';
import type {
  FetchMessageHistoryResponseMessage,
  Message,
  User,
  WebSocketResponseMessageUnion,
} from '@ts-types';

import * as styles from './contact.module.scss';

const controller = Controller.instance;
const socket = WebSocketService.instance;

const ZERO_UNREAD_MESSAGES_NUMBER = 0;

export default class Contact extends BaseComponent<'li'> {
  public conversation: Conversation | undefined;
  public messages: Message[] = [];
  private isOnline: boolean = false;
  private unread: BaseComponent<'span'>;
  private status: BaseComponent<'div'>;

  constructor(public readonly user: User) {
    super({
      elementTag: 'li',
      classes: [styles.contact],
    });

    const nameContainer = tag.span({ text: this.user.login, classes: [styles.name] });

    this.unread = tag.span({ classes: [styles.unread, styles.noUnread] });

    this.status = tag.div({ classes: [styles.status] });
    this.status.appendSingleSVG(createSvgChunk(eyeOpenSvg, [styles.online]));
    this.status.appendSingleSVG(createSvgChunk(eyeCloseSvg, [styles.offline]));
    this.isOnline = this.user.isLogined;
    this.updateOnlineStatus();

    this.appendSingle(
      tag.div({ classes: [styles.container] }, nameContainer, this.unread, this.status)
    );

    controller.makeRequestFetchMessageHistory(this.user.login);
    this.addListeners();
  }

  public updateUnread(): void {
    const unreadNumber = this.messages.filter(
      (message) => !message.status.isReaded && message.to === machine.context.username
    ).length;

    if (unreadNumber === ZERO_UNREAD_MESSAGES_NUMBER) {
      this.unread.addClasses(styles.noUnread);
    } else {
      this.unread.setText(unreadNumber.toString());
      this.unread.removeClasses(styles.noUnread);
    }
  }

  private updateOnlineStatus(): void {
    if (this.conversation) this.conversation.correspondent.isLogined = this.isOnline;

    if (this.isOnline) this.status.addClasses(styles.isOnline);
    else this.status.removeClasses(styles.isOnline);
  }

  private addListeners(): void {
    socket.onMessage(PARSED_MESSAGE, (message: WebSocketResponseMessageUnion) => {
      if (message.type === USER_EXTERNAL_LOGIN && message.payload.user.login === this.user.login) {
        this.isOnline = message.payload.user.isLogined;
        this.updateOnlineStatus();
      }

      if (message.type === USER_EXTERNAL_LOGOUT && message.payload.user.login === this.user.login) {
        this.isOnline = message.payload.user.isLogined;
        this.updateOnlineStatus();
      }

      if (message.type === FETCH_MESSAGE_HISTORY && message.id === this.user.login)
        this.handleFetchMessageHistoryResponseMessage(message);
    });

    this.addListener('click', () => this.dispatchMessages());
  }

  private handleFetchMessageHistoryResponseMessage(
    message: FetchMessageHistoryResponseMessage
  ): void {
    this.messages = message.payload.messages;

    if (!this.conversation) {
      this.conversation = new Conversation({ user: this.user, messages: this.messages }, this);
    }

    this.updateUnread();
  }

  private dispatchMessages(): void {
    if (this.conversation) {
      this.getElement().dispatchEvent(
        new CustomEvent<Contact>(CustomAppEvent.DISPATCH_CONTACT, {
          detail: this,
          bubbles: true,
        })
      );
    }
  }
}
