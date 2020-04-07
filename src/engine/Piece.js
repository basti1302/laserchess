import {PLAYER_WHITE, PLAYER_BLACK} from './Player';
import {NORTH, SOUTH} from './Orientation';

export default class Piece {
  constructor(player, type, orientation) {
    if (player.constructor.name !== 'Player') {
      throw new Error(
        `Illegal argument for player: ${player.constructor.name}: ${player}`,
      );
    }
    if (player !== PLAYER_WHITE && player !== PLAYER_BLACK) {
      throw new Error(`Illegal argument for player: ${player}`);
    }
    if (type.constructor.name !== 'PieceType') {
      throw new Error(
        `Illegal argument for type: ${type.constructor.name}: ${type}`,
      );
    }
    if (orientation && orientation.constructor.name !== 'Orientation') {
      throw new Error(
        `Illegal argument for orientation: ${orientation.constructor.name}: ${orientation}`,
      );
    }
    this.player = player;
    this.type = type;
    if (orientation) {
      this.orientation = orientation;
    } else {
      if (player === PLAYER_WHITE) {
        this.orientation = NORTH;
      } else if (player === PLAYER_BLACK) {
        this.orientation = SOUTH;
      }
    }
    this.rank = null;
    this.file = null;
    this.hasMoved = false;
  }

  setPosition(rank, file) {
    this.rank = rank;
    this.file = file;
  }

  clearPosition() {
    this.rank = null;
    this.file = null;
  }

  getPosition() {
    if (this.rank && this.file) {
      return {
        rank: this.rank,
        file: this.file,
      };
    } else {
      return null;
    }
  }

  getSquare(board) {
    return board.getSquare(this.rank, this.file);
  }

  possibleMovesIgnoringCheck(board, moves, ignoreCastling = false) {
    this.type.possibleMoves(board, moves, this, ignoreCastling);
  }

  possibleMoves(board, moves) {
    this.possibleMovesIgnoringCheck(board, moves);
    board.pruneMovesThatLeadToCheckFor(moves, this.player);
  }

  rotateLeft() {
    this.orientation = this.orientation.rotateLeft();
  }

  rotateRight() {
    this.orientation = this.orientation.rotateRight();
  }

  clone() {
    const clonedPiece = new Piece(this.player, this.type);
    clonedPiece.rank = this.rank;
    clonedPiece.file = this.file;
    clonedPiece.hasMoved = this.hasMoved;
    return clonedPiece;
  }
}
