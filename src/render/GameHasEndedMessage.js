import React from 'react';

export default function GameHasEndedMessage({ gameover }) {
  if (gameover) {
    if (gameover.winner) {
      return (
        <div>
          Game has ended, player {gameover.winner.color.label} has won.{' '}
          {gameover.result}
        </div>
      );
    } else {
      return <div>Game has ended in draw. {gameover.result}</div>;
    }
  }
  return null;
}
