import {immerable} from 'immer';

import Orientation, {NORTH, EAST, SOUTH, WEST} from '../Orientation';
import {
  START,
  STRAIGHT,
  REFLECTED_LEFT,
  REFLECTED_RIGHT,
  REFLECTED_STRAIGHT,
  ABSORB,
  DESTROY,
} from './segmentTypes';
import Square from '../Square';

export default class Segment {
  [immerable] = true;

  constructor(square, orientation, type) {
    if (square.constructor !== Square) {
      throw new Error(`Illegal argument for square: ${JSON.stringify(square)}`);
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

    this.square = square;
    this.orientation = orientation;
    this.type = type;
  }
}
