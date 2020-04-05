import {KING, ROOK} from '../PieceType';

export default class Move {
  constructor(from, to, from2, to2) {
    this.castling = false;
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

    if (from2 && to2) {
      this.castling = true;
      if (from2.constructor.name !== 'Square') {
        throw new Error(
          `Illegal argument for from2: ${from2.constructor.name}: ${from2}`,
        );
      }
      if (to2.constructor.name !== 'Square') {
        throw new Error(
          `Illegal argument for to2: ${to2.constructor.name}: ${to2}`,
        );
      }
      if (from.getPiece().type !== KING) {
        throw new Error(
          `Only kings are allowed for argument from when from2 is also given, got: ${
            from.getPiece().type
          }`,
        );
      }
      if (from2.getPiece().type !== ROOK) {
        throw new Error(
          `Only rooks are allowed for argument from2, got: ${
            from.getPiece().type
          }`,
        );
      }

      this.from2 = from2;
      this.to2 = to2;
    }
  }
}
