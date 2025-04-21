import AboutView from '@components/about/about';
import BaseComponent from '@components/base-component';
import ChatView from '@components/chat-view/chat';
import ErrorView from '@components/error-view/error';
import Footer from '@components/footer/footer';
import LoginView from '@components/login-view/login';
import tag from '@components/utility-components';
import machine from '@state-machine/machine';
import { State } from '@ts-enums';

import * as styles from './main.module.scss';

const FIRST_ELEMENT = 0;

export default class Main extends BaseComponent<'main'> {
  private loginView: LoginView;
  private chatView: ChatView | undefined;
  private aboutView: AboutView | undefined;
  private errorView: ErrorView;
  private content: BaseComponent<'div'> | undefined;
  private username: BaseComponent<'span'> | undefined;

  constructor(private handleLink: (link: string) => void) {
    super({
      elementTag: 'main',
      classes: [styles.main],
    });

    this.loginView = new LoginView(this.followLink.bind(this));
    this.chatView = new ChatView(this.followLink.bind(this));
    this.aboutView = new AboutView(this.followLink.bind(this));
    this.errorView = new ErrorView(this.followLink.bind(this));

    this.content = tag.div({ classes: [styles.content] });
    this.appendChildren(this.content, new Footer());

    this.addListeners();
  }

  public mount(): void {
    this.handleRouteChange();
    document.body.append(this.getElement());
  }

  private addListeners(): void {
    machine.on(machine.eventsMap.machineStateChanged, () => this.handleRouteChange());
  }

  private handleRouteChange(): void {
    switch (machine.value) {
      case State.LOGIN: {
        if (this.loginView) this.changeContent(this.loginView);
        break;
      }
      case State.CHAT: {
        if (this.chatView) this.changeContent(this.chatView);
        break;
      }
      case State.ABOUT: {
        if (this.aboutView) this.changeContent(this.aboutView);
        break;
      }
      case State.ERROR: {
        if (this.errorView) this.changeContent(this.errorView);
      }
    }
  }

  private changeContent(newContent: BaseComponent): void {
    this.content?.childComponents[FIRST_ELEMENT]?.unMountSelf();
    this.content?.appendSingle(newContent);
  }

  private followLink(event: Event): void {
    event.preventDefault();
    const { currentTarget } = event;
    if (currentTarget instanceof HTMLAnchorElement) {
      const { href } = currentTarget;

      this.handleLink(href);
    }
  }
}
