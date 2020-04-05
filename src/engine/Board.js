import {PLAYER_WHITE, PLAYER_BLACK} from './Player';
import {PAWN, BISHOP, KNIGHT, ROOK, QUEEN, KING, LASER} from './PieceType';
import Piece from './Piece';
import Square from './Square';

export const files = 9; // columns: a - h on a traditional board
export const ranks = 9; // rows: 1 - 8 on a traditional board

export default class Board {
  constructor() {
    this.squares = [];
    this.moveHistory = [];

    for (let rank = 1; rank <= ranks; rank++) {
      for (let file = 1; file <= files; file++) {
        this.squares[index(rank, file)] = new Square(rank, file);
      }
    }

    this.whiteKingHome = this.getSquare(1, 'e');
    this.whiteKingSideRookHome = this.getSquare(1, 'a');
    this.whiteQueenSideRookHome = this.getSquare(1, files);
    this.blackKingHome = this.getSquare(ranks, 'e');
    this.blackKingSideRookHome = this.getSquare(ranks, files);
    this.blackQueenSideRookHome = this.getSquare(ranks, 'a');
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
        piece.possibleMovesIgnoringCheck(this, moves, false);
      }
    });
    return moves;
  }

  allMovesIgnoringCheckAndCastling(player) {
    const moves = [];
    this.forEachPiece((piece) => {
      if (piece.player === player) {
        piece.possibleMovesIgnoringCheck(this, moves, true);
      }
    });
    return moves;
  }

  isAttackedBy(square, player) {
    return this.isAttackedByMoves(
      square,
      this.allMovesIgnoringCheckAndCastling(player),
    );
  }

  isAttackedByMoves(square, moves) {
    return !!moves.map((move) => move.to).find((s) => s === square);
  }

  applyMove(move) {
    const movingPiece = move.from.getPiece();
    if (!movingPiece) {
      throw new Error(`No piece to move at ${move.from}.`);
    }
    movingPiece.hasMoved = true;
    move.from.removePiece();
    move.to.setPiece(movingPiece);
    const historyEntry = {
      player: movingPiece.player,
      from: move.from.asPosition(),
      to: move.to.asPosition(),
      type: movingPiece.type,
    };

    if (move.castling) {
      const castlingRook = move.from2.getPiece();
      if (!castlingRook) {
        throw new Error(`No rook for castling at ${move.from2}.`);
      }
      castlingRook.hasMoved = true;
      move.from2.removePiece();
      move.to2.setPiece(castlingRook);
      historyEntry.from2 = move.from2;
      historyEntry.to2 = move.to2;
      historyEntry.type2 = castlingRook.type;
    }
    this.moveHistory.push(historyEntry);
  }

  hasKingMoved(player) {
    return hasPlayersPieceMovedFromHome(
      player,
      this.whiteKingHome,
      this.blackKingHome,
    );
  }

  hasKingSideRookMoved(player) {
    return hasPlayersPieceMovedFromHome(
      player,
      this.whiteKingSideRookHome,
      this.blackKingSideRookHome,
    );
  }

  hasQueenSideRookMoved(player) {
    return hasPlayersPieceMovedFromHome(
      player,
      this.whiteQueenSideRookHome,
      this.blackQueenSideRookHome,
    );
  }

  getKingSideRook(player) {
    return getRook(
      player,
      this.whiteKingSideRookHome,
      this.blackKingSideRookHome,
    );
  }

  getQueenSideRook(player) {
    return getRook(
      player,
      this.whiteQueenSideRookHome,
      this.blackQueenSideRookHome,
    );
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

function hasPlayersPieceMovedFromHome(player, homeWhite, homeBlack) {
  let home;
  if (player === PLAYER_WHITE) {
    home = homeWhite;
  } else if (player === PLAYER_BLACK) {
    home = homeBlack;
  } else {
    throw new Error(`Unknown player ${player}.`);
  }
  return hasMovedFromHome(home);
}

function hasMovedFromHome(home) {
  const piece = home.getPiece();
  return !piece || piece.hasMoved;
}

function getRook(player, homeWhite, homeBlack) {
  if (player === PLAYER_WHITE) {
    return homeWhite.piece;
  } else if (player === PLAYER_BLACK) {
    return homeBlack.piece;
  } else {
    throw new Error(`Unknown player ${player}.`);
  }
}
