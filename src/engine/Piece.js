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
  }

  setPosition(rank, file) {
    this.rank = rank;
    this.file = file;
  }

  getPosition() {
    return {
      rank: this.rank,
      file: this.file,
    };
  }

  getSquare(board) {
    return board.getSquare(this.rank, this.file);
  }

  possibleMoves(board, moves) {
    this.type.possibleMoves(board, moves, this);
  }
}
