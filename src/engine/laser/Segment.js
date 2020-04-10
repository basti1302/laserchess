import {NORTH, EAST, SOUTH, WEST} from '../Orientation';
import {START, STRAIGHT, ABSORB, DESTROY} from './SegmentType';

export default class Segment {
  constructor(square, orientation, type) {
    if (square.constructor.name !== 'Square') {
      throw new Error(
        `Illegal argument for square: ${square.constructor.name}: ${square}`,
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
    if (type.constructor.name !== 'SegmentType') {
      throw new Error(
        `Illegal argument for type: ${type.constructor.name}: ${type}`,
      );
    }
    if (
      type !== START &&
      type !== STRAIGHT &&
      type !== ABSORB &&
      type !== DESTROY
    ) {
      throw new Error(`Unknown type: ${type}`);
    }

    this.square = square;
    this.orientation = orientation;
    this.type = type;
  }
}
