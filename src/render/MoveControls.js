import React from 'react';

import PromotionControls from './PromotionControls';
import PieceControls from './PieceControls';

export default function MoveControls({ ctx, G, moves }) {
  if (G.possiblePromotions && G.possiblePromotions.length > 0) {
    return (
      <PromotionControls
        possiblePromotions={G.possiblePromotions}
        moves={moves}
      />
    );
  } else {
    return <PieceControls G={G} ctx={ctx} moves={moves} />;
  }
}
