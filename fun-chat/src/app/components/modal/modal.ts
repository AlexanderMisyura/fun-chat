import BaseComponent from '@components/base-component';
import tag from '@components/utility-components';

import * as styles from './modal.module.scss';

class Modal extends BaseComponent<'dialog'> {
  public modalControls = {
    showModal: this.showModal.bind(this),
    closeModal: this.closeModal.bind(this),
    closeModalButton: tag.button({
      text: 'Close',
      classes: ['button', styles.closeBtn],
      onclick: () => this.closeModal(),
    }),
  };

  private content: BaseComponent | undefined;
  private canBeClosed: boolean = true;
  private isOpen: boolean = false;

  constructor() {
    super({ elementTag: 'dialog', classes: [styles.modal] });

    this.addListeners();
  }

  public showModal(
    component: BaseComponent<keyof HTMLElementTagNameMap>,
    {
      canBeClosed = true,
      isCloseButton = true,
    }: { canBeClosed?: boolean; isCloseButton?: boolean } = {}
  ): void {
    if (this.isOpen) return;

    this.canBeClosed = canBeClosed;
    this.isOpen = true;

    this.createModal(isCloseButton);
    document.body.append(this.getElement());

    if (this.content) this.content.getElement().replaceChildren(component.getElement());

    this.element.showModal();
  }

  public closeModal(): void {
    if (this.canBeClosed) this.getElement().close();
  }

  public unLock(): void {
    this.canBeClosed = true;
  }

  private addListeners(): void {
    this.addListener('click', (event: Event) => {
      if (event.target === event.currentTarget) this.closeModal();
    });

    this.addListener('close', () => {
      this.content?.removeSelf();
      this.getElement().remove();
      this.isOpen = false;
    });

    this.addListener('keydown', (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape' && !this.canBeClosed) {
        event.preventDefault();
      }
    });
  }

  private createModal(isCloseButton: boolean): void {
    this.content = tag.div({ classes: [styles.content] });
    this.appendSingle(this.content);
    if (isCloseButton) this.appendSingle(this.modalControls.closeModalButton);
  }
}

export const modal = new Modal();
