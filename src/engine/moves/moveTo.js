import Board from '../Board';
import Square from '../Square';
import {LASER, QUEEN, ROOK, KNIGHT, BISHOP} from '../PieceType';
import Move from './Move';

export default function moveTo(
  board,
  moves,
  from,
  to,
  captureMode = CAPTURE_MODE_CAN,
  isPawnPromotion = false,
) {
  if (board.constructor !== Board) {
    throw new Error(`Illegal argument for board: ${JSON.stringify(board)}`);
  }
  if (!Array.isArray(moves)) {
    throw new Error(`moves is not an array, but ${typeof moves}, ${moves}.`);
  }
  if (from.constructor !== Square) {
    throw new Error(`Illegal argument for from: ${JSON.stringify(from)}`);
  }

  if (!to) {
    // tried to move off board
    return false;
  }
  if (to.constructor !== Square) {
    throw new Error(`Illegal argument for to: ${JSON.stringify(to)}`);
  }

  const movingPiece = from.getPiece();
  if (!movingPiece) {
    return false;
  }

  if (
    captureMode === CAPTURE_MODE_MUST &&
    (!to.hasPiece() || from.getPiece().player === to.getPiece().player)
  ) {
    return false;
  }
  if (captureMode === CAPTURE_MODE_MUST_NOT && to.hasPiece()) {
    return false;
  }
  if (
    captureMode === CAPTURE_MODE_CAN &&
    to.hasPiece() &&
    from.getPiece().player === to.getPiece().player
  ) {
    return false;
  }

  if (isPawnPromotion) {
    moves.push(new Move(from, to, null, null, LASER));
    moves.push(new Move(from, to, null, null, QUEEN));
    moves.push(new Move(from, to, null, null, ROOK));
    moves.push(new Move(from, to, null, null, KNIGHT));
    moves.push(new Move(from, to, null, null, BISHOP));
  } else {
    moves.push(new Move(from, to));
  }
  return true;
}

export const CAPTURE_MODE_CAN = 'can-capture';
export const CAPTURE_MODE_MUST = 'must-capture';
export const CAPTURE_MODE_MUST_NOT = 'must-not-capture';
