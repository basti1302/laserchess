import {PLAYER_WHITE, PLAYER_BLACK} from '../Player';
import {KING} from '../PieceType';
import {ranks} from '../Board';
import Move from './Move';
import moveTo from './moveTo';

export default function movesKing(board, moves, king, ignoreCastling) {
  if (king.constructor.name !== 'Piece') {
    throw new Error(
      `Illegal argument for piece: ${king.constructor.name}: ${king}`,
    );
  }
  if (king.type !== KING) {
    throw new Error(`Not a king: ${king}`);
  }

  const from = king.getSquare(board);
  const rank = from.rank;
  const file = from.file;

  moveTo(board, moves, from, board.getSquare(rank + 1, file));
  moveTo(board, moves, from, board.getSquare(rank + 1, file + 1));
  moveTo(board, moves, from, board.getSquare(rank, file + 1));
  moveTo(board, moves, from, board.getSquare(rank - 1, file + 1));
  moveTo(board, moves, from, board.getSquare(rank - 1, file));
  moveTo(board, moves, from, board.getSquare(rank - 1, file - 1));
  moveTo(board, moves, from, board.getSquare(rank, file - 1));
  moveTo(board, moves, from, board.getSquare(rank + 1, file - 1));

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
    board.hasKingMoved(king.player) ||
    board.hasKingSideRookMoved(king.player)
  ) {
    return false;
  }

  const requiredEmpty = [];
  const requiredUnattacked = [];
  if (king.player === PLAYER_WHITE) {
    requiredEmpty.push(board.getSquare(1, 'b'));
    requiredEmpty.push(board.getSquare(1, 'c'));
    requiredEmpty.push(board.getSquare(1, 'd'));
    requiredUnattacked.push(board.getSquare(1, 'c'));
    requiredUnattacked.push(board.getSquare(1, 'd'));
    // 1-e is the white king's square, adding it to requiredUnattacked makes
    // sure the white king is not in check.
    requiredUnattacked.push(board.getSquare(1, 'e'));
  } else if (king.player === PLAYER_BLACK) {
    requiredEmpty.push(board.getSquare(ranks, 'f'));
    requiredEmpty.push(board.getSquare(ranks, 'g'));
    requiredEmpty.push(board.getSquare(ranks, 'h'));
    // ranks-e is the black king's square, adding it to requiredUnattacked makes
    // sure the black king is not in check.
    requiredUnattacked.push(board.getSquare(ranks, 'e'));
    requiredUnattacked.push(board.getSquare(ranks, 'f'));
    requiredUnattacked.push(board.getSquare(ranks, 'g'));
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  return canCastle(
    board,
    king.player.enemy(),
    requiredEmpty,
    requiredUnattacked,
  );
}

function canCastleQueenSide(board, king) {
  if (
    board.hasKingMoved(king.player) ||
    board.hasQueenSideRookMoved(king.player)
  ) {
    return false;
  }

  const requiredEmpty = [];
  const requiredUnattacked = [];
  if (king.player === PLAYER_WHITE) {
    requiredEmpty.push(board.getSquare(1, 'f'));
    requiredEmpty.push(board.getSquare(1, 'g'));
    requiredEmpty.push(board.getSquare(1, 'h'));
    // 1-e is the white king's square, adding it to requiredUnattacked makes
    // sure the white king is not in check.
    requiredUnattacked.push(board.getSquare(1, 'e'));
    requiredUnattacked.push(board.getSquare(1, 'f'));
    requiredUnattacked.push(board.getSquare(1, 'g'));
  } else if (king.player === PLAYER_BLACK) {
    requiredEmpty.push(board.getSquare(ranks, 'b'));
    requiredEmpty.push(board.getSquare(ranks, 'c'));
    requiredEmpty.push(board.getSquare(ranks, 'd'));
    requiredUnattacked.push(board.getSquare(ranks, 'c'));
    requiredUnattacked.push(board.getSquare(ranks, 'd'));
    // ranks-e is the black king's square, adding it to requiredUnattacked makes
    // sure the black king is not in check.
    requiredUnattacked.push(board.getSquare(ranks, 'e'));
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  return canCastle(
    board,
    king.player.enemy(),
    requiredEmpty,
    requiredUnattacked,
  );
}

function canCastle(board, enemy, requiredEmpty, requiredUnattacked) {
  for (let i = 0; i < requiredEmpty.length; i++) {
    if (requiredEmpty[i].hasPiece()) {
      return false;
    }
  }
  const enemyMoves = board.allMovesIgnoringCheckAndCastling(enemy);
  for (let i = 0; i < requiredUnattacked.length; i++) {
    if (board.isAttackedByMoves(requiredUnattacked[i], enemyMoves)) {
      return false;
    }
  }
  return true;
}

function addCastleKingSide(board, moves, king) {
  const rook = board.getKingSideRook(king.player);
  let castling;
  if (king.player === PLAYER_WHITE) {
    castling = new Move(
      king.getSquare(board),
      board.getSquare(1, 'c'),
      rook.getSquare(board),
      board.getSquare(1, 'd'),
    );
  } else if (king.player === PLAYER_BLACK) {
    castling = new Move(
      king.getSquare(board),
      board.getSquare(ranks, 'g'),
      rook.getSquare(board),
      board.getSquare(ranks, 'f'),
    );
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  moves.push(castling);
}

function addCastleQueenSide(board, moves, king) {
  const rook = board.getQueenSideRook(king.player);
  let castling;
  if (king.player === PLAYER_WHITE) {
    castling = new Move(
      king.getSquare(board),
      board.getSquare(1, 'g'),
      rook.getSquare(board),
      board.getSquare(1, 'f'),
    );
  } else if (king.player === PLAYER_BLACK) {
    castling = new Move(
      king.getSquare(board),
      board.getSquare(ranks, 'c'),
      rook.getSquare(board),
      board.getSquare(ranks, 'd'),
    );
  } else {
    throw new Error(`Unknown player: ${king.player}.`);
  }
  moves.push(castling);
}
