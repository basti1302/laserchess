import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function GameHasEndedMessage({ gameover }) {
  if (gameover) {
    if (gameover.winner) {
      return (
        <div>
          <FormattedMessage
            id="game.ended.won"
            values={{
              color: <FormattedMessage id={gameover.winner.color} />,
            }}
          />{' '}
          <FormattedMessage id={gameover.result} values={gameover.msgArgs} />
        </div>
      );
    } else {
      return (
        <div>
          <FormattedMessage id="game.ended.draw" />{' '}
          <FormattedMessage id={gameover.result} values={gameover.msgArgs} />
        </div>
      );
    }
  }
  return null;
}
