import Move from './Move';

export default function moveTo(
  board,
  moves,
  from,
  to,
  straightPawnMove = false,
) {
  if (board.constructor.name !== 'Board') {
    throw new Error(
      `Illegal argument for board: ${board.constructor.name}: ${board}`,
    );
  }
  if (!Array.isArray(moves)) {
    throw new Error(`moves is not an array, but ${typeof moves}, ${moves}.`);
  }
  if (from.constructor.name !== 'Square') {
    throw new Error(
      `Illegal argument for from: ${from.constructor.name}: ${from}`,
    );
  }

  if (!to) {
    // tried to move off board
    return false;
  }
  if (to.constructor.name !== 'Square') {
    throw new Error(`Illegal argument for to: ${to.constructor.name}: ${to}`);
  }

  const movingPiece = from.getPiece();
  if (!movingPiece) {
    return false;
  }
  if (
    !to.hasPiece() ||
    (!straightPawnMove && from.getPiece().player !== to.getPiece().player)
  ) {
    moves.push(new Move(from, to));
    return true;
  }
  return false;
}
