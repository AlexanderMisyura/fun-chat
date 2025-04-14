import RSSvg from '@assets/img/rss-logo.svg';
import BaseComponent from '@components/base-component';
import { createSvgChunk } from '@components/create-svg-chunk';
import tag from '@components/utility-components';
import config from '@config';

import * as styles from './footer.module.scss';

export default class Footer extends BaseComponent<'footer'> {
  constructor() {
    super({
      elementTag: 'footer',
      classes: [styles.footer],
    });

    const author = tag.div(
      { classes: [styles.info] },
      tag.a({
        classes: [styles.authorLink],
        text: config.AUTHOR_NAME,
        href: config.AUTHOR_GITHUB_LINK,
        target: '_blank',
      }),
      tag.span({ text: config.YEAR })
    );

    const course = tag.div({ classes: [styles.info], text: config.COURSE_NAME });

    const logoLink = tag.a({
      classes: [styles.logoLink],
      href: config.COURSE_LINK,
      target: '_blank',
    });
    logoLink.appendSingleSVG(createSvgChunk(RSSvg, [styles.logo]));

    this.appendChildren(
      tag.div({ classes: [styles.infoContainer] }, author, course),
      tag.div({ classes: [styles.infoContainer] }, logoLink)
    );
  }
}
