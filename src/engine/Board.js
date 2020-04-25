import {
  BOTH_KINGS_LOST,
  CHECKMATE,
  IN_PROGRESS,
  KING_LOST,
  KING_SUICIDE,
  STALEMATE,
} from './GameState';
import {NORTH, EAST, SOUTH, WEST} from './Orientation';
import Piece from './Piece';
import {
  PAWN_SHIELD,
  PAWN_90_DEGREES,
  PAWN_THREEWAY,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
  LASER,
} from './PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from './Player';
import Square from './Square';

export const ranks = 9; // rows: 1 - 8 on a traditional board
export const files = 9; // columns: a - h on a traditional board

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

  getPiece(rank, file) {
    const square = this.getSquare(rank, file);
    if (!square) {
      return null;
    }
    return square.getPiece();
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

    this.setPiece(2, 'a', new Piece(PLAYER_WHITE, PAWN_SHIELD));
    this.setPiece(2, 'b', new Piece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH));
    this.setPiece(2, 'c', new Piece(PLAYER_WHITE, PAWN_SHIELD));
    this.setPiece(2, 'd', new Piece(PLAYER_WHITE, PAWN_90_DEGREES, EAST));
    this.setPiece(2, 'e', new Piece(PLAYER_WHITE, PAWN_THREEWAY));
    this.setPiece(2, 'f', new Piece(PLAYER_WHITE, PAWN_90_DEGREES, SOUTH));
    this.setPiece(2, 'g', new Piece(PLAYER_WHITE, PAWN_SHIELD));
    this.setPiece(2, 'h', new Piece(PLAYER_WHITE, PAWN_90_DEGREES, WEST));
    this.setPiece(2, 'i', new Piece(PLAYER_WHITE, PAWN_SHIELD));

    this.setPiece(ranks, 'a', new Piece(PLAYER_BLACK, ROOK));
    this.setPiece(ranks, 'b', new Piece(PLAYER_BLACK, KNIGHT));
    this.setPiece(ranks, 'c', new Piece(PLAYER_BLACK, BISHOP));
    this.setPiece(ranks, 'd', new Piece(PLAYER_BLACK, QUEEN));
    this.setPiece(ranks, 'e', new Piece(PLAYER_BLACK, KING));
    this.setPiece(ranks, 'f', new Piece(PLAYER_BLACK, LASER));
    this.setPiece(ranks, 'g', new Piece(PLAYER_BLACK, BISHOP));
    this.setPiece(ranks, 'h', new Piece(PLAYER_BLACK, KNIGHT));
    this.setPiece(ranks, 'i', new Piece(PLAYER_BLACK, ROOK));

    this.setPiece(ranks - 1, 'a', new Piece(PLAYER_BLACK, PAWN_SHIELD));
    this.setPiece(
      ranks - 1,
      'b',
      new Piece(PLAYER_BLACK, PAWN_90_DEGREES, EAST),
    );
    this.setPiece(ranks - 1, 'c', new Piece(PLAYER_BLACK, PAWN_SHIELD));
    this.setPiece(
      ranks - 1,
      'd',
      new Piece(PLAYER_BLACK, PAWN_90_DEGREES, NORTH),
    );
    this.setPiece(ranks - 1, 'e', new Piece(PLAYER_BLACK, PAWN_THREEWAY));
    this.setPiece(
      ranks - 1,
      'f',
      new Piece(PLAYER_BLACK, PAWN_90_DEGREES, WEST),
    );
    this.setPiece(ranks - 1, 'g', new Piece(PLAYER_BLACK, PAWN_SHIELD));
    this.setPiece(
      ranks - 1,
      'h',
      new Piece(PLAYER_BLACK, PAWN_90_DEGREES, SOUTH),
    );
    this.setPiece(ranks - 1, 'i', new Piece(PLAYER_BLACK, PAWN_SHIELD));
  }

  testSetupCastling() {
    this.setPiece(1, 'a', new Piece(PLAYER_WHITE, ROOK));
    this.setPiece(2, 'e', new Piece(PLAYER_WHITE, LASER));
    this.setPiece(1, 'e', new Piece(PLAYER_WHITE, KING));
    this.setPiece(1, 'i', new Piece(PLAYER_WHITE, ROOK));

    this.setPiece(ranks, 'a', new Piece(PLAYER_BLACK, ROOK));
    this.setPiece(ranks, 'e', new Piece(PLAYER_BLACK, KING));
    this.setPiece(ranks - 1, 'e', new Piece(PLAYER_BLACK, LASER));
    this.setPiece(ranks, 'i', new Piece(PLAYER_BLACK, ROOK));
  }

  testSetupPromotion() {
    this.setPiece(1, 'b', new Piece(PLAYER_WHITE, KNIGHT));
    this.setPiece(1, 'h', new Piece(PLAYER_WHITE, KNIGHT));
    this.setPiece(ranks, 'b', new Piece(PLAYER_BLACK, KNIGHT));
    this.setPiece(ranks, 'h', new Piece(PLAYER_BLACK, KNIGHT));
    this.setPiece(5, 'a', new Piece(PLAYER_WHITE, KING));
    this.setPiece(5, files, new Piece(PLAYER_BLACK, KING));
    for (let file = 1; file <= files; file++) {
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      this.setPiece(ranks - 1, file, whitePawn);
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      this.setPiece(2, file, blackPawn);
    }
  }

  testSetupEnPassant() {
    for (let file = 2; file <= files; file = file + 2) {
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_90_DEGREES);
      this.setPiece(2, file, whitePawn);
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_90_DEGREES);
      this.setPiece(ranks - 1, file, blackPawn);
    }
    for (let file = 1; file <= files; file = file + 2) {
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_90_DEGREES);
      this.setPiece(ranks - 3, file, whitePawn);
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_90_DEGREES);
      this.setPiece(4, file, blackPawn);
    }
  }

  testSetupCheckmate() {
    this.setPiece(2, 'b', new Piece(PLAYER_WHITE, ROOK));
    this.setPiece(3, 'c', new Piece(PLAYER_WHITE, ROOK));
    this.setPiece(1, 'i', new Piece(PLAYER_WHITE, KING));

    this.setPiece(ranks, 'a', new Piece(PLAYER_BLACK, KING));
    this.setPiece(ranks, 'h', new Piece(PLAYER_BLACK, ROOK));
  }

  testSetupLaser() {
    this.setPiece(1, 'c', new Piece(PLAYER_WHITE, LASER, NORTH));
    this.setPiece(7, 'b', new Piece(PLAYER_WHITE, LASER, EAST));
    this.setPiece(6, 'g', new Piece(PLAYER_WHITE, LASER, SOUTH));
    this.setPiece(3, 'h', new Piece(PLAYER_WHITE, LASER, WEST));

    this.setPiece(9, 'c', new Piece(PLAYER_BLACK, KING, NORTH));
    this.setPiece(7, 'h', new Piece(PLAYER_BLACK, KING, EAST));
    this.setPiece(2, 'g', new Piece(PLAYER_BLACK, KING, SOUTH));
    this.setPiece(3, 'b', new Piece(PLAYER_BLACK, KING, WEST));

    this.setPiece(1, 'f', new Piece(PLAYER_BLACK, LASER, NORTH));
    this.setPiece(5, 'a', new Piece(PLAYER_BLACK, LASER, EAST));
    this.setPiece(9, 'd', new Piece(PLAYER_BLACK, LASER, SOUTH));
    this.setPiece(4, 'i', new Piece(PLAYER_BLACK, LASER, WEST));

    this.setPiece(9, 'f', new Piece(PLAYER_WHITE, KING, NORTH));
    this.setPiece(5, 'i', new Piece(PLAYER_WHITE, KING, EAST));
    this.setPiece(1, 'd', new Piece(PLAYER_WHITE, KING, SOUTH));
    this.setPiece(4, 'a', new Piece(PLAYER_WHITE, KING, WEST));
  }

  testSetupKnightSplitLaser() {
    this.setPiece(1, 'd', new Piece(PLAYER_WHITE, LASER));
    this.setPiece(5, 'd', new Piece(PLAYER_WHITE, KNIGHT));

    this.setPiece(5, 'b', new Piece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH));
    this.setPiece(2, 'c', new Piece(PLAYER_WHITE, PAWN_SHIELD, WEST));
    this.setPiece(2, 'g', new Piece(PLAYER_WHITE, PAWN_THREEWAY, EAST));
    this.setPiece(2, 'h', new Piece(PLAYER_WHITE, PAWN_90_DEGREES, WEST));

    this.setPiece(ranks - 2, 'c', new Piece(PLAYER_BLACK, KNIGHT, WEST));
    this.setPiece(ranks, 'f', new Piece(PLAYER_BLACK, LASER));
    this.setPiece(ranks - 4, 'h', new Piece(PLAYER_BLACK, KNIGHT, EAST));

    this.setPiece(
      ranks - 2,
      'b',
      new Piece(PLAYER_BLACK, PAWN_90_DEGREES, EAST),
    );
    this.setPiece(ranks - 1, 'c', new Piece(PLAYER_BLACK, PAWN_SHIELD, WEST));
    this.setPiece(ranks - 1, 'g', new Piece(PLAYER_BLACK, PAWN_THREEWAY, EAST));
    this.setPiece(
      ranks - 1,
      'h',
      new Piece(PLAYER_BLACK, PAWN_90_DEGREES, SOUTH),
    );
  }

  getPlayerByBoardIoLabel(playerBoardIoLabel) {
    if (playerBoardIoLabel === PLAYER_WHITE.boardIoLabel) {
      return PLAYER_WHITE;
    } else if (playerBoardIoLabel === PLAYER_BLACK.boardIoLabel) {
      return PLAYER_BLACK;
    }
    return null;
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

  allMoves(player) {
    const moves = [];
    this.forEachPiece((piece) => {
      if (piece.player === player) {
        piece.possibleMoves(this, moves);
      }
    });
    return moves;
  }

  pruneMovesThatLeadToCheckFor(moves, player) {
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const resultingBoard = this.simulateMove(move);

      const kingsSquare = resultingBoard.getKingsSquare(player);
      if (!kingsSquare) {
        console.warn(
          `pruneMovesThatLeadToCheckFor: Couldn't find king for player ${player}.`,
        );
        return;
      }

      if (resultingBoard.isAttackedBy(kingsSquare, player.enemy())) {
        moves.splice(i--, 1); // need to adjust i after splicing, thus i--
      }
    }
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

    let captured;
    if (move.enPassantCapture) {
      captured = move.enPassantCapture.removePiece();
    } else {
      captured = move.to.removePiece();
    }
    move.to.setPiece(movingPiece);
    const historyEntry = {
      player: movingPiece.player,
      from: move.from.asPosition(),
      to: move.to.asPosition(),
      type: movingPiece.type,
      captured,
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

  applyPromotionMove(promotionMove) {
    const promotingPiece = promotionMove.from.getPiece();
    if (!promotingPiece) {
      throw new Error(`No piece to move/promote at ${promotionMove.from}.`);
    }
    promotionMove.from.removePiece();
    const player = promotingPiece.player;
    const promotedPiece = new Piece(player, promotionMove.promotionTo);
    const captured = promotionMove.to.removePiece();
    promotionMove.to.setPiece(promotedPiece);
    this.moveHistory.push({
      player: player,
      from: promotionMove.from.asPosition(),
      to: promotionMove.to.asPosition(),
      type: promotingPiece.type,
      promotionTo: promotionMove.promotionTo,
      captured,
    });
  }

  applyShot(shot) {
    const firstSegment = shot.segments[0];
    if (!firstSegment) {
      throw new Error(`Shot has no segments: ${shot}`);
    }
    const shootingFrom = firstSegment.square;
    if (!shootingFrom) {
      throw new Error(`First segment of shot has no square: ${shot}`);
    }
    const shootingPiece = shootingFrom.getPiece();
    if (!shootingPiece) {
      throw new Error(
        `Square from first segment of shot has no piece on it: ${shot}`,
      );
    }
    const historyEntry = {
      from: shootingFrom.asPosition(),
      type: LASER,
      player: shootingPiece.player,
      shot: {
        targets: [],
      },
    };
    for (let i = 0; i < shot.destroyedSquares.length; i++) {
      const destroyed = shot.destroyedSquares[i].removePiece();
      if (destroyed) {
        historyEntry.shot.targets[i] = {
          square: shot.destroyedSquares[i].asPosition(),
          player: destroyed.player,
          type: destroyed.type,
        };
      } else {
        console.warn(
          `Laser shot has a destroyed square without a piece on it: (${
            shot.destroyedSquares[i].rank
          }, ${shot.destroyedSquares[i].getFileAsLetter()}).`,
        );
      }
    }
    this.moveHistory.push(historyEntry);
  }

  simulateMove(move) {
    const clonedBoard = this.clone();
    const moveForClonedBoard = move.transferToClonedBoard(clonedBoard);
    clonedBoard.applyMove(moveForClonedBoard);
    return clonedBoard;
  }

  laserCanFire(laser) {
    const player = laser.player;
    const resultingBoard = this.simulateShot(laser);
    const kingsSquare = resultingBoard.getKingsSquare(player);
    if (!kingsSquare) {
      console.warn(
        `laserCanFire: Couldn't find king for player ${player.label.color}.`,
      );
      return;
    }

    return !resultingBoard.isAttackedBy(kingsSquare, player.enemy());
  }

  simulateShot(laser) {
    const clonedBoard = this.clone();
    const laserOnClonedBoard = clonedBoard.getPiece(laser.rank, laser.file);
    const shot = laserOnClonedBoard.fire(clonedBoard);
    clonedBoard.applyShot(shot);
    return clonedBoard;
  }

  clone() {
    const clonedBoard = Object.create(Board.prototype);
    clonedBoard.squares = this.squares.map((s) => s.clone());
    // Deliberately not cloning the move history, it is not needed for
    // simulating moves.
    clonedBoard.moveHistory = [];
    [
      'whiteKingHome',
      'whiteKingSideRookHome',
      'whiteQueenSideRookHome',
      'blackKingHome',
      'blackKingSideRookHome',
      'blackQueenSideRookHome',
    ].forEach((attrib) => (clonedBoard[attrib] = this[attrib]));
    return clonedBoard;
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

  getKingsSquare(player) {
    return this.findFirstSquare(
      (square) =>
        square.hasPiece() &&
        square.getPiece().type === KING &&
        square.getPiece().player === player,
    );
  }

  getKing(player) {
    const kingsSquare = this.getKingsSquare(player);
    if (!kingsSquare) {
      console.warn(
        `getKing: Couldn't find king for player ${player.color.label}.`,
      );
      return null;
    }
    return kingsSquare.getPiece();
  }

  getLaserPieces(player) {
    const laserPieces = [];
    this.forEachPiece((piece) => {
      if (piece.type === LASER && piece.player === player) {
        laserPieces.push(piece);
      }
    });
    return laserPieces;
  }

  /**
   * Computes whether this game has ended (checkmate, stalemate) or is still in
   * progress.
   */
  computeGameState(player) {
    const king = this.getKing(player);
    const enemyKing = this.getKing(player.enemy());
    if (enemyKing && !king) {
      return KING_LOST;
    } else if (king && !enemyKing) {
      // We check this at the start of the turn for the player that is about to
      // start their turn. This means that if we cannot find the enemy king,
      // the enemy of the current player has shot their own king in the previous
      // move.
      return KING_SUICIDE;
    } else if (!king && !enemyKing) {
      return BOTH_KINGS_LOST;
    }

    const allMoves = this.allMoves(player);
    const playerIsInCheck = this._isPlayerInCheck(player);
    if (allMoves.length === 0 && playerIsInCheck) {
      return CHECKMATE;
    } else if (allMoves.length === 0 && !playerIsInCheck) {
      return STALEMATE;
    }
    return IN_PROGRESS;
  }

  /**
   * Computes whether a player is in check.
   */
  _isPlayerInCheck(player) {
    const kingsSquare = this.getKingsSquare(player);
    if (!kingsSquare) {
      console.warn(`isPlayerInCheck: Couldn't find king for player ${player}.`);
      return false;
    }

    const allMovesForEnemyIgnoringCheckAndCastling = this.allMovesIgnoringCheckAndCastling(
      player.enemy(),
    );

    return this.isAttackedByMoves(
      kingsSquare,
      allMovesForEnemyIgnoringCheckAndCastling,
    );
  }

  getLastMove() {
    if (this.moveHistory.length === 0) {
      return null;
    }
    return this.moveHistory[this.moveHistory.length - 1];
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
