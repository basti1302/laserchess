import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './PlayerInfo.module.scss';

export default function PlayerInfo({ color }) {
  return (
    <div className={styles['player-info']}>
      <FormattedMessage
        id="player.info.title"
        values={{
          color: <FormattedMessage id={color} />,
        }}
      />
    </div>
  );
}
