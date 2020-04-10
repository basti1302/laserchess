export default class Orientation {
  constructor(label, orientationIndex, cssClass) {
    this.label = label;
    this.orientationIndex = orientationIndex;
    this.cssClass = cssClass;
  }

  rotateRight() {
    if (this === NORTH) {
      return EAST;
    } else if (this === EAST) {
      return SOUTH;
    } else if (this === SOUTH) {
      return WEST;
    } else if (this === WEST) {
      return NORTH;
    } else {
      throw new Error(`Can't rotate right: ${this}.`);
    }
  }

  rotateLeft() {
    if (this === NORTH) {
      return WEST;
    } else if (this === WEST) {
      return SOUTH;
    } else if (this === SOUTH) {
      return EAST;
    } else if (this === EAST) {
      return NORTH;
    } else {
      throw new Error(`Can't rotate left: ${this}.`);
    }
  }
}

export const NORTH = new Orientation('N', 0, 'facing-north');
export const EAST = new Orientation('E', 1, 'facing-east');
export const SOUTH = new Orientation('S', 2, 'facing-south');
export const WEST = new Orientation('W', 3, 'facing-west');
