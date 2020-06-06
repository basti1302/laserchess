import {
  getSquare as getSquareFromBoard,
  pruneMovesThatLeadToCheckFor,
} from './Board';
import { is as playerIs, PLAYER_WHITE, PLAYER_BLACK } from './Player';
import {
  is as isType,
  possibleMoves as possibleMovesForType,
  LASER,
} from './PieceType';
import {
  rotateLeft as rotateOrientationLeft,
  rotateRight as rotateOrientationRight,
  NORTH,
  SOUTH,
} from './Orientation';
import fireLaser from './laser/fireLaser';

let idx = 0;

export function create(player, type, orientation) {
  if (!player) {
    throw new Error('Missing mandatory argument: player.');
  }
  if (!playerIs(player, PLAYER_WHITE) && !playerIs(player, PLAYER_BLACK)) {
    throw new Error(`Illegal argument for player: ${JSON.stringify(player)}`);
  }
  if (!type) {
    throw new Error('Missing mandatory argument: type');
  }
  if (!orientation) {
    if (playerIs(player, PLAYER_WHITE)) {
      orientation = NORTH;
    } else if (playerIs(player, PLAYER_BLACK)) {
      orientation = SOUTH;
    }
  }

  return {
    id: `${player.boardIoLabel}:${type.id}:${idx++}`,
    player,
    type,
    orientation,
    rank: null,
    file: null,
    hasMoved: false,
  };
}

export function setPosition(piece, rank, file) {
  piece.rank = rank;
  piece.file = file;
}

export function clearPosition(piece) {
  piece.rank = null;
  piece.file = null;
}

export function getPosition(piece) {
  if (piece.rank && piece.file) {
    return {
      rank: piece.rank,
      file: piece.file,
    };
  } else {
    return null;
  }
}

export function getSquare(piece, board) {
  return getSquareFromBoard(board, piece.rank, piece.file);
}

export function possibleMovesIgnoringCheck(
  piece,
  board,
  moves,
  ignoreCastling = false,
) {
  possibleMovesForType(piece.type, board, moves, piece, ignoreCastling);
}

export function possibleMoves(piece, board, moves) {
  possibleMovesIgnoringCheck(piece, board, moves);
  pruneMovesThatLeadToCheckFor(board, moves, piece.player);
}

export function rotateLeft(piece) {
  piece.orientation = rotateOrientationLeft(piece.orientation);
}

export function rotateRight(piece) {
  piece.orientation = rotateOrientationRight(piece.orientation);
}

export function fire(piece, board) {
  if (!isType(piece.type, LASER)) {
    throw new Error(`Only lasers can fire, this is a ${piece.type}.`);
  }
  return fireLaser(board, getSquare(piece, board), piece.orientation);
}

export function clone(piece) {
  const clonedPiece = create(piece.player, piece.type, piece.orientation);
  clonedPiece.rank = piece.rank;
  clonedPiece.file = piece.file;
  clonedPiece.hasMoved = piece.hasMoved;
  return clonedPiece;
}

export function is(piece, other) {
  return piece.id === other.id;
}
