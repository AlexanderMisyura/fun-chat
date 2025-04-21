import closeSvg from '@assets/img/close.svg';
import eyeCloseSvg from '@assets/img/eye-close.svg';
import eyeOpenSvg from '@assets/img/eye-open.svg';
import BaseComponent from '@components/base-component';
import type Conversation from '@components/conversation/conversation';
import { createSvgChunk } from '@components/create-svg-chunk';
import tag from '@components/utility-components';
import { PARSED_MESSAGE, USER_EXTERNAL_LOGIN, USER_EXTERNAL_LOGOUT, USER_LOGOUT } from '@constants';
import WebSocketService from '@services/websocket.service';
import { CustomAppEvent } from '@ts-enums';
import type { WebSocketResponseMessageUnion } from '@ts-types';

import * as styles from './message-panel.module.scss';

const socket = WebSocketService.instance;

export default class MessagePanel extends BaseComponent<'div'> {
  private conversation: Conversation | undefined;
  private noContactView: BaseComponent<'p'> = tag.p({
    classes: [styles.noContactView],
    text: 'No contact selected',
  });
  private login: string = '';
  private isOnline: boolean = false;
  private name: BaseComponent<'div'> = tag.div({ classes: [styles.name] });
  private status: BaseComponent<'div'> = tag.div({ classes: [styles.status] });
  private info: BaseComponent<'div'> = tag.div({ classes: [styles.info] }, this.name, this.status);
  private closeButton: BaseComponent<'button'>;

  constructor() {
    super({
      elementTag: 'div',
      classes: [styles.panel],
    });

    this.status.appendSingleSVG(createSvgChunk(eyeOpenSvg, [styles.online]));
    this.status.appendSingleSVG(createSvgChunk(eyeCloseSvg, [styles.offline]));

    this.closeButton = tag.button({
      classes: ['button', styles.closeButton],
      onclick: () => this.closeConversation(),
    });
    this.closeButton.appendSingleSVG(createSvgChunk(closeSvg, [styles.closeIcon]));

    this.appendChildren(this.noContactView);

    this.addListeners();
  }

  public handleListOpened(): void {
    this.addClasses(styles.listIsOpen);
  }

  public handleListClosed(): void {
    this.removeClasses(styles.listIsOpen);
  }

  public openConversation(conversation: Conversation): void {
    if (this.conversation) this.conversation.areMessagesRead = false;

    this.login = conversation.correspondent.login;
    this.isOnline = conversation.correspondent.isLogined;
    this.conversation = conversation;

    this.getElement().replaceChildren();
    this.noContactView.removeSelf();
    this.name.setText(this.login);
    this.updateOnlineStatus();
    this.appendChildren(conversation, this.info, this.closeButton);
    conversation.scroll();
  }

  public closeConversation(): void {
    this.getElement().replaceChildren();
    this.appendSingle(this.noContactView);
    this.login = '';
    this.isOnline = false;

    this.getElement().dispatchEvent(
      new CustomEvent(CustomAppEvent.RESET_CONTACT, { bubbles: true })
    );
  }

  private updateOnlineStatus(): void {
    if (this.isOnline) this.status.addClasses(styles.isOnline);
    else this.status.removeClasses(styles.isOnline);
  }

  private addListeners(): void {
    socket.onMessage(PARSED_MESSAGE, (message: WebSocketResponseMessageUnion) => {
      if (message.type === USER_EXTERNAL_LOGIN && message.payload.user.login === this.login) {
        this.isOnline = message.payload.user.isLogined;
        this.updateOnlineStatus();
      }

      if (message.type === USER_EXTERNAL_LOGOUT && message.payload.user.login === this.login) {
        this.isOnline = message.payload.user.isLogined;
        this.updateOnlineStatus();
      }

      if (message.type === USER_LOGOUT) {
        this.closeConversation();
      }
    });

    socket.onEvent(socket.eventsMapEvent.error, () => this.closeConversation());
    socket.onEvent(socket.eventsMapEvent.close, () => this.closeConversation());
  }
}
