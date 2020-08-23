import React from 'react';

import ButtonRow from './components/ButtonRow';
import Button from './components/Button';

export default function PieceControls({ G, ctx, moves }) {
  const { activePlayers, currentPlayer, gameover } = ctx;

  const rotateDisabled =
    !!gameover ||
    activePlayers[currentPlayer] !== 'movePieceStage' ||
    !G.canRotate;
  const rotateTooltip = rotateDisabled ? G.reasonCannotRotate : null;
  const fireDisabled = !G.laserCanFire || !!gameover;
  const fireTooltip = fireDisabled ? G.reasonLaserCannotFire : null;

  return (
    <ButtonRow>
      <Button
        onClick={() =>
          moves.rotatePieceLeft() ||
          activePlayers[currentPlayer] !== 'movePieceStage'
        }
        disabled={rotateDisabled}
        title={rotateTooltip}
      >
        ⟲
      </Button>
      <Button
        onClick={() => moves.fireLaser()}
        disabled={fireDisabled}
        title={fireTooltip}
      >
        Fire
      </Button>
      <Button
        onClick={() => moves.rotatePieceRight()}
        disabled={rotateDisabled}
        title={rotateTooltip}
      >
        ⟳
      </Button>
    </ButtonRow>
  );
}
