export default class Piece {
  constructor(player, type) {
    if (player.constructor.name !== 'Player') {
      throw new Error(
        `Illegal argument for player: ${player.constructor.name}: ${player}`,
      );
    }
    if (type.constructor.name !== 'PieceType') {
      throw new Error(
        `Illegal argument for type: ${type.constructor.name}: ${type}`,
      );
    }
    this.player = player;
    this.type = type;
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

  clone() {
    const clonedPiece = new Piece(this.player, this.type);
    clonedPiece.rank = this.rank;
    clonedPiece.file = this.file;
    clonedPiece.hasMoved = this.hasMoved;
    return clonedPiece;
  }
}
