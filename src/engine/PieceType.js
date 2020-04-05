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

export const PAWN = new PieceType('♙', '♟', movesPawn);
export const BISHOP = new PieceType('♗', '♝', movesBishop);
export const KNIGHT = new PieceType('♘', '♞', movesKnight);
export const ROOK = new PieceType('♖', '♜', movesRook);
export const QUEEN = new PieceType('♕', '♛', movesQueen);
export const KING = new PieceType('♔', '♚', movesKing);
export const LASER = new PieceType('🔫', '🔫', movesLaser);
