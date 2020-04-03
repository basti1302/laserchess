export default class Direction {
  constructor(label) {
    this.label = label;
  }
}

export const NORTH = new Direction('north');
export const NORTH_EAST = new Direction('north-east');
export const EAST = new Direction('east');
export const SOUTH_EAST = new Direction('south-east');
export const SOUTH = new Direction('south');
export const SOUTH_WEST = new Direction('south-west');
export const WEST = new Direction('west');
export const NORTH_WEST = new Direction('north-west');
