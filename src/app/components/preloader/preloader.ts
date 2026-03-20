import BaseComponent from '@components/base-component';
import tag from '@components/utility-components';
import { PRELOAD_MESSAGE } from '@constants';

import * as styles from './preloader.module.scss';

export default class Preloader extends BaseComponent<'div'> {
  constructor(message: string = PRELOAD_MESSAGE.RECONNECTING) {
    super({
      elementTag: 'div',
      classes: [styles.preloader],
    });

    const spinner = tag.div({ classes: [styles.spinner] });
    this.appendSingle(spinner);

    const messageElement = tag.p({ classes: [styles.message], text: message });
    this.appendSingle(messageElement);
  }
}
