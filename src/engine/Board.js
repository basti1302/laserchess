import {
  BOTH_KINGS_LOST,
  CHECKMATE,
  IN_PROGRESS,
  KING_LOST,
  KING_SUICIDE,
  STALEMATE,
} from './gameStates';
import { transferToBoard as transferMoveToBoard } from './moves/Move';
import { transferToBoard as transferShotToBoard } from './laser/Shot';
import { NORTH, EAST, SOUTH, WEST } from './Orientation';
import {
  create as createPiece,
  fire,
  possibleMoves,
  possibleMovesIgnoringCheck,
} from './Piece';
import {
  is as isType,
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
import { enemy, is as isPlayer, PLAYER_WHITE, PLAYER_BLACK } from './Player';
import {
  asPosition,
  clone as cloneSquare,
  create as createSquare,
  getFileAsLetter,
  is as isSquare,
  removePiece,
  setPiece as setPieceOnSquare,
} from './Square';

export const ranks = 9; // rows: 1 - 8 on a traditional board
export const files = 9; // columns: a - h on a traditional board

export function create() {
  const squares = [];

  for (let rank = 1; rank <= ranks; rank++) {
    for (let file = 1; file <= files; file++) {
      squares[index(rank, file)] = createSquare(rank, file);
    }
  }

  const board = {
    squares,
    moveHistory: [],
  };

  board.whiteKingHome = getSquare(board, 1, 'e');
  board.whiteKingSideRookHome = getSquare(board, 1, 'a');
  board.whiteQueenSideRookHome = getSquare(board, 1, files);
  board.blackKingHome = getSquare(board, ranks, 'e');
  board.blackKingSideRookHome = getSquare(board, ranks, files);
  board.blackQueenSideRookHome = getSquare(board, ranks, 'a');

  return board;
}

export function getSquare(board, rank, file) {
  if (rank <= 0 || file <= 0 || rank > ranks || file > files) {
    return null;
  }
  return board.squares[index(rank, file)];
}

export function getPiece(board, rank, file) {
  const square = getSquare(board, rank, file);
  if (!square) {
    return null;
  }
  return square.piece;
}

export function setPiece(board, rank, file, piece) {
  if (file <= 0 || rank <= 0 || file > files || rank > ranks) {
    return;
  }
  const square = board.squares[index(rank, file)];
  setPieceOnSquare(square, piece);
}

export function getSelectedSquare(board) {
  return findFirstSquare(board, square => square.selected);
}

export function deselectAll(board) {
  forEachSquare(board, square => (square.selected = false));
}

export function setup(board) {
  setupGame(board);
  // testSetupCastling(board);
  // testSetupPromotion(board);
  // testSetupEnPassant(board);
  // testSetupCheckmate(board);
  // testSetupLaser(board);
  // testSetupKnightSplitLaser(board);
}

function setupGame(board) {
  setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, ROOK));
  setPiece(board, 1, 'b', createPiece(PLAYER_WHITE, KNIGHT));
  setPiece(board, 1, 'c', createPiece(PLAYER_WHITE, BISHOP));
  setPiece(board, 1, 'd', createPiece(PLAYER_WHITE, LASER));
  setPiece(board, 1, 'e', createPiece(PLAYER_WHITE, KING));
  setPiece(board, 1, 'f', createPiece(PLAYER_WHITE, QUEEN));
  setPiece(board, 1, 'g', createPiece(PLAYER_WHITE, BISHOP));
  setPiece(board, 1, 'h', createPiece(PLAYER_WHITE, KNIGHT));
  setPiece(board, 1, 'i', createPiece(PLAYER_WHITE, ROOK));

  setPiece(board, 2, 'a', createPiece(PLAYER_WHITE, PAWN_SHIELD));
  setPiece(board, 2, 'b', createPiece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH));
  setPiece(board, 2, 'c', createPiece(PLAYER_WHITE, PAWN_SHIELD));
  setPiece(board, 2, 'd', createPiece(PLAYER_WHITE, PAWN_90_DEGREES, EAST));
  setPiece(board, 2, 'e', createPiece(PLAYER_WHITE, PAWN_THREEWAY));
  setPiece(board, 2, 'f', createPiece(PLAYER_WHITE, PAWN_90_DEGREES, SOUTH));
  setPiece(board, 2, 'g', createPiece(PLAYER_WHITE, PAWN_SHIELD));
  setPiece(board, 2, 'h', createPiece(PLAYER_WHITE, PAWN_90_DEGREES, WEST));
  setPiece(board, 2, 'i', createPiece(PLAYER_WHITE, PAWN_SHIELD));

  setPiece(board, ranks, 'a', createPiece(PLAYER_BLACK, ROOK));
  setPiece(board, ranks, 'b', createPiece(PLAYER_BLACK, KNIGHT));
  setPiece(board, ranks, 'c', createPiece(PLAYER_BLACK, BISHOP));
  setPiece(board, ranks, 'd', createPiece(PLAYER_BLACK, QUEEN));
  setPiece(board, ranks, 'e', createPiece(PLAYER_BLACK, KING));
  setPiece(board, ranks, 'f', createPiece(PLAYER_BLACK, LASER));
  setPiece(board, ranks, 'g', createPiece(PLAYER_BLACK, BISHOP));
  setPiece(board, ranks, 'h', createPiece(PLAYER_BLACK, KNIGHT));
  setPiece(board, ranks, 'i', createPiece(PLAYER_BLACK, ROOK));

  setPiece(board, ranks - 1, 'a', createPiece(PLAYER_BLACK, PAWN_SHIELD));
  setPiece(
    board,
    ranks - 1,
    'b',
    createPiece(PLAYER_BLACK, PAWN_90_DEGREES, EAST),
  );
  setPiece(board, ranks - 1, 'c', createPiece(PLAYER_BLACK, PAWN_SHIELD));
  setPiece(
    board,
    ranks - 1,
    'd',
    createPiece(PLAYER_BLACK, PAWN_90_DEGREES, NORTH),
  );
  setPiece(board, ranks - 1, 'e', createPiece(PLAYER_BLACK, PAWN_THREEWAY));
  setPiece(
    board,
    ranks - 1,
    'f',
    createPiece(PLAYER_BLACK, PAWN_90_DEGREES, WEST),
  );
  setPiece(board, ranks - 1, 'g', createPiece(PLAYER_BLACK, PAWN_SHIELD));
  setPiece(
    board,
    ranks - 1,
    'h',
    createPiece(PLAYER_BLACK, PAWN_90_DEGREES, SOUTH),
  );
  setPiece(board, ranks - 1, 'i', createPiece(PLAYER_BLACK, PAWN_SHIELD));
}

