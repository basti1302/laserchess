import React from 'react';

import styles from './Button.module.scss';

export default function Button({ children, disabled, onClick, title }) {
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
