import React from 'react';

import styles from './PlayerInfo.module.scss';

export default function PlayerInfo({ color }) {
  return <div className={styles['player-info']}>Player: {color}</div>;
}
