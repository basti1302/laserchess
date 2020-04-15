import {PLAYER_WHITE, PLAYER_BLACK} from './Player';
import movesPawn from './moves/pawn';
import movesRook from './moves/rook';
import movesKnight from './moves/knight';
import movesBishop from './moves/bishop';
import movesQueen from './moves/queen';
import movesKing from './moves/king';
import movesLaser from './moves/laser';
import {DEFAULT, REFLECT_LEFT, REFLECT_RIGHT, SHIELD} from './laser/Surface';

export default class PieceType {
  constructor(whiteChar, blackChar, possibleMovesFunction, surfaces) {
    this.whiteChar = whiteChar;
    this.blackChar = blackChar;
    this.possibleMovesFunction = possibleMovesFunction;
    this.surfaces = surfaces || [DEFAULT, DEFAULT, DEFAULT, DEFAULT];
  }

  as(player) {
    if (player === PLAYER_WHITE) {
      return this.asWhite();
    } else if (player === PLAYER_BLACK) {
      return this.asBlack();
    } else {
      throw new Error(`Unknown player: ${player}.`);
    }
  }

  asWhite() {
    return this.whiteChar;
  }

  asBlack() {
    return this.blackChar;
  }

  possibleMoves(board, moves, piece, ignoreCastling) {
    this.possibleMovesFunction(board, moves, piece, ignoreCastling);
  }

  isPawn() {
    return this === PAWN || this === PAWN_90_DEGREES || this === PAWN_SHIELD;
  }
}

export const PAWN = new PieceType('pawn-white', 'pawn-black', movesPawn);
export const PAWN_90_DEGREES = new PieceType(
  'pawn-90-deg-white',
  'pawn-90-deg-black',
  movesPawn,
  [REFLECT_LEFT, REFLECT_RIGHT, DEFAULT, DEFAULT],
);
export const PAWN_SHIELD = new PieceType(
  'pawn-shield-white',
  'pawn-shield-black',
  movesPawn,
  [SHIELD, DEFAULT, DEFAULT, DEFAULT],
);
export const BISHOP = new PieceType(
  'bishop-white',
  'bishop-black',
  movesBishop,
);
export const KNIGHT = new PieceType(
  'knight-white',
  'knight-black',
  movesKnight,
);
export const ROOK = new PieceType('rook-white', 'rook-black', movesRook);
export const QUEEN = new PieceType('queen-white', 'queen-black', movesQueen);
export const KING = new PieceType('king-white', 'king-black', movesKing);
export const LASER = new PieceType('laser-white', 'laser-black', movesLaser);
