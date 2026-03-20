import BaseComponent from '@components/base-component';
import ChatMessage from '@components/chat-message/chat-message';
import type Contact from '@components/contact/contact';
import tag from '@components/utility-components';
import { DEBOUNCE_TIMEOUT, MESSAGE_SEND, PARSED_MESSAGE, ZERO_LENGTH } from '@constants';
import Controller from '@controller/controller';
import WebSocketService from '@services/websocket.service';
import machine from '@state-machine/machine';
import type {
  Message,
  MessageSendReceiveResponseMessage,
  User,
  UserMessage,
  WebSocketResponseMessageUnion,
} from '@ts-types';
import { eventDebounceWrapper } from '@utils/debounce-wrapper';

import * as styles from './conversation.module.scss';

const controller = Controller.instance;
const socket = WebSocketService.instance;

export default class Conversation extends BaseComponent {
  public readonly correspondent: User;
  public areMessagesRead: boolean = false;
  public boundReadMessages: () => void = this.readMessages.bind(this);
  private boundHandleWebSocketParsedMessage: (message: WebSocketResponseMessageUnion) => void =
    this.handleWebSocketParsedMessage.bind(this);
  private placeholder: BaseComponent<'p'>;
  private messages: Message[];
  private unreadMessage: ChatMessage | undefined;

  constructor(
    { user, messages }: UserMessage,
    public contact: Contact
  ) {
    super({
      elementTag: 'div',
      classes: [styles.conversation, 'scrollbar'],
    });

    this.correspondent = user;
    this.messages = messages;
    this.placeholder = this.createPlaceHolder();
    this.checkMessagesEmpty();

    this.fillConversation();

    this.addListeners();
  }

  public checkNextUnread(deletedId: string, deletedIndex: number): void {
    if (!this.unreadMessage) return;

    if (this.unreadMessage.message.id === deletedId) {
      const nextIndex = deletedIndex;

      if (nextIndex < this.childComponents.length) {
        const nextUnread = this.childComponents[nextIndex];

        if (nextUnread instanceof ChatMessage) {
          this.unreadMessage = nextUnread;
          this.unreadMessage.markUnread();
        } else {
          this.unreadMessage = undefined;
        }
      } else {
        this.unreadMessage = undefined;
      }
    }
  }

  public checkMessagesEmpty(): void {
    if (this.messages.length > ZERO_LENGTH) {
      this.addClasses(styles.hasMessages);
    } else {
      this.removeClasses(styles.hasMessages);
      this.getElement().append(this.placeholder.getElement());
    }
  }

  public scroll(): void {
    const LAST_INDEX = -1;

    if (this.unreadMessage) {
      this.unreadMessage.getElement().scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      this.childComponents.at(LAST_INDEX)?.getElement().scrollIntoView({ block: 'start' });
    }
  }

  public removeListeners(): void {
    socket.offMessage(PARSED_MESSAGE, this.boundHandleWebSocketParsedMessage);
  }

  private fillConversation(): void {
    if (this.messages.length > ZERO_LENGTH) {
      let hasUnreadMessage = false;

      for (const message of this.messages) {
        const chatMessage = new ChatMessage(message, this.contact);

        if (
          !message.status.isReaded &&
          message.to === machine.context.username &&
          !hasUnreadMessage
        ) {
          chatMessage.markUnread();
          hasUnreadMessage = true;
          this.unreadMessage = chatMessage;
        }

        this.appendSingle(chatMessage);
      }
    } else {
      this.getElement().append(this.placeholder.getElement());
    }
  }

  private createPlaceHolder(): BaseComponent<'p'> {
    return tag.p({
      classes: [styles.placeholder],
      text: `No messages with ${this.correspondent.login}`,
    });
  }

  private addListeners(): void {
    socket.onMessage(PARSED_MESSAGE, this.boundHandleWebSocketParsedMessage);

    this.addListener('click', this.boundReadMessages);
    this.addListener('wheel', eventDebounceWrapper(this.boundReadMessages, DEBOUNCE_TIMEOUT), {
      passive: true,
    });
  }

  private handleWebSocketParsedMessage(message: WebSocketResponseMessageUnion): void {
    if (message.type === MESSAGE_SEND) this.handleMessageSendResponseMessage(message);
  }

  private readMessages(): void {
    if (this.areMessagesRead) return;

    this.areMessagesRead = true;
    this.unreadMessage = undefined;

    const unreadMessages = this.messages.filter(
      (message) => !message.status.isReaded && message.to === machine.context.username
    );

    for (const message of unreadMessages) {
      controller.makeRequestReadMessage(message.id);
    }
  }

  private handleMessageSendResponseMessage(message: MessageSendReceiveResponseMessage): void {
    const isFromCorrespondentToUser =
      message.payload.message.to === machine.context.username &&
      message.payload.message.from === this.correspondent.login;

    const isFromUserToCorrespondent =
      message.payload.message.to === this.correspondent.login &&
      message.payload.message.from === machine.context.username;

    if (isFromCorrespondentToUser || isFromUserToCorrespondent) {
      this.messages.push(message.payload.message);
      this.checkMessagesEmpty();

      const chatMessage = new ChatMessage(message.payload.message, this.contact);
      this.appendSingle(chatMessage);

      if (isFromCorrespondentToUser) {
        this.contact.updateUnread();

        if (!this.unreadMessage && !this.areMessagesRead) {
          this.unreadMessage = chatMessage;
          this.unreadMessage.markUnread();
          this.unreadMessage.getElement().scrollIntoView({ block: 'center' });
        }

        if (this.areMessagesRead) {
          controller.makeRequestReadMessage(message.payload.message.id);
        }

        if (this.unreadMessage) {
          this.unreadMessage.getElement().scrollIntoView({ block: 'center' });
        } else {
          chatMessage.getElement().scrollIntoView({ block: 'start' });
        }
      } else if (isFromUserToCorrespondent) {
        chatMessage.getElement().scrollIntoView({ block: 'start' });
      }
    }
  }
}
