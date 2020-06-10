import React from 'react';

import styles from './Button.module.scss';

export default function ({ children, disabled, onClick }) {
  return (
    <li className={styles['button-outer']}>
      <button onClick={onClick} className={styles.button} disabled={disabled}>
        {children}
      </button>
    </li>
  );
}