// eslint-disable-next-line no-unused-vars
function testSetupCastling(board) {
  setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, ROOK));
  setPiece(board, 2, 'e', createPiece(PLAYER_WHITE, LASER));
  setPiece(board, 1, 'e', createPiece(PLAYER_WHITE, KING));
  setPiece(board, 1, 'i', createPiece(PLAYER_WHITE, ROOK));

  setPiece(board, ranks, 'a', createPiece(PLAYER_BLACK, ROOK));
  setPiece(board, ranks, 'e', createPiece(PLAYER_BLACK, KING));
  setPiece(board, ranks - 1, 'e', createPiece(PLAYER_BLACK, LASER));
  setPiece(board, ranks, 'i', createPiece(PLAYER_BLACK, ROOK));
}

// eslint-disable-next-line no-unused-vars
function testSetupPromotion(board) {
  setPiece(board, 1, 'b', createPiece(PLAYER_WHITE, KNIGHT));
  setPiece(board, 1, 'h', createPiece(PLAYER_WHITE, KNIGHT));
  setPiece(board, ranks, 'b', createPiece(PLAYER_BLACK, KNIGHT));
  setPiece(board, ranks, 'h', createPiece(PLAYER_BLACK, KNIGHT));
  setPiece(board, 5, 'a', createPiece(PLAYER_WHITE, KING));
  setPiece(board, 5, files, createPiece(PLAYER_BLACK, KING));
  for (let file = 1; file <= files; file++) {
    const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
    setPiece(board, ranks - 1, file, whitePawn);
    const blackPawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
    setPiece(board, 2, file, blackPawn);
  }
}

