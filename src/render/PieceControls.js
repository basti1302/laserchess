import React from 'react';

import ButtonRow from './components/ButtonRow';
import Button from './components/Button';

export default function PieceControls({ ctx, moves }) {
  const { activePlayers, currentPlayer, gameover } = ctx;

  const rotateDisabled =
    !!gameover || activePlayers[currentPlayer] !== 'movePieceStage';

  return (
    <ButtonRow>
      <Button
        onClick={() =>
          moves.rotatePieceLeft() ||
          activePlayers[currentPlayer] !== 'movePieceStage'
        }
        disabled={rotateDisabled}
      >
        ⟲
      </Button>
      <Button onClick={() => moves.fireLaser()} disabled={!!gameover}>
        Fire
      </Button>
      <Button
        onClick={() => moves.rotatePieceRight()}
        disabled={rotateDisabled}
      >
        ⟳
      </Button>
    </ButtonRow>
  );
}
