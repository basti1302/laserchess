export default class Move {
  constructor(from, to) {
    if (from.constructor.name !== 'Square') {
      throw new Error(
        `Illegal argument for from: ${from.constructor.name}: ${from}`,
      );
    }
    if (to.constructor.name !== 'Square') {
      throw new Error(`Illegal argument for to: ${to.constructor.name}: ${to}`);
    }
    this.from = from;
    this.to = to;
  }
}
