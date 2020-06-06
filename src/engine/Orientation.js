import modulo from './modulo';

function create(label, orientationIndex, cssClass) {
  return {
    label,
    orientationIndex,
    cssClass,
  };
}

export function rotateLeft(orientation) {
  return BY_INDEX[modulo(orientation.orientationIndex - 1, 4)];
}

export function rotateRight(orientation) {
  return BY_INDEX[modulo(orientation.orientationIndex + 1, 4)];
}

export function is(orientation, other) {
  return orientation.label === other.label;
}

export const NORTH = create('N', 0, 'facing-north');
export const EAST = create('E', 1, 'facing-east');
export const SOUTH = create('S', 2, 'facing-south');
export const WEST = create('W', 3, 'facing-west');

const BY_INDEX = [NORTH, EAST, SOUTH, WEST];
