import React from 'react';

import styles from './ButtonRow.module.scss';

export default function ({ children }) {
  return <ul className={styles['button-row']}>{children}</ul>;
}
