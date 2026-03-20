import deleteSvg from '@assets/img/delete.svg';
import editSvg from '@assets/img/edit.svg';
import BaseComponent from '@components/base-component';
import type Contact from '@components/contact/contact';
import { createSvgChunk } from '@components/create-svg-chunk';
import tag from '@components/utility-components';
import { MESSAGE_DELETE, MESSAGE_DELIVER, MESSAGE_EDIT, MESSAGE_READ } from '@constants';
import Controller from '@controller/controller';
import WebSocketService from '@services/websocket.service';
import machine from '@state-machine/machine';
import { CustomAppEvent } from '@ts-enums';
import type { Message, WebSocketResponseMessageUnion } from '@ts-types';
import { formatDate } from '@utils/format-date';
import { MESSAGE_STATUS, PARSED_MESSAGE, UNREAD } from 'src/app/constants/values';

import * as styles from './chat-message.module.scss';

const controller = Controller.instance;
const socket = WebSocketService.instance;

export default class ChatMessage extends BaseComponent<'li'> {
  private boundHandleSocketResponse = this.handleSocketResponse.bind(this);
  private unreadDivider: BaseComponent<'div'> = tag.div({
    classes: [styles.divider],
    text: UNREAD,
  });
  private isOwn: boolean = false;
  private text: BaseComponent<'p'> = tag.p({ classes: [styles.text] });
  private isEditedElement: BaseComponent<'span'> = tag.span({
    classes: [styles.notEdited],
    text: MESSAGE_STATUS.EDITED,
  });
  private isReadElement: BaseComponent<'span'> = tag.span({ text: MESSAGE_STATUS.SENT });
  private statusContainer: BaseComponent<'div'> = tag.div(
    { classes: [styles.statusContainer] },
    this.isEditedElement
  );
  private deleteButton: BaseComponent<'button'> | undefined;
  private editButton: BaseComponent<'button'> | undefined;

  constructor(
    public message: Message,
    private contact: Contact
  ) {
    super({
      elementTag: 'li',
      classes: [styles.message],
    });

    if (message.from === machine.context.username) {
      this.isOwn = true;
      this.addClasses(styles.ownMessage);
    }

    this.text.setText(message.text);

    this.appendChildren(
      this.unreadDivider,
      tag.div(
        { classes: [styles.header] },
        tag.p({
          classes: this.isOwn ? [styles.own, styles.name] : [styles.name],
          text: this.isOwn ? 'You:' : `${message.from}:`,
        }),
        tag.div({ text: formatDate(new Date(this.message.datetime)) })
      ),
      this.text,
      this.statusContainer
    );

    if (this.isOwn) {
      this.updateStatus();
      this.statusContainer.appendSingle(this.isReadElement);
    }

    this.appendButtonsContainer();

    this.addListeners();
  }

  public removeSelf(): void {
    socket.offMessage(PARSED_MESSAGE, this.boundHandleSocketResponse);
    super.removeSelf();
  }

  public markUnread(): void {
    this.unreadDivider.addClasses(styles.unread);
  }

  public markRead(): void {
    this.unreadDivider.removeClasses(styles.unread);
  }

  private appendButtonsContainer(): void {
    if (!this.isOwn) return;

    this.deleteButton = tag.button({
      classes: [styles.deleteButton, styles.messageButton, 'button'],
      onclick: () => this.deleteMessage(),
    });
    this.deleteButton.appendSingleSVG(createSvgChunk(deleteSvg, [styles.messageIcon]));

    this.editButton = tag.button({
      classes: [styles.messageButton, 'button'],
      onclick: () => this.prepareEdit(),
    });
    this.editButton.appendSingleSVG(createSvgChunk(editSvg, [styles.messageIcon]));

    this.appendSingle(
      tag.div({ classes: [styles.buttonsContainer] }, this.deleteButton, this.editButton)
    );
  }

  private prepareEdit(): void {
    this.getElement().dispatchEvent(
      new CustomEvent<Message>(CustomAppEvent.EDIT_MESSAGE, {
        detail: this.message,
        bubbles: true,
      })
    );
  }

  private deleteMessage(): void {
    controller.makeRequestDeleteMessage(this.message.id);
  }

  private updateStatus(): void {
    const { isDelivered, isEdited, isReaded } = this.message.status;

    if (isEdited) this.isEditedElement.removeClasses(styles.notEdited);

    if (isDelivered) {
      this.isReadElement.setText(MESSAGE_STATUS.DELIVERED);

      if (isReaded) this.isReadElement.setText(MESSAGE_STATUS.READ);
    }
  }

  private addListeners(): void {
    socket.onMessage(PARSED_MESSAGE, this.boundHandleSocketResponse);
  }

  private handleSocketResponse(message: WebSocketResponseMessageUnion): void {
    if (message.type === MESSAGE_READ && message.payload.message.id === this.message.id) {
      this.message.status.isReaded = true;

      if (message.id === null) {
        this.updateStatus();
      } else {
        this.contact.updateUnread();
        this.markRead();
      }
    }

    if (message.type === MESSAGE_DELETE && message.payload.message.id === this.message.id) {
      const OFFSET = 1;

      const messageIndex = this.contact.messages.findIndex(
        (message) => message.id === this.message.id
      );

      this.removeSelf();
      this.contact.messages.splice(messageIndex, OFFSET);
      this.contact.conversation?.checkNextUnread(this.message.id, messageIndex);
      this.contact.conversation?.checkMessagesEmpty();
      this.contact.updateUnread();
    }

    if (message.type === MESSAGE_DELIVER && message.payload.message.id === this.message.id) {
      this.message.status.isDelivered = true;
      this.updateStatus();
    }

    if (message.type === MESSAGE_EDIT && message.payload.message.id === this.message.id) {
      this.message.status.isEdited = true;
      this.text.setText(message.payload.message.text);
      this.updateStatus();
    }
  }
}
