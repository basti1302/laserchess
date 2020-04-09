import {NORTH, EAST, SOUTH, WEST} from '../Orientation';
import {START, STRAIGHT, DESTROY} from './SegmentType';
import {LASER} from '../PieceType';
import Segment from './Segment';
import Shot from './Shot';

export default function fireLaser(board, from, orientation) {
  if (from.constructor.name !== 'Square') {
    throw new Error(
      `Illegal argument for from: ${from.constructor.name}: ${from}`,
    );
  }
  if (orientation.constructor.name !== 'Orientation') {
    throw new Error(
      `Illegal argument for orientation: ${orientation.constructor.name}: ${orientation}`,
    );
  }
  if (
    orientation !== NORTH &&
    orientation !== EAST &&
    orientation !== SOUTH &&
    orientation !== WEST
  ) {
    throw new Error(`Unknown orientation: ${orientation}`);
  }

  const laser = from.getPiece();
  if (!laser || laser.type !== LASER) {
    return new Shot([]);
  }

  const segments = [new Segment(from, orientation, START)];
  let destroyedSquare;

  let stop = false;
  let nextSquare = from;
  do {
    nextSquare = oneStep(nextSquare, board, orientation);
    if (!nextSquare) {
      // end of board reached
      stop = true;
    } else {
      if (nextSquare.hasPiece()) {
        destroyedSquare = nextSquare;
        segments.push(new Segment(nextSquare, orientation, DESTROY));
        stop = true;
      } else {
        segments.push(new Segment(nextSquare, orientation, STRAIGHT));
      }
    }
  } while (!stop);
  return new Shot(segments, destroyedSquare);
}

function oneStep(square, board, orientation) {
  if (orientation === NORTH) {
    return board.getSquare(square.rank + 1, square.file);
  } else if (orientation === EAST) {
    return board.getSquare(square.rank, square.file + 1);
  } else if (orientation === SOUTH) {
    return board.getSquare(square.rank - 1, square.file);
  } else if (orientation === WEST) {
    return board.getSquare(square.rank, square.file - 1);
  }
}
