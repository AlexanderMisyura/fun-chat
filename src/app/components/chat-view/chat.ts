import BaseComponent from '@components/base-component';
import ChatInput from '@components/chat-input/chat-input';
import type Contact from '@components/contact/contact';
import ContactList from '@components/contact-list/contact-list';
import MessagePanel from '@components/message-panel/message-panel';
import tag from '@components/utility-components';
import { DEBOUNCE_TIMEOUT, PARSED_MESSAGE, USER_LOGIN, USER_LOGOUT } from '@constants';
import Controller from '@controller/controller';
import WebSocketService from '@services/websocket.service';
import machine from '@state-machine/machine';
import { CustomAppEvent } from '@ts-enums';
import type { Message, WebSocketResponseMessageUnion } from '@ts-types';
import { eventDebounceWrapper } from '@utils/debounce-wrapper';

import * as styles from './chat.module.scss';

const controller = Controller.instance;
const socket = WebSocketService.instance;

export default class Chat extends BaseComponent<'div'> {
  private username: BaseComponent<'span'> | undefined;
  private contactListShowButton: BaseComponent<'button'> | undefined;
  private contactList: ContactList;
  private messagePanel: MessagePanel;
  private isContactListOpen: boolean = false;
  private editMessage: Message | undefined;
  private currentContact: Contact | undefined;
  private chatInput: ChatInput;
  private dot: BaseComponent<'span'> = tag.span({ classes: [styles.dot] });

  constructor(private followLink: (event: Event) => void) {
    super({
      elementTag: 'div',
      classes: [styles.chat],
    });
    this.contactList = new ContactList();
    this.messagePanel = new MessagePanel();
    this.chatInput = new ChatInput(this.sendMessage.bind(this));
    this.chatInput.addClasses(styles.hidden);
    this.appendChildren(this.createHeader(), this.contactList, this.messagePanel, this.chatInput);

    this.addListeners();
  }
  private createHeader(): BaseComponent<'header'> {
    const username = machine.context.username;

    const aboutLink = tag.a({
      classes: [styles.headingLink],
      text: 'Fun Chat',
      href: '/about',
      onclick: this.followLink,
    });

    const heading = tag.h1({}, aboutLink);
    this.username = tag.span({ text: username, classes: [styles.user] });
    const logoutButton = this.createLogoutButton();

    return tag.header(
      { classes: [styles.header] },
      heading,
      tag.div({ classes: [styles.userContainer] }, this.username, logoutButton),
      this.createContactListButton()
    );
  }

  private createLogoutButton(): BaseComponent<'button'> {
    const logoutButton = tag.button({
      text: 'Logout',
      classes: [styles.logoutButton, 'button'],
      onclick: () => controller.makeRequestLogoutUser(),
    });

    return logoutButton;
  }

  private createContactListButton(): BaseComponent<'button'> {
    this.contactListShowButton = tag.button(
      {
        classes: [styles.chatListButton, 'button'],
        onclick: () => {
          this.isContactListOpen = !this.isContactListOpen;
          if (this.isContactListOpen) {
            this.handleOpenChatList();
          } else {
            this.handleCloseChatList();
          }
        },
      },
      tag.span({ classes: [styles.burger] }),
      this.dot
    );

    return this.contactListShowButton;
  }

  private handleOpenChatList(): void {
    this.contactListShowButton?.addClasses(styles.active);
    this.contactList.addActive();
    this.messagePanel.handleListOpened();
    this.chatInput.handleListOpened();
  }

  private handleCloseChatList(): void {
    this.contactListShowButton?.removeClasses(styles.active);
    this.contactList.removeActive();
    this.messagePanel.handleListClosed();
    this.chatInput.handleListClosed();
    this.chatInput.editMessageClose();
  }

  private sendMessage(text: string, id?: string): void {
    if (this.currentContact) {
      this.currentContact.conversation?.boundReadMessages();

      if (this.editMessage && id) {
        controller.makeRequestEditMessage({ id, text });
        this.editMessage = undefined;
      } else if (!this.editMessage) {
        controller.makeRequestSendMessage({ to: this.currentContact.user.login, text });
      }
    }
  }

  private addListeners(): void {
    socket.onMessage(PARSED_MESSAGE, (message: WebSocketResponseMessageUnion) => {
      if (message.type === USER_LOGIN) {
        this.username?.setText(message.payload.user.login);
      }

      if (message.type === USER_LOGOUT) {
        this.username?.setText('');
      }
    });

    socket.onEvent(socket.eventsMapEvent.error, () => {
      this.handleCloseChatList();
    });

    this.getElement().addEventListener(CustomAppEvent.DISPATCH_CONTACT, ((
      customEvent: CustomEvent<Contact>
    ) => this.handleDispatchContact(customEvent)) as EventListener);

    this.getElement().addEventListener(CustomAppEvent.RESET_CONTACT, () =>
      this.handleResetContact()
    );

    this.getElement().addEventListener(CustomAppEvent.EDIT_MESSAGE, ((
      customEvent: CustomEvent<Message>
    ) => this.handleDispatchEditMessage(customEvent)) as EventListener);

    this.getElement().addEventListener(
      CustomAppEvent.UPDATE_UNREAD,
      eventDebounceWrapper(() => this.handleUpdateUnread(), DEBOUNCE_TIMEOUT)
    );
  }

  private handleUpdateUnread(): void {
    const hasNoUnreadFromLoggedIn = this.contactList.loggedInContacts.every(
      (contact) => !contact.hasUnread
    );
    const hasNoUnreadFromLoggedOut = this.contactList.loggedOutContacts.every(
      (contact) => !contact.hasUnread
    );

    if (hasNoUnreadFromLoggedIn && hasNoUnreadFromLoggedOut) {
      this.dot.removeClasses(styles.active);
    } else {
      this.dot.addClasses(styles.active);
    }
  }

  private handleDispatchContact(event: CustomEvent<Contact>): void {
    const contact = event.detail;
    this.isContactListOpen = false;
    this.handleCloseChatList();

    if (this.currentContact?.user.login === contact.user.login) return;

    this.currentContact = contact;

    if (this.currentContact.conversation) {
      this.messagePanel.openConversation(this.currentContact.conversation);
      this.chatInput.removeClasses(styles.hidden);
    }
  }

  private handleDispatchEditMessage(event: CustomEvent<Message>): void {
    this.editMessage = event.detail;
    this.chatInput.prepareEdit(this.editMessage);
  }

  private handleResetContact(): void {
    if (this.currentContact?.conversation) {
      this.currentContact.conversation.areMessagesRead = false;
    }

    this.currentContact = undefined;
    this.chatInput.addClasses(styles.hidden);
  }
}