// eslint-disable-next-line no-unused-vars
function testSetupEnPassant(board) {
  setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
  setPiece(board, 9, 'a', createPiece(PLAYER_BLACK, KING));

  for (let file = 2; file <= files; file = file + 2) {
    const whitePawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES);
    setPiece(board, 2, file, whitePawn);
    const blackPawn = createPiece(PLAYER_BLACK, PAWN_90_DEGREES);
    setPiece(board, ranks - 1, file, blackPawn);
  }
  for (let file = 1; file <= files; file = file + 2) {
    const whitePawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES);
    setPiece(board, ranks - 3, file, whitePawn);
    const blackPawn = createPiece(PLAYER_BLACK, PAWN_90_DEGREES);
    setPiece(board, 4, file, blackPawn);
  }
}

// eslint-disable-next-line no-unused-vars
function testSetupCheckmate(board) {
  setPiece(board, 2, 'b', createPiece(PLAYER_WHITE, ROOK));
  setPiece(board, 3, 'c', createPiece(PLAYER_WHITE, ROOK));
  setPiece(board, 1, 'i', createPiece(PLAYER_WHITE, KING));

  setPiece(board, ranks, 'a', createPiece(PLAYER_BLACK, KING));
  setPiece(board, ranks, 'h', createPiece(PLAYER_BLACK, ROOK));
  setPiece(board, ranks, 'g', createPiece(PLAYER_BLACK, ROOK));
}

// eslint-disable-next-line no-unused-vars
function testSetupLaser(board) {
  setPiece(board, 1, 'c', createPiece(PLAYER_WHITE, LASER, NORTH));
  setPiece(board, 7, 'b', createPiece(PLAYER_WHITE, LASER, EAST));
  setPiece(board, 6, 'g', createPiece(PLAYER_WHITE, LASER, SOUTH));
  setPiece(board, 3, 'h', createPiece(PLAYER_WHITE, LASER, WEST));
  setPiece(board, 3, 'i', createPiece(PLAYER_WHITE, QUEEN, EAST));

  setPiece(board, 9, 'c', createPiece(PLAYER_BLACK, KING));
  setPiece(board, 7, 'e', createPiece(PLAYER_BLACK, PAWN_SHIELD));
  setPiece(board, 2, 'g', createPiece(PLAYER_BLACK, PAWN_SHIELD));
  setPiece(board, 3, 'b', createPiece(PLAYER_BLACK, PAWN_SHIELD));

  setPiece(board, 1, 'f', createPiece(PLAYER_BLACK, LASER, NORTH));
  setPiece(board, 5, 'a', createPiece(PLAYER_BLACK, LASER, EAST));
  setPiece(board, 9, 'd', createPiece(PLAYER_BLACK, LASER, SOUTH));
  setPiece(board, 4, 'i', createPiece(PLAYER_BLACK, LASER, WEST));
  setPiece(board, 7, 'h', createPiece(PLAYER_BLACK, LASER, WEST));

  setPiece(board, 9, 'f', createPiece(PLAYER_WHITE, KING, NORTH));
  setPiece(board, 5, 'i', createPiece(PLAYER_WHITE, PAWN_SHIELD));
  setPiece(board, 1, 'd', createPiece(PLAYER_WHITE, PAWN_SHIELD));
  setPiece(board, 4, 'a', createPiece(PLAYER_WHITE, PAWN_SHIELD));
}

