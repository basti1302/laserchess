import React from 'react';
import { useIntl } from 'react-intl';

import styles from './Button.module.scss';

export default function Button({ children, disabled, onClick, title }) {
  const intl = useIntl();
  if (title) {
    title = intl.formatMessage({
      id: title,
    });
  }
  return (
    <li className={styles['button-outer']}>
      <button
        onClick={onClick}
        className={styles.button}
        disabled={disabled}
        title={title}
      >
        {children}
      </button>
    </li>
  );
}
