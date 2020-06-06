import { is as playerIs, PLAYER_WHITE, PLAYER_BLACK } from './Player';
import movesPawn from './moves/pawn';
import movesRook from './moves/rook';
import movesKnight from './moves/knight';
import movesBishop from './moves/bishop';
import movesQueen from './moves/queen';
import movesKing from './moves/king';
import movesLaser from './moves/laser';
import {
  DEFAULT,
  REFLECT_LEFT,
  REFLECT_RIGHT,
  REFLECT_STRAIGHT,
  RELAY,
  SHIELD,
  SPLIT,
} from './laser/surfaces';

function create(id, possibleMovesFunction, surfaces) {
  return {
    id,
    whiteClass: `${id}-white`,
    blackClass: `${id}-black`,
    possibleMovesFunction,
    surfaces: surfaces || [DEFAULT, DEFAULT, DEFAULT, DEFAULT],
  };
}

export function getClass(pieceType, player) {
  if (playerIs(player, PLAYER_WHITE)) {
    return pieceType.whiteClass;
  } else if (playerIs(player, PLAYER_BLACK)) {
    return pieceType.blackClass;
  } else {
    throw new Error(`Unknown player: ${player}.`);
  }
}

export function possibleMoves(pieceType, board, moves, piece, ignoreCastling) {
  pieceType.possibleMovesFunction(board, moves, piece, ignoreCastling);
}

export function isPawn(pieceType) {
  return (
    is(pieceType, PAWN_SHIELD) ||
    is(pieceType, PAWN_90_DEGREES) ||
    is(pieceType, PAWN_THREEWAY)
  );
}

export function is(pieceType, other) {
  return pieceType.id === other.id;
}

export const PAWN_SHIELD = create('pawn-shield', movesPawn, [
  SHIELD,
  DEFAULT,
  DEFAULT,
  DEFAULT,
]);
export const PAWN_90_DEGREES = create('pawn-90-deg', movesPawn, [
  REFLECT_LEFT,
  REFLECT_RIGHT,
  DEFAULT,
  DEFAULT,
]);
export const PAWN_THREEWAY = create('pawn-threeway', movesPawn, [
  REFLECT_STRAIGHT,
  REFLECT_RIGHT,
  DEFAULT,
  REFLECT_LEFT,
]);
export const BISHOP = create('bishop', movesBishop, [
  REFLECT_STRAIGHT,
  REFLECT_LEFT,
  DEFAULT,
  REFLECT_RIGHT,
]);
export const KNIGHT = create('knight', movesKnight, [
  SPLIT,
  DEFAULT,
  SPLIT,
  DEFAULT,
]);
export const ROOK = create('rook', movesRook, [SHIELD, SHIELD, SHIELD, SHIELD]);
export const QUEEN = create('queen', movesQueen, [
  RELAY,
  DEFAULT,
  DEFAULT,
  DEFAULT,
]);
export const KING = create('king', movesKing);
export const LASER = create('laser', movesLaser);