// eslint-disable-next-line no-unused-vars
function testSetupKnightSplitLaser(board) {
  setPiece(board, 1, 'i', createPiece(PLAYER_WHITE, KING, NORTH));
  setPiece(board, 9, 'i', createPiece(PLAYER_BLACK, KING, NORTH));

  setPiece(board, 1, 'd', createPiece(PLAYER_WHITE, LASER));
  setPiece(board, 5, 'd', createPiece(PLAYER_WHITE, KNIGHT));

  setPiece(board, 5, 'b', createPiece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH));
  setPiece(board, 2, 'c', createPiece(PLAYER_WHITE, PAWN_SHIELD, WEST));
  setPiece(board, 2, 'g', createPiece(PLAYER_WHITE, PAWN_THREEWAY, EAST));
  setPiece(board, 2, 'h', createPiece(PLAYER_WHITE, PAWN_90_DEGREES, WEST));

  setPiece(board, ranks - 2, 'c', createPiece(PLAYER_BLACK, KNIGHT, WEST));
  setPiece(board, ranks, 'f', createPiece(PLAYER_BLACK, LASER));
  setPiece(board, ranks - 4, 'h', createPiece(PLAYER_BLACK, KNIGHT, EAST));

  setPiece(
    board,
    ranks - 2,
    'b',
    createPiece(PLAYER_BLACK, PAWN_90_DEGREES, EAST),
  );
  setPiece(board, ranks - 1, 'c', createPiece(PLAYER_BLACK, PAWN_SHIELD, WEST));
  setPiece(
    board,
    ranks - 1,
    'g',
    createPiece(PLAYER_BLACK, PAWN_THREEWAY, EAST),
  );
  setPiece(
    board,
    ranks - 1,
    'h',
    createPiece(PLAYER_BLACK, PAWN_90_DEGREES, SOUTH),
  );
}

export function getPlayerByBoardIoLabel(board, playerBoardIoLabel) {
  if (playerBoardIoLabel === PLAYER_WHITE.boardIoLabel) {
    return PLAYER_WHITE;
  } else if (playerBoardIoLabel === PLAYER_BLACK.boardIoLabel) {
    return PLAYER_BLACK;
  }
  return null;
}

export function allMovesIgnoringCheck(board, player) {
  const moves = [];
  forEachPiece(board, piece => {
    if (isPlayer(piece.player, player)) {
      possibleMovesIgnoringCheck(piece, board, moves, false);
    }
  });
  return moves;
}

export function allMovesIgnoringCheckAndCastling(board, player) {
  const moves = [];
  forEachPiece(board, piece => {
    if (isPlayer(piece.player, player)) {
      possibleMovesIgnoringCheck(piece, board, moves, true);
    }
  });
  return moves;
}

function allMoves(board, player) {
  const moves = [];
  forEachPiece(board, piece => {
    if (isPlayer(piece.player, player)) {
      possibleMoves(piece, board, moves);
    }
  });
  return moves;
}

export function pruneMovesThatLeadToCheckFor(board, moves, player) {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const resultingBoard = simulateMove(board, move);

    const kingsSquare = getKingsSquare(resultingBoard, player);
    if (!kingsSquare) {
      console.warn(
        `pruneMovesThatLeadToCheckFor: Couldn't find king for player ${player}.`,
      );
      return;
    }

    if (isAttackedBy(resultingBoard, kingsSquare, enemy(player))) {
      moves.splice(i--, 1); // need to adjust i after splicing, thus i--
    }
  }
}

export function isAttackedBy(board, square, player) {
  return isAttackedByMoves(
    board,
    square,
    allMovesIgnoringCheckAndCastling(board, player),
  );
}

export function isAttackedByMoves(board, square, moves) {
  return !!moves.map(move => move.to).find(s => isSquare(s, square));
}

export function applyMove(board, move) {
  move = transferMoveToBoard(move, board);
  const movingPiece = move.from.piece;
  if (!movingPiece) {
    throw new Error(`No piece to move at ${move.from}.`);
  }
  movingPiece.hasMoved = true;
  removePiece(move.from);

  let captured;
  if (move.enPassantCapture) {
    captured = removePiece(move.enPassantCapture);
  } else {
    captured = removePiece(move.to);
  }
  setPieceOnSquare(move.to, movingPiece);
  const historyEntry = {
    player: movingPiece.player,
    from: asPosition(move.from),
    to: asPosition(move.to),
    type: movingPiece.type,
    captured,
  };

  if (move.castling) {
    const castlingRook = move.from2.piece;
    if (!castlingRook) {
      throw new Error(`No rook for castling at ${move.from2}.`);
    }
    castlingRook.hasMoved = true;
    removePiece(move.from2);
    setPieceOnSquare(move.to2, castlingRook);
    historyEntry.from2 = move.from2;
    historyEntry.to2 = move.to2;
    historyEntry.type2 = castlingRook.type;
  }
  board.moveHistory.push(historyEntry);
}

