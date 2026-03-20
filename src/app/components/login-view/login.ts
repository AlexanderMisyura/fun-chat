import BaseComponent from '@components/base-component';
import tag from '@components/utility-components';
import { DEBOUNCE_TIMEOUT } from '@constants';
import Controller from '@controller/controller';
import WebSocketService from '@services/websocket.service';
import { eventDebounceWrapper } from '@utils/debounce-wrapper';
import { validatePassword, validateUsername } from '@utils/validate-input';
const controller = Controller.instance;
const socket = WebSocketService.instance;

import { PARSED_MESSAGE, USER_LOGIN, ZERO_LENGTH } from '@constants';
import type { WebSocketResponseMessageUnion } from '@ts-types';

import * as styles from './login.module.scss';

export default class Login extends BaseComponent {
  private usernameInput: BaseComponent<'input'> | undefined;
  private passwordInput: BaseComponent<'input'> | undefined;
  private usernameMessage: BaseComponent<'p'> | undefined;
  private passwordMessage: BaseComponent<'p'> | undefined;
  private submitButton: BaseComponent<'button'> | undefined;
  private isUsernameValid: boolean = false;
  private isPasswordValid: boolean = false;
  private loginData: { username: string; password: string } | undefined;

  constructor(private followLink: (event: Event) => void) {
    super({
      elementTag: 'div',
      classes: [styles.login],
    });

    const heading = tag.h1(
      {},
      tag.a({
        classes: [styles.headingLink],
        text: 'Welcome to Fun Chat',
        href: '/about',
        onclick: this.followLink,
      })
    );

    this.appendChildren(heading, this.createForm());
    this.addListeners();
  }

  private createForm(): BaseComponent<'form'> {
    this.usernameInput = tag.input({
      classes: [styles.input, 'input'],
      type: 'text',
      placeholder: 'Username',
      autocomplete: 'username',
      oninput: eventDebounceWrapper(() => this.checkInput(), DEBOUNCE_TIMEOUT),
    });

    this.usernameMessage = tag.p({ classes: [styles.message] });

    this.passwordInput = tag.input({
      classes: [styles.input, 'input'],
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'current-password',
      oninput: eventDebounceWrapper(() => this.checkPassword(), DEBOUNCE_TIMEOUT),
    });

    this.passwordMessage = tag.p({ classes: [styles.message] });

    this.submitButton = tag.button({
      classes: [styles.submitButton, 'button'],
      text: 'Login',
      type: 'submit',
      disabled: true,
    });

    return tag.form(
      {
        classes: [styles.form],
        onsubmit: this.handleSubmit.bind(this),
      },
      this.usernameInput,
      this.usernameMessage,
      this.passwordInput,
      this.passwordMessage,
      this.submitButton
    );
  }

  private checkInput(): void {
    const value = this.usernameInput?.getElement().value;
    if (value) {
      this.validateUsernameInput(value);
    } else {
      this.isUsernameValid = false;
      this.usernameMessage?.setText('');
    }
  }

  private validateUsernameInput(value: string): void {
    const errors = validateUsername(value);
    this.isUsernameValid = errors.length === ZERO_LENGTH;
    this.usernameMessage?.removeChildren();
    for (const error of errors) {
      this.usernameMessage?.appendSingle(tag.p({ text: error, classes: [styles.error] }));
    }

    this.updateLogin();
  }

  private checkPassword(): void {
    const value = this.passwordInput?.getElement().value;
    if (value) {
      this.validatePasswordInput(value);
    } else {
      this.isPasswordValid = false;
      this.passwordMessage?.setText('');
      this.submitButton?.addAttributes({ disabled: '' });
    }
  }

  private validatePasswordInput(value: string): void {
    const errors = validatePassword(value);
    this.isPasswordValid = errors.length === ZERO_LENGTH;
    this.passwordMessage?.removeChildren();
    for (const error of errors) {
      this.passwordMessage?.appendSingle(tag.p({ text: error, classes: [styles.error] }));
    }
    this.updateLogin();
  }

  private updateLogin(): void {
    if (this.isUsernameValid && this.isPasswordValid && this.usernameInput && this.passwordInput) {
      this.submitButton?.removeAttributes(['disabled']);
      this.loginData = {
        username: this.usernameInput.getElement().value,
        password: this.passwordInput.getElement().value,
      };
    } else {
      this.loginData = undefined;
      this.submitButton?.addAttributes({ disabled: '' });
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    this.checkInput();
    this.checkPassword();

    if (this.isUsernameValid && this.isPasswordValid && this.loginData) {
      controller.makeRequestLoginUser(this.loginData);
    }
  }

  private resetLogin(): void {
    if (this.usernameInput) this.usernameInput.getElement().value = '';
    if (this.passwordInput) this.passwordInput.getElement().value = '';
    this.submitButton?.addAttributes({ disabled: '' });
    this.isUsernameValid = false;
    this.isPasswordValid = false;
  }

  private addListeners(): void {
    socket.onMessage(PARSED_MESSAGE, (message: WebSocketResponseMessageUnion) => {
      if (message.type === USER_LOGIN) this.resetLogin();
    });
  }
}
