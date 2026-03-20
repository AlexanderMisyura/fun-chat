import BaseComponent from '@components/base-component';
import tag from '@components/utility-components';

import * as styles from './error.module.scss';

export default class Error extends BaseComponent<'div'> {
  constructor(private followLink: (event: Event) => void) {
    super({ elementTag: 'div', classes: [styles.error] });

    const heading = tag.h1({ classes: [styles.heading], text: '404 Error' });

    const text_1 = tag.p({
      text: 'The page you are looking for does not exist.',
    });

    const link = tag.a({
      classes: [styles.link],
      href: '/chat',
      text: 'Back to Chat',
      onclick: this.followLink,
    });

    this.appendChildren(heading, text_1, link);
  }
}
