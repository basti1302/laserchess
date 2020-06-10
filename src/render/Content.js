import React from 'react';

import GameHasEndedMessage from './GameHasEndedMessage';
import MoveControls from './MoveControls';
import PlayerInfo from './PlayerInfo';
import Board from './Board';

import styles from './Content.module.scss';

export default function Content({ ctx, G, moves, events }) {
  const { activePlayers, currentPlayer, gameover } = ctx;

  console.log(JSON.stringify(ctx, null, 2));

  if (!currentPlayer) {
    throw new Error('No current player.');
  }

  const stage = activePlayers && activePlayers[currentPlayer];
  if (!stage && !gameover) {
    throw new Error(`No active stage for player ${currentPlayer}.`);
  }

  if (stage === 'renderShotStage') {
    setTimeout(() => {
      moves.endRenderShotStage();
    }, 2000);
  }

  return (
    <div className={styles.content}>
      <PlayerInfo color="Red" />
      <GameHasEndedMessage gameover={gameover} />
      <MoveControls ctx={ctx} G={G} moves={moves} />
      <Board G={G} ctx={ctx} stage={stage} moves={moves} events={events} />
      <PlayerInfo color="Blue" />
    </div>
  );
}
