import {
  getKingSideRook,
  getSquare as getSquareFromBoard,
  hasKingMoved,
  hasKingSideRookMoved,
  hasQueenSideRookMoved,
  allMovesIgnoringCheckAndCastling,
  isAttackedByMoves,
  getQueenSideRook,
  ranks,
} from '../Board';
import { enemy, is as playerIs, PLAYER_WHITE, PLAYER_BLACK } from '../Player';
import { getSquare as getSquareFromPiece } from '../Piece';
import { is as isType, KING } from '../PieceType';
import { create as createMove } from './Move';
import moveTo from './moveTo';

export default function movesKing(board, moves, king, ignoreCastling) {
  if (!king) {
    throw new Error('Missing mandatory argument: king.');
  }
  if (!isType(king.type, KING)) {
    throw new Error(`Not a king: ${king}`);
  }

  const from = getSquareFromPiece(king, board);
  const rank = from.rank;
  const file = from.file;

  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file));
  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file - 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank, file - 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file - 1));

  if (ignoreCastling) {
    return;
  }

  if (canCastleKingSide(board, king)) {
    addCastleKingSide(board, moves, king);
  }
  if (canCastleQueenSide(board, king)) {
    addCastleQueenSide(board, moves, king);
  }
}

function canCastleKingSide(board, king) {
  if (
    hasKingMoved(board, king.player) ||
    hasKingSideRookMoved(board, king.player)
  ) {
    return false;
  }

  const requiredEmpty = [];
  const requiredUnattacked = [];
  if (playerIs(king.player, PLAYER_WHITE)) {
    requiredEmpty.push(getSquareFromBoard(board, 1, 'b'));
    requiredEmpty.push(getSquareFromBoard(board, 1, 'c'));
    requiredEmpty.push(getSquareFromBoard(board, 1, 'd'));
    requiredUnattacked.push(getSquareFromBoard(board, 1, 'c'));
    requiredUnattacked.push(getSquareFromBoard(board, 1, 'd'));
    // 1-e is the white king's square, adding it to requiredUnattacked makes
    // sure the white king is not in check.
    requiredUnattacked.push(getSquareFromBoard(board, 1, 'e'));
  } else if (playerIs(king.player, PLAYER_BLACK)) {
    requiredEmpty.push(getSquareFromBoard(board, ranks, 'f'));
    requiredEmpty.push(getSquareFromBoard(board, ranks, 'g'));
    requiredEmpty.push(getSquareFromBoard(board, ranks, 'h'));
    // ranks-e is the black king's square, adding it to requiredUnattacked makes
    // sure the black king is not in check.
    requiredUnattacked.push(getSquareFromBoard(board, ranks, 'e'));
    requiredUnattacked.push(getSquareFromBoard(board, ranks, 'f'));
    requiredUnattacked.push(getSquareFromBoard(board, ranks, 'g'));
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  return canCastle(
    board,
    enemy(king.player),
    requiredEmpty,
    requiredUnattacked,
  );
}

function canCastleQueenSide(board, king) {
  if (
    hasKingMoved(board, king.player) ||
    hasQueenSideRookMoved(board, king.player)
  ) {
    return false;
  }

  const requiredEmpty = [];
  const requiredUnattacked = [];
  if (playerIs(king.player, PLAYER_WHITE)) {
    requiredEmpty.push(getSquareFromBoard(board, 1, 'f'));
    requiredEmpty.push(getSquareFromBoard(board, 1, 'g'));
    requiredEmpty.push(getSquareFromBoard(board, 1, 'h'));
    // 1-e is the white king's square, adding it to requiredUnattacked makes
    // sure the white king is not in check.
    requiredUnattacked.push(getSquareFromBoard(board, 1, 'e'));
    requiredUnattacked.push(getSquareFromBoard(board, 1, 'f'));
    requiredUnattacked.push(getSquareFromBoard(board, 1, 'g'));
  } else if (playerIs(king.player, PLAYER_BLACK)) {
    requiredEmpty.push(getSquareFromBoard(board, ranks, 'b'));
    requiredEmpty.push(getSquareFromBoard(board, ranks, 'c'));
    requiredEmpty.push(getSquareFromBoard(board, ranks, 'd'));
    requiredUnattacked.push(getSquareFromBoard(board, ranks, 'c'));
    requiredUnattacked.push(getSquareFromBoard(board, ranks, 'd'));
    // ranks-e is the black king's square, adding it to requiredUnattacked makes
    // sure the black king is not in check.
    requiredUnattacked.push(getSquareFromBoard(board, ranks, 'e'));
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  return canCastle(
    board,
    enemy(king.player),
    requiredEmpty,
    requiredUnattacked,
  );
}

function canCastle(board, enemy, requiredEmpty, requiredUnattacked) {
  for (let i = 0; i < requiredEmpty.length; i++) {
    if (requiredEmpty[i].piece) {
      return false;
    }
  }
  const enemyMoves = allMovesIgnoringCheckAndCastling(board, enemy);
  for (let i = 0; i < requiredUnattacked.length; i++) {
    if (isAttackedByMoves(board, requiredUnattacked[i], enemyMoves)) {
      return false;
    }
  }
  return true;
}

function addCastleKingSide(board, moves, king) {
  const rook = getKingSideRook(board, king.player);
  let castling;
  if (playerIs(king.player, PLAYER_WHITE)) {
    castling = createMove(
      getSquareFromPiece(king, board),
      getSquareFromBoard(board, 1, 'c'),
      getSquareFromPiece(rook, board),
      getSquareFromBoard(board, 1, 'd'),
    );
  } else if (playerIs(king.player, PLAYER_BLACK)) {
    castling = createMove(
      getSquareFromPiece(king, board),
      getSquareFromBoard(board, ranks, 'g'),
      getSquareFromPiece(rook, board),
      getSquareFromBoard(board, ranks, 'f'),
    );
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  moves.push(castling);
}

function addCastleQueenSide(board, moves, king) {
  const rook = getQueenSideRook(board, king.player);
  let castling;
  if (playerIs(king.player, PLAYER_WHITE)) {
    castling = createMove(
      getSquareFromPiece(king, board),
      getSquareFromBoard(board, 1, 'g'),
      getSquareFromPiece(rook, board),
      getSquareFromBoard(board, 1, 'f'),
    );
  } else if (playerIs(king.player, PLAYER_BLACK)) {
    castling = createMove(
      getSquareFromPiece(king, board),
      getSquareFromBoard(board, ranks, 'c'),
      getSquareFromPiece(rook, board),
      getSquareFromBoard(board, ranks, 'd'),
    );
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  moves.push(castling);
}
