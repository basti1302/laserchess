export function other(color) {
  if (is(color, WHITE)) {
    return BLACK;
  } else if (is(color, BLACK)) {
    return WHITE;
  } else {
    throw new Error(`Can't provide other color for ${color}.`);
  }
}

export function is(color, other) {
  return color.label === other.label;
}

export const WHITE = 'white';
export const BLACK = 'black';
