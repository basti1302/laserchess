import {immerable} from 'immer';

import modulo from './modulo';

export default class Orientation {
  [immerable] = true;

  constructor(label, orientationIndex, cssClass) {
    this.label = label;
    this.orientationIndex = orientationIndex;
    this.cssClass = cssClass;
  }

  rotateLeft() {
    return BY_INDEX[modulo(this.orientationIndex - 1, 4)];
  }

  rotateRight() {
    return BY_INDEX[modulo(this.orientationIndex + 1, 4)];
  }

  is(other) {
    return this.label === other.label;
  }
}

export const NORTH = new Orientation('N', 0, 'facing-north');
export const EAST = new Orientation('E', 1, 'facing-east');
export const SOUTH = new Orientation('S', 2, 'facing-south');
export const WEST = new Orientation('W', 3, 'facing-west');

const BY_INDEX = [NORTH, EAST, SOUTH, WEST];
