export default class Color {
  constructor(label) {
    this.label = label;
  }

  other() {
    if (this.is(WHITE)) {
      return BLACK;
    } else if (this.is(BLACK)) {
      return WHITE;
    } else {
      throw new Error(`Can't provide other color for ${this}.`);
    }
  }

  is(other) {
    return this.label === other.label;
  }
}

export const WHITE = new Color('white');
export const BLACK = new Color('black');
