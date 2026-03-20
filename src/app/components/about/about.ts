import BaseComponent from '@components/base-component';
import tag from '@components/utility-components';
import { ROUTE } from '@constants';

import * as styles from './about.module.scss';

export default class About extends BaseComponent<'div'> {
  constructor(private followLink: (event: Event) => void) {
    super({ elementTag: 'div', classes: [styles.about] });

    const heading = tag.h1({ classes: [styles.heading], text: 'About' });

    const text_1 = tag.p({
      text: 'This chat application is a personal project developed as part of my frontend development course. It aims to provide a user-friendly interface for real-time communication, showcasing my skills in modern web technologies. I am passionate about creating intuitive and engaging user experiences, and this project reflects my commitment to continuous learning and improvement in web development.',
    });

    const text_2 = tag.p({
      text: 'I hope you find the chat application useful and enjoyable, and I look forward to contributing to the development of even more exciting projects in the future. Thank you for visiting!',
    });

    const link = tag.a({
      classes: [styles.link],
      href: ROUTE.CHAT,
      text: 'Go Back',
      onclick: this.followLink,
    });

    this.appendChildren(heading, text_1, text_2, link);
  }
}
