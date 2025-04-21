import closeSvg from '@assets/img/close.svg';
import sendSvg from '@assets/img/send.svg';
import BaseComponent from '@components/base-component';
import { createSvgChunk } from '@components/create-svg-chunk';
import tag from '@components/utility-components';
import { ZERO_LENGTH } from '@constants';
import type { Message } from '@ts-types';

import * as styles from './chat-input.module.scss';

export default class ChatInput extends BaseComponent<'div'> {
  private editMessage: Message | undefined = undefined;
  private input: BaseComponent<'textarea'>;
  private cancelEditButton: BaseComponent<'button'>;
  private sendButton: BaseComponent<'button'>;

  constructor(private sendMessage: (text: string, id?: string) => void) {
    super({
      elementTag: 'div',
      classes: [styles.chatInput],
    });

    this.input = tag.textarea({
      classes: [styles.input, 'input'],
      spellcheck: true,
      oninput: () => this.handleInput(),
    });

    this.cancelEditButton = this.createCancelEditButton();
    this.sendButton = this.createSendButton();

    this.appendChildren(this.input, this.cancelEditButton, this.sendButton);

    this.addListeners();
  }

  public handleListOpened(): void {
    this.addClasses(styles.listIsOpen);
  }

  public handleListClosed(): void {
    this.removeClasses(styles.listIsOpen);
  }

  public prepareEdit(message: Message): void {
    this.editMessage = message;
    this.showCancelEditButton();
    this.input.getElement().value = message.text;
    if (message.text.length > ZERO_LENGTH) this.sendButton.removeAttributes(['disabled']);
  }

  public editMessageClose(): void {
    this.editMessage = undefined;
    this.hideCancelEditButton();
    this.input.getElement().value = '';
  }

  private showCancelEditButton(): void {
    this.cancelEditButton.addClasses(styles.edit);
  }

  private hideCancelEditButton(): void {
    this.cancelEditButton.removeClasses(styles.edit);
  }

  private createCancelEditButton(): BaseComponent<'button'> {
    const cancelButton = tag.button({
      classes: [styles.cancelButton, 'button'],
      onclick: () => this.editMessageClose(),
    });

    cancelButton.appendSingleSVG(createSvgChunk(closeSvg, [styles.icon]));

    return cancelButton;
  }

  private createSendButton(): BaseComponent<'button'> {
    const sendButton = tag.button({
      classes: [styles.sendButton, 'button'],
      disabled: true,
      onclick: () => this.submitMessage(),
    });

    sendButton.appendSingleSVG(createSvgChunk(sendSvg, [styles.icon]));

    return sendButton;
  }

  private submitMessage(): void {
    const value = this.input.getElement().value.trim().replaceAll(/\n+/g, '\n');

    if (value.length !== ZERO_LENGTH) {
      this.sendMessage(value, this.editMessage?.id);
    }

    this.input.getElement().value = '';
    this.sendButton.addAttributes({ disabled: '' });
    this.editMessageClose();
  }

  private handleInput(): void {
    if (this.input.getElement().value.length > ZERO_LENGTH) {
      this.sendButton.removeAttributes(['disabled']);
    } else {
      this.sendButton.addAttributes({ disabled: '' });
    }
  }

  private addListeners(): void {
    this.input.getElement().addEventListener('keydown', this.handleInputEnterPress.bind(this));
  }

  private handleInputEnterPress(event: Event): void {
    if (this.input.getElement() === document.activeElement && event instanceof KeyboardEvent) {
      const key = event.key;

      if (key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.submitMessage();
      }
    }
  }
}
