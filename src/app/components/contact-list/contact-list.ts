import BaseComponent from '@components/base-component';
import Contact from '@components/contact/contact';
import tag from '@components/utility-components';
import {
  DEBOUNCE_TIMEOUT,
  PARSED_MESSAGE,
  USER_ACTIVE,
  USER_EXTERNAL_LOGIN,
  USER_EXTERNAL_LOGOUT,
  USER_INACTIVE,
  USER_LOGIN,
  USER_LOGOUT,
} from '@constants';
import Controller from '@controller/controller';
import WebSocketService from '@services/websocket.service';
import machine from '@state-machine/machine';
import type {
  UserActiveResponseMessage,
  UserExternalLoginResponseMessage,
  UserExternalLogoutResponseMessage,
  UserInactiveResponseMessage,
  WebSocketResponseMessageUnion,
} from '@ts-types';
import { eventDebounceWrapper } from '@utils/debounce-wrapper';

import * as styles from './contact-list.module.scss';

const controller = Controller.instance;
const socket = WebSocketService.instance;

export default class ContactList extends BaseComponent<'div'> {
  public loggedInContacts: Contact[] = [];
  public loggedOutContacts: Contact[] = [];
  private list: BaseComponent<'ul'>;
  private filter: string = '';

  constructor() {
    super({
      elementTag: 'div',
      classes: [styles.contactList],
    });

    this.createSearch();
    this.list = tag.ul({ classes: [styles.list, 'scrollbar'] });
    this.appendSingle(this.list);

    this.addListeners();
  }

  public addActive(): void {
    this.addClasses(styles.active);
  }

  public removeActive(): void {
    this.removeClasses(styles.active);
  }

  private createSearch(): void {
    const search = tag.input({
      type: 'search',
      placeholder: 'Search',
      classes: ['input', styles.searchInput],
      oninput: eventDebounceWrapper((event: Event) => {
        if (event.target instanceof HTMLInputElement) {
          this.filter = event.target.value;
          this.renderContacts();
        }
      }, DEBOUNCE_TIMEOUT),
    });
    this.appendSingle(tag.div({ classes: [styles.searchContainer] }, search));
  }

  private renderContacts(): void {
    const loggedInContacts = this.loggedInContacts
      .filter((contact) => contact.user.login.includes(this.filter))
      .sort((a, b) => a.user.login.localeCompare(b.user.login))
      .map((contact) => contact.getElement());

    const loggedOutContacts = this.loggedOutContacts
      .filter((contact) => contact.user.login.includes(this.filter))
      .sort((a, b) => a.user.login.localeCompare(b.user.login))
      .map((contact) => contact.getElement());

    this.list.getElement().replaceChildren(...loggedInContacts, ...loggedOutContacts);
  }

  private clearList(): void {
    this.list.getElement().replaceChildren();
  }

  private addListeners(): void {
    socket.onMessage(PARSED_MESSAGE, (message: WebSocketResponseMessageUnion) => {
      if (message.type === USER_LOGIN) this.handleUserLoginResponseMessage();

      if (message.type === USER_LOGOUT) this.handleUserLogoutResponseMessage();

      if (message.type === USER_ACTIVE) this.handleUserActiveResponseMessage(message);

      if (message.type === USER_INACTIVE) this.handleUserInactiveResponseMessage(message);

      if (message.type === USER_EXTERNAL_LOGIN)
        this.handleUserExternalLoginResponseMessage(message);

      if (message.type === USER_EXTERNAL_LOGOUT)
        this.handleUserExternalLogoutResponseMessage(message);
    });
  }

  private handleUserLoginResponseMessage(): void {
    for (const contact of this.loggedInContacts) contact.removeListeners();
    for (const contact of this.loggedOutContacts) contact.removeListeners();
    controller.makeRequestGetActiveUsers();
    controller.makeRequestGetInactiveUsers();
  }
  private handleUserLogoutResponseMessage(): void {
    this.loggedInContacts = [];
    this.loggedOutContacts = [];
    this.clearList();
  }

  private handleUserInactiveResponseMessage(message: UserInactiveResponseMessage): void {
    this.loggedOutContacts = message.payload.users
      .filter((u) => u.login !== machine.context.username)
      .map((user) => new Contact(user));
    this.renderContacts();
  }

  private handleUserActiveResponseMessage(message: UserActiveResponseMessage): void {
    this.loggedInContacts = message.payload.users
      .filter((u) => u.login !== machine.context.username)
      .map((user) => new Contact(user));
    this.renderContacts();
  }

  private handleUserExternalLoginResponseMessage(message: UserExternalLoginResponseMessage): void {
    const contact = this.loggedOutContacts.find(
      (contact) => contact.user.login === message.payload.user.login
    );

    if (contact) {
      this.loggedOutContacts = this.loggedOutContacts.filter(
        (c) => c.user.login !== contact.user.login
      );
      this.loggedInContacts.push(contact);
    } else {
      this.loggedInContacts.push(new Contact(message.payload.user));
    }

    this.renderContacts();
  }

  private handleUserExternalLogoutResponseMessage(
    message: UserExternalLogoutResponseMessage
  ): void {
    const contact = this.loggedInContacts.find(
      (contact) => contact.user.login === message.payload.user.login
    );

    if (contact) {
      this.loggedInContacts = this.loggedInContacts.filter((c) => c !== contact);
      this.loggedOutContacts.push(contact);
    } else {
      this.loggedOutContacts.push(new Contact(message.payload.user));
    }

    this.renderContacts();
  }
}
