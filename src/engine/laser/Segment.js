import { is as isOrientation, NORTH, EAST, SOUTH, WEST } from '../Orientation';
import {
  START,
  STRAIGHT,
  REFLECTED_LEFT,
  REFLECTED_RIGHT,
  REFLECTED_STRAIGHT,
  ABSORB,
  DESTROY,
} from './segmentTypes';
import { transferToBoard as transferSquareToBoard } from '../Square';

export function create(square, orientation, type) {
  if (!square) {
    throw new Error('Missing mandatory argument: square.');
  }
  if (!orientation) {
    throw new Error('Missing mandatory argument: orientation.');
  }
  if (
    !isOrientation(orientation, NORTH) &&
    !isOrientation(orientation, EAST) &&
    !isOrientation(orientation, SOUTH) &&
    !isOrientation(orientation, WEST)
  ) {
    throw new Error(`Unknown orientation: ${orientation}`);
  }
  if (typeof type !== 'string') {
    throw new Error(`Illegal argument for type: ${JSON.stringify(type)}`);
  }
  if (
    type !== START &&
    type !== STRAIGHT &&
    type !== REFLECTED_LEFT &&
    type !== REFLECTED_RIGHT &&
    type !== REFLECTED_STRAIGHT &&
    type !== ABSORB &&
    type !== DESTROY
  ) {
    throw new Error(`Unknown type: ${JSON.stringify(type)}`);
  }

  return {
    square,
    orientation,
    type,
  };
}

export function transferToBoard(segment, board) {
  const segmentForBoard = { ...segment };
  segmentForBoard.square = transferSquareToBoard(segment.square, board);
  return segmentForBoard;
}
