import Orientation, {NORTH, EAST, SOUTH, WEST} from '../Orientation';
import SegmentType, {
  START,
  STRAIGHT,
  REFLECTED_LEFT,
  REFLECTED_RIGHT,
  REFLECTED_STRAIGHT,
  ABSORB,
  DESTROY,
} from './SegmentType';
import Square from '../Square';

export default class Segment {
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
    if (type.constructor !== SegmentType) {
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
