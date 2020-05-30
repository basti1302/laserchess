import {PLAYER_WHITE, PLAYER_BLACK} from './Player';
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

export default class PieceType {
  constructor(id, possibleMovesFunction, surfaces) {
    this.id = id;
    this.whiteClass = `${id}-white`;
    this.blackClass = `${id}-black`;
    this.possibleMovesFunction = possibleMovesFunction;
    this.surfaces = surfaces || [DEFAULT, DEFAULT, DEFAULT, DEFAULT];
  }

  getClass(player) {
    if (player.is(PLAYER_WHITE)) {
      return this.getWhiteClass();
    } else if (player.is(PLAYER_BLACK)) {
      return this.getBlackClass();
    } else {
      throw new Error(`Unknown player: ${player}.`);
    }
  }

  getWhiteClass() {
    return this.whiteClass;
  }

  getBlackClass() {
    return this.blackClass;
  }

  possibleMoves(board, moves, piece, ignoreCastling) {
    this.possibleMovesFunction(board, moves, piece, ignoreCastling);
  }

  isPawn() {
    return (
      this.is(PAWN_SHIELD) || this.is(PAWN_90_DEGREES) || this.is(PAWN_THREEWAY)
    );
  }

  is(other) {
    return this.id === other.id;
  }
}

export const PAWN_SHIELD = new PieceType('pawn-shield', movesPawn, [
  SHIELD,
  DEFAULT,
  DEFAULT,
  DEFAULT,
]);
export const PAWN_90_DEGREES = new PieceType('pawn-90-deg', movesPawn, [
  REFLECT_LEFT,
  REFLECT_RIGHT,
  DEFAULT,
  DEFAULT,
]);
export const PAWN_THREEWAY = new PieceType('pawn-threeway', movesPawn, [
  REFLECT_STRAIGHT,
  REFLECT_RIGHT,
  DEFAULT,
  REFLECT_LEFT,
]);
export const BISHOP = new PieceType('bishop', movesBishop, [
  REFLECT_STRAIGHT,
  REFLECT_LEFT,
  DEFAULT,
  REFLECT_RIGHT,
]);
export const KNIGHT = new PieceType('knight', movesKnight, [
  SPLIT,
  DEFAULT,
  SPLIT,
  DEFAULT,
]);
export const ROOK = new PieceType('rook', movesRook, [
  SHIELD,
  SHIELD,
  SHIELD,
  SHIELD,
]);
export const QUEEN = new PieceType('queen', movesQueen, [
  RELAY,
  DEFAULT,
  DEFAULT,
  DEFAULT,
]);
export const KING = new PieceType('king', movesKing);
export const LASER = new PieceType('laser', movesLaser);