export function applyPromotionMove(board, promotionMove) {
  promotionMove = transferMoveToBoard(promotionMove, board);
  const promotingPiece = promotionMove.from.piece;
  if (!promotingPiece) {
    throw new Error(`No piece to move/promote at ${promotionMove.from}.`);
  }
  removePiece(promotionMove.from);
  const player = promotingPiece.player;
  const promotedPiece = createPiece(player, promotionMove.promotionTo);
  const captured = removePiece(promotionMove.to);
  setPieceOnSquare(promotionMove.to, promotedPiece);
  board.moveHistory.push({
    player: player,
    from: asPosition(promotionMove.from),
    to: asPosition(promotionMove.to),
    type: promotingPiece.type,
    promotionTo: promotionMove.promotionTo,
    captured,
  });
}

export function applyShot(board, shot) {
  shot = transferShotToBoard(shot, board);
  const firstSegment = shot.segments[0];
  if (!firstSegment) {
    throw new Error(`Shot has no segments: ${shot}`);
  }
  const shootingFrom = firstSegment.square;
  if (!shootingFrom) {
    throw new Error(`First segment of shot has no square: ${shot}`);
  }
  const shootingPiece = shootingFrom.piece;
  if (!shootingPiece) {
    throw new Error(
      `Square from first segment of shot has no piece on it: ${shot}`,
    );
  }
  const historyEntry = {
    from: asPosition(shootingFrom),
    type: LASER,
    player: shootingPiece.player,
    shot: {
      targets: [],
    },
  };
  for (let i = 0; i < shot.destroyedSquares.length; i++) {
    const destroyed = removePiece(shot.destroyedSquares[i]);
    if (destroyed) {
      historyEntry.shot.targets[i] = {
        square: asPosition(shot.destroyedSquares[i]),
        player: destroyed.player,
        type: destroyed.type,
      };
    } else {
      console.warn(
        `Laser shot has a destroyed square without a piece on it: (${
          shot.destroyedSquares[i].rank
        }, ${getFileAsLetter(shot.destroyedSquares[i])}).`,
      );
    }
  }
  board.moveHistory.push(historyEntry);
}

export function simulateMove(board, move) {
  const clonedBoard = clone(board);
  const moveForClonedBoard = transferMoveToBoard(move, clonedBoard);
  applyMove(clonedBoard, moveForClonedBoard);
  return clonedBoard;
}

export function laserCanFire(board, laser) {
  const player = laser.player;
  const resultingBoard = simulateShot(board, laser);
  const kingsSquare = getKingsSquare(resultingBoard, player);
  if (!kingsSquare) {
    // This can happen if the laser aims at its own king. After simulating the
    // shot, the king is gone on the resulting board. However, this shot is
    // allowed (the laser is allowed to shoot its own king).
    return true;
  }

  return !isAttackedBy(resultingBoard, kingsSquare, enemy(player));
}

function simulateShot(board, laser) {
  const clonedBoard = clone(board);
  const laserOnClonedBoard = getPiece(clonedBoard, laser.rank, laser.file);
  const shot = fire(laserOnClonedBoard, clonedBoard);
  applyShot(clonedBoard, shot);
  return clonedBoard;
}

export function clone(board) {
  const clonedBoard = {};
  clonedBoard.squares = board.squares.map(s => cloneSquare(s));
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
  ].forEach(attrib => (clonedBoard[attrib] = board[attrib]));
  return clonedBoard;
}

export function hasKingMoved(board, player) {
  return hasPlayersPieceMovedFromHome(
    player,
    board.whiteKingHome,
    board.blackKingHome,
  );
}

export function hasKingSideRookMoved(board, player) {
  return hasPlayersPieceMovedFromHome(
    player,
    board.whiteKingSideRookHome,
    board.blackKingSideRookHome,
  );
}

export function hasQueenSideRookMoved(board, player) {
  return hasPlayersPieceMovedFromHome(
    player,
    board.whiteQueenSideRookHome,
    board.blackQueenSideRookHome,
  );
}

