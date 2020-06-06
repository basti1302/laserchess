import { getSquare as getSquareFromBoard } from '../Board';
import { is as isPlayer } from '../Player';
import moveTo from './moveTo';
import {
  NORTH,
  NORTH_EAST,
  EAST,
  SOUTH_EAST,
  SOUTH,
  SOUTH_WEST,
  WEST,
  NORTH_WEST,
} from './directions';

export default function movesStraightLine(board, moves, from, direction) {
  if (!from) {
    throw new Error('Missing mandatory argument: from.');
  }
  if (typeof direction !== 'string') {
    throw new Error(
      `Illegal argument for direction: ${JSON.stringify(direction)}`,
    );
  }

  const movingPiece = from.piece;
  if (!movingPiece) {
    return;
  }
  let stop = false;
  let nextSquare = from;
  do {
    nextSquare = oneStep(nextSquare, board, direction);
    if (!nextSquare) {
      // end of board reached
      stop = true;
    } else {
      if (
        !nextSquare.piece ||
        !isPlayer(from.piece.player, nextSquare.piece.player)
      ) {
        moveTo(board, moves, from, nextSquare);
      }
      if (nextSquare.piece) {
        stop = true;
      }
    }
  } while (!stop);
}

function oneStep(square, board, direction) {
  if (direction === NORTH) {
    return getSquareFromBoard(board, square.rank + 1, square.file);
  } else if (direction === NORTH_EAST) {
    return getSquareFromBoard(board, square.rank + 1, square.file + 1);
  } else if (direction === EAST) {
    return getSquareFromBoard(board, square.rank, square.file + 1);
  } else if (direction === SOUTH_EAST) {
    return getSquareFromBoard(board, square.rank - 1, square.file + 1);
  } else if (direction === SOUTH) {
    return getSquareFromBoard(board, square.rank - 1, square.file);
  } else if (direction === SOUTH_WEST) {
    return getSquareFromBoard(board, square.rank - 1, square.file - 1);
  } else if (direction === WEST) {
    return getSquareFromBoard(board, square.rank, square.file - 1);
  } else if (direction === NORTH_WEST) {
    return getSquareFromBoard(board, square.rank + 1, square.file - 1);
  }
}
