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
} from './Direction';

export default function movesStraightLine(board, moves, from, direction) {
  if (direction.constructor.name !== 'Direction') {
    throw new Error(
      `Illegal argument for direction: ${direction.constructor.name}: ${direction}`,
    );
  }

  const movingPiece = from.getPiece();
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
        !nextSquare.hasPiece() ||
        from.getPiece().player !== nextSquare.getPiece().player
      ) {
        moveTo(board, moves, from, nextSquare);
      }
      if (nextSquare.hasPiece()) {
        stop = true;
      }
    }
  } while (!stop);
}

function oneStep(square, board, direction) {
  if (direction === NORTH) {
    return board.getSquare(square.rank + 1, square.file);
  } else if (direction === NORTH_EAST) {
    return board.getSquare(square.rank + 1, square.file + 1);
  } else if (direction === EAST) {
    return board.getSquare(square.rank, square.file + 1);
  } else if (direction === SOUTH_EAST) {
    return board.getSquare(square.rank - 1, square.file + 1);
  } else if (direction === SOUTH) {
    return board.getSquare(square.rank - 1, square.file);
  } else if (direction === SOUTH_WEST) {
    return board.getSquare(square.rank - 1, square.file - 1);
  } else if (direction === WEST) {
    return board.getSquare(square.rank, square.file - 1);
  } else if (direction === NORTH_WEST) {
    return board.getSquare(square.rank + 1, square.file - 1);
  }
}
