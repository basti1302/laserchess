export default class Orientation {
  constructor(label, cssClass) {
    this.label = label;
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

export const NORTH = new Orientation('N', 'facing-north');
export const EAST = new Orientation('E', 'facing-east');
export const SOUTH = new Orientation('S', 'facing-south');
export const WEST = new Orientation('W', 'facing-west');
