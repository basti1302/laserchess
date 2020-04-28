import modulo from '../modulo';

import Orientation, {NORTH, EAST, SOUTH, WEST} from '../Orientation';
import {
  ABSORB,
  DESTROY,
  REFLECTED_LEFT,
  REFLECTED_RIGHT,
  REFLECTED_STRAIGHT,
  START,
  STRAIGHT,
} from './SegmentType';
import {
  DEFAULT,
  REFLECT_LEFT,
  REFLECT_RIGHT,
  REFLECT_STRAIGHT,
  RELAY,
  SHIELD,
  SPLIT,
} from './Surface';
import {LASER} from '../PieceType';
import Square from '../Square';
import Segment from './Segment';
import Shot from './Shot';

/**
 * Starts the laser shot from the firing laser piece.
 */
export default function fireLaser(board, from, orientation) {
  if (from.constructor !== Square) {
    throw new Error(`Illegal argument for from: ${JSON.stringify(from)}`);
  }
  if (orientation.constructor !== Orientation) {
    throw new Error(
      `Illegal argument for orientation: ${JSON.stringify(orientation)}`,
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

  const segments = [];
  const destroyedSquares = [];
  startShotLeg(board, from, orientation, segments, destroyedSquares);
  return new Shot(segments, destroyedSquares);
}

/**
 * Starts one leg of a shot, either from the firing laser piece or one of the
 * two individual legs after a split at a knight piece.
 */
function startShotLeg(board, from, orientation, segments, destroyedSquares) {
  segments.push(new Segment(from, orientation, START));
  let nextSquare = from;
  do {
    nextSquare = oneStep(nextSquare, board, orientation);
    if (!nextSquare) {
      // end of board reached
      return;
    } else {
      if (nextSquare.hasPiece()) {
        const surface = getSurfaceFromPiece(nextSquare.getPiece(), orientation);
        if (surface === DEFAULT) {
          addToDestroyedSquares(destroyedSquares, nextSquare);
          segments.push(new Segment(nextSquare, orientation, DESTROY));
          return;
        } else if (surface === REFLECT_LEFT) {
          segments.push(new Segment(nextSquare, orientation, REFLECTED_LEFT));
          orientation = orientation.rotateLeft();
        } else if (surface === REFLECT_RIGHT) {
          segments.push(new Segment(nextSquare, orientation, REFLECTED_RIGHT));
          orientation = orientation.rotateRight();
        } else if (surface === REFLECT_STRAIGHT) {
          // Check for infinetly reflected shots: Check whether the current
          // square is already contained with type reflected-straight, if so,
          // absorb.
          const current = nextSquare;
          if (
            segments.find(
              (s) => s.square === current && s.type === REFLECTED_STRAIGHT,
            )
          ) {
            segments.push(new Segment(nextSquare, orientation, ABSORB));
            return;
          } else {
            segments.push(
              new Segment(nextSquare, orientation, REFLECTED_STRAIGHT),
            );
            orientation = orientation.rotateRight().rotateRight();
          }
        } else if (surface === RELAY) {
          segments.push(new Segment(nextSquare, orientation, ABSORB));
          segments.push(new Segment(nextSquare, orientation, START));
        } else if (surface === SHIELD) {
          segments.push(new Segment(nextSquare, orientation, ABSORB));
          return;
        } else if (surface === SPLIT) {
          const splitOrientation1 = orientation.rotateRight();
          const splitOrientation2 = orientation.rotateLeft();
          segments.push(new Segment(nextSquare, orientation, ABSORB));
          startShotLeg(
            board,
            nextSquare,
            splitOrientation1,
            segments,
            destroyedSquares,
          );
          startShotLeg(
            board,
            nextSquare,
            splitOrientation2,
            segments,
            destroyedSquares,
          );
          return;
        } else {
          throw new Error(`Surface type is not implemented yet: ${surface}`);
        }
      } else {
        segments.push(new Segment(nextSquare, orientation, STRAIGHT));
      }
    }
  } while (true);
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
  // (shot orientation + 2) mod 4 = (2 + 2) mod 4 = 4 mod 4 = 0,
  // which would be the piece's northern surface.
  //
  // Then we add the piece's orientation to the index. This gives
  // (shot orientation + 2 - piece orientation) mod 4 = (2 + 2 - 3) mod 4
  //    = 1 mod 4 = 1,
  // which is the piece's eastern surface. This is the correct surface for
  // a shot going north to south, hitting a piece facing westwards.

  // prettier-ignore
  const surfaceIndex =
    modulo((shotOrientation.orientationIndex + 2 - piece.orientation.orientationIndex),  4);
  return piece.type.surfaces[surfaceIndex];
}

function addToDestroyedSquares(destroyedSquares, square) {
  // Due to shots being split by knights a piece may be hit by multiple legs of
  // a shot. We only add it to destroyedSquares once, that is, before we add it,
  // we check if it is already listed as a destroyed square.
  const alreadyListedAsDestroyed = !!destroyedSquares.find((s) => s === square);
  if (!alreadyListedAsDestroyed) {
    destroyedSquares.push(square);
  }
}
