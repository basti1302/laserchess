export default class Color {
  constructor(label) {
    this.label = label;
  }

  other() {
    if (this === WHITE) {
      return BLACK;
    } else if (this === BLACK) {
      return WHITE;
    } else {
      throw new Error(`Can't provide other color for ${this}.`);
    }
  }
}

export const WHITE = new Color("white");
export const BLACK = new Color("black");
