import {PLAYER_WHITE, PLAYER_BLACK} from './Player';
import {PAWN, BISHOP, KNIGHT, ROOK, QUEEN, KING, LASER} from './PieceType';
import Piece from './Piece';
import Square from './Square';

export const files = 9; // columns: a - h on a traditional board
export const ranks = 9; // rows: 1 - 8 on a traditional board

export default class Board {
  constructor() {
    this.squares = [];
    this.history = [];

    for (let rank = 1; rank <= ranks; rank++) {
      for (let file = 1; file <= files; file++) {
        this.squares[index(rank, file)] = new Square(rank, file);
      }
    }
  }

  getSquare(rank, file) {
    if (rank <= 0 || file <= 0 || rank > ranks || file > files) {
      return null;
    }
    return this.squares[index(rank, file)];
  }

  setPiece(rank, file, piece) {
    if (file <= 0 || rank <= 0 || file > files || rank > ranks) {
      return;
    }
    const square = this.squares[index(rank, file)];
    square.setPiece(piece);
  }

  getSelectedSquare() {
    return this.findFirstSquare((square) => square.selected);
  }

  deselectAll() {
    this.forEachSquare((square) => (square.selected = false));
  }

  setup() {
    this.setPiece(1, 'a', new Piece(PLAYER_WHITE, ROOK));
    this.setPiece(1, 'b', new Piece(PLAYER_WHITE, KNIGHT));
    this.setPiece(1, 'c', new Piece(PLAYER_WHITE, BISHOP));
    this.setPiece(1, 'd', new Piece(PLAYER_WHITE, LASER));
    this.setPiece(1, 'e', new Piece(PLAYER_WHITE, KING));
    this.setPiece(1, 'f', new Piece(PLAYER_WHITE, QUEEN));
    this.setPiece(1, 'g', new Piece(PLAYER_WHITE, BISHOP));
    this.setPiece(1, 'h', new Piece(PLAYER_WHITE, KNIGHT));
    this.setPiece(1, 'i', new Piece(PLAYER_WHITE, ROOK));

    this.setPiece(9, 'a', new Piece(PLAYER_BLACK, ROOK));
    this.setPiece(9, 'b', new Piece(PLAYER_BLACK, KNIGHT));
    this.setPiece(9, 'c', new Piece(PLAYER_BLACK, BISHOP));
    this.setPiece(9, 'd', new Piece(PLAYER_BLACK, QUEEN));
    this.setPiece(9, 'e', new Piece(PLAYER_BLACK, KING));
    this.setPiece(9, 'f', new Piece(PLAYER_BLACK, LASER));
    this.setPiece(9, 'g', new Piece(PLAYER_BLACK, BISHOP));
    this.setPiece(9, 'h', new Piece(PLAYER_BLACK, KNIGHT));
    this.setPiece(9, 'i', new Piece(PLAYER_BLACK, ROOK));

    for (let file = 1; file <= files; file++) {
      const whitePawn = new Piece(PLAYER_WHITE, PAWN);
      this.setPiece(2, file, whitePawn);
      const blackPawn = new Piece(PLAYER_BLACK, PAWN);
      this.setPiece(ranks - 1, file, blackPawn);
    }
  }

  allMovesIgnoringCheck(player) {
    const moves = [];
    this.forEachPiece((piece) => {
      if (piece.player === player) {
        piece.possibleMoves(this, moves);
      }
    });
    return moves;
  }

  isAttackedBy(square, player) {
    return !!this.allMovesIgnoringCheck(player)
      .map((move) => move.to)
      .find((squ) => squ === square);
  }

  applyMove(move) {
    const movingPiece = move.from.getPiece();
    move.from.removePiece();
    move.to.setPiece(movingPiece);
    this.history.push({
      player: movingPiece.player,
      from: move.from.asPosition(),
      to: move.to.asPosition(),
      type: movingPiece.type,
    });
  }

  hasKingMoved(player) {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].type === KING && this.history.player === player) {
        return true;
      }
    }
    return false;
  }

  hasKingSideRookMoved(player) {
    return false;
  }

  hasQueenSideRookMoved(player) {
    return false;
  }

  findFirstSquare(fn) {
    for (let rank = 1; rank <= ranks; rank++) {
      for (let file = 1; file <= files; file++) {
        if (fn(this.squares[index(rank, file)])) {
          return this.squares[index(rank, file)];
        }
      }
    }
  }

  forEachSquare(fn) {
    for (let rank = 1; rank <= ranks; rank++) {
      for (let file = 1; file <= files; file++) {
        fn(this.squares[index(rank, file)]);
      }
    }
  }

  forEachPiece(fn) {
    this.forEachSquare((square) => {
      if (square.hasPiece()) {
        fn(square.getPiece());
      }
    });
  }
}

function index(rank, file) {
  if (typeof file === 'string' && /^[a-zA-Z]$/.test(file)) {
    file = file.toLowerCase().charCodeAt(0) - 96; // 97 = 'a'
  }
  return file * files + rank;
}
