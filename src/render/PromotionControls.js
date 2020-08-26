import React from 'react';
import { FormattedMessage } from 'react-intl';

import { create as createEnginePiece } from '../engine/Piece';

import ButtonRow from './components/ButtonRow';
import Button from './components/Button';
import Piece from './Piece';

export default function PromotionControls({ possiblePromotions, moves }) {
  if (possiblePromotions && possiblePromotions.length > 0) {
    const promotionButtons = possiblePromotions.map((promotionMove, idx) => (
      <Button
        key={idx}
        onClick={() => applyPromotionMove(moves, promotionMove)}
      >
        <Piece
          piece={createEnginePiece(
            promotionMove.from.piece.player,
            promotionMove.promotionTo,
          )}
        />
      </Button>
    ));
    return (
      <>
        <FormattedMessage id="promote.to" />
        <ButtonRow>{promotionButtons}</ButtonRow>
      </>
    );
  }
  return null;
}

function applyPromotionMove(moves, promotionMove) {
  moves.applyPromotionMove(promotionMove);
}
