import { LASER, QUEEN, ROOK, KNIGHT, BISHOP } from '../PieceType';
import { is as isPlayer } from '../Player';
import { create as createMove } from './Move';

export default function moveTo(
  board,
  moves,
  from,
  to,
  captureMode = CAPTURE_MODE_CAN,
  isPawnPromotion = false,
) {
  if (!board) {
    throw new Error('Missing mandatory argument: board.');
  }
  if (!Array.isArray(moves)) {
    throw new Error(`moves is not an array, but ${typeof moves}, ${moves}.`);
  }
  if (!from) {
    throw new Error('Missing mandatory argument: from.');
  }

  if (!to) {
    // tried to move off board
    return false;
  }
  if (!to) {
    throw new Error('Missing mandatory argument: to.');
  }

  const movingPiece = from.piece;
  if (!movingPiece) {
    return false;
  }

  if (
    captureMode === CAPTURE_MODE_MUST &&
    (!to.piece || isPlayer(from.piece.player, to.piece.player))
  ) {
    return false;
  }
  if (captureMode === CAPTURE_MODE_MUST_NOT && to.piece) {
    return false;
  }
  if (
    captureMode === CAPTURE_MODE_CAN &&
    to.piece &&
    isPlayer(from.piece.player, to.piece.player)
  ) {
    return false;
  }

  if (isPawnPromotion) {
    moves.push(createMove(from, to, null, null, LASER));
    moves.push(createMove(from, to, null, null, QUEEN));
    moves.push(createMove(from, to, null, null, ROOK));
    moves.push(createMove(from, to, null, null, KNIGHT));
    moves.push(createMove(from, to, null, null, BISHOP));
  } else {
    moves.push(createMove(from, to));
  }
  return true;
}

export const CAPTURE_MODE_CAN = 'can-capture';
export const CAPTURE_MODE_MUST = 'must-capture';
export const CAPTURE_MODE_MUST_NOT = 'must-not-capture';
