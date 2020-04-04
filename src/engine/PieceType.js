import {PLAYER_WHITE, PLAYER_BLACK} from './Player';
import movesPawn from './moves/pawn';
import movesRook from './moves/rook';
import movesKnight from './moves/knight';
import movesBishop from './moves/bishop';
import movesQueen from './moves/queen';
import movesKing from './moves/king';
import movesLaser from './moves/laser';

export default class PieceType {
  constructor(whiteChar, blackChar, possibleMovesFn) {
    this.whiteChar = whiteChar;
    this.blackChar = blackChar;
    this.possibleMovesFn = possibleMovesFn;
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

  possibleMoves(board, moves, piece) {
    this.possibleMovesFn(board, moves, piece);
  }
}

export const PAWN = new PieceType('pawn-white', 'pawn-black', movesPawn);
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