export function getKingSideRook(board, player) {
  return getRook(
    player,
    board.whiteKingSideRookHome,
    board.blackKingSideRookHome,
  );
}

export function getQueenSideRook(board, player) {
  return getRook(
    player,
    board.whiteQueenSideRookHome,
    board.blackQueenSideRookHome,
  );
}

function getKingsSquare(board, player) {
  return findFirstSquare(
    board,
    square =>
      square.piece &&
      isType(square.piece.type, KING) &&
      isPlayer(square.piece.player, player),
  );
}

function getKing(board, player) {
  const kingsSquare = getKingsSquare(board, player);
  if (!kingsSquare) {
    console.warn(
      `getKing: Couldn't find king for player ${player.color.label}.`,
    );
    return null;
  }
  return kingsSquare.piece;
}

export function getLaserPieces(board, player) {
  const laserPieces = [];
  forEachPiece(board, piece => {
    if (isType(piece.type, LASER) && isPlayer(piece.player, player)) {
      laserPieces.push(piece);
    }
  });
  return laserPieces;
}

/**
 * Computes whether this game has ended (checkmate, stalemate) or is still in
 * progress.
 */
export function computeGameState(board, player) {
  const king = getKing(board, player);
  const enemyKing = getKing(board, enemy(player));
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

  const noMovesLeft = allMoves(board, player).length === 0;
  const playerIsInCheck = isPlayerInCheck(board, player);
  if (noMovesLeft && playerIsInCheck) {
    return CHECKMATE;
  } else if (noMovesLeft && !playerIsInCheck) {
    return STALEMATE;
  }
  return IN_PROGRESS;
}

/**
 * Computes whether a player is in check.
 */
function isPlayerInCheck(board, player) {
  const kingsSquare = getKingsSquare(board, player);
  if (!kingsSquare) {
    console.warn(`isPlayerInCheck: Couldn't find king for player ${player}.`);
    return false;
  }

  const allMovesForEnemyIgnoringCheckAndCastling = allMovesIgnoringCheckAndCastling(
    board,
    enemy(player),
  );

  return isAttackedByMoves(
    board,
    kingsSquare,
    allMovesForEnemyIgnoringCheckAndCastling,
  );
}

export function getLastMove(board) {
  if (board.moveHistory.length === 0) {
    return null;
  }
  return board.moveHistory[board.moveHistory.length - 1];
}

function findFirstSquare(board, fn) {
  for (let rank = 1; rank <= ranks; rank++) {
    for (let file = 1; file <= files; file++) {
      if (fn(board.squares[index(rank, file)])) {
        return board.squares[index(rank, file)];
      }
    }
  }
}

export function forEachSquare(board, fn) {
  for (let rank = 1; rank <= ranks; rank++) {
    for (let file = 1; file <= files; file++) {
      fn(board.squares[index(rank, file)]);
    }
  }
}

function forEachPiece(board, fn) {
  forEachSquare(board, square => {
    if (square.piece) {
      fn(square.piece);
    }
  });
}

function index(rank, file) {
  if (typeof file === 'string' && /^[a-zA-Z]$/.test(file)) {
    file = file.toLowerCase().charCodeAt(0) - 96; // 97 = 'a'
  }
  return file * files + rank;
}

function hasPlayersPieceMovedFromHome(player, homeWhite, homeBlack) {
  let home;
  if (isPlayer(player, PLAYER_WHITE)) {
    home = homeWhite;
  } else if (isPlayer(player, PLAYER_BLACK)) {
    home = homeBlack;
  } else {
    throw new Error(`Unknown player ${player}.`);
  }
  return hasMovedFromHome(home);
}

function hasMovedFromHome(home) {
  const piece = home.piece;
  return !piece || piece.hasMoved;
}

function getRook(player, homeWhite, homeBlack) {
  if (isPlayer(player, PLAYER_WHITE)) {
    return homeWhite.piece;
  } else if (isPlayer(player, PLAYER_BLACK)) {
    return homeBlack.piece;
  } else {
    throw new Error(`Unknown player ${player}.`);
  }
}
