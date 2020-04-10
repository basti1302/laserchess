import {NORTH, EAST, SOUTH, WEST} from '../Orientation';
import {START, STRAIGHT, ABSORB, DESTROY} from './SegmentType';
import {DEFAULT, SHIELD} from './Surface';
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
        const surface = getSurfaceFromPiece(nextSquare.getPiece(), orientation);
        if (surface === DEFAULT) {
          destroyedSquare = nextSquare;
          segments.push(new Segment(nextSquare, orientation, DESTROY));
          stop = true;
        } else if (surface === SHIELD) {
          segments.push(new Segment(nextSquare, orientation, ABSORB));
          stop = true;
        } else {
          throw new Error(`Surface type is not implemented yet: ${surface}`);
        }
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

function getSurfaceFromPiece(piece, shotOrientation) {
  // We generally assign numbers 0 to 3 to the four cardinal directions:
  // - 0: north
  // - 1: east
  // - 2: south
  // - 3: west
  // (see Orientation.js#orientationIndex)
  //
  // Accordingly, we store the piece's surfaces in an array of length 4. Index 0
  // is its northern surface, 1 is the eastern surface, 2 is the southern
  // surface and 3 is the western surface.
  //
  // Here is an example to explain the calculation of the surfaceIndex given
  // the piece's orientation and the shot orientation. Let's assume the piece is
  // facing WEST (orientation value 3, see above). Let's also assume the shot
  // has orientation SOUTH (value 2, see above), that is, it is going from north
  // to south. We first add 2 to the shot's orientation to turn it around. A
  // shot that is oriented SOUTH is actually coming from NORTH (more generally,
  // it is coming from the opposite of its its orientation). That gives us
  // (shot orientation + 2) % 4 = (2 + 2) % 4 = 4 % 4 = 0,
  // which would be the piece's northern surface.
  //
  // Then we add the piece's orientation to the index. This gives
  // (shot orientation + 2 - piece orientation) % 4 = (2 + 2 - 3) % 4
  //    = 1 % 4 = 1,
  // which is the piece's eastern surface. This is the correct surface for
  // a shot going north to south, hitting a piece facing westwards.

  // prettier-ignore
  const surfaceIndex = Math.abs(
    (shotOrientation.orientationIndex + 2
       - piece.orientation.orientationIndex
    )
    % 4
  );
  return piece.type.surfaces[surfaceIndex];
}
