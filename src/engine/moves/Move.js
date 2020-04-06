import {KING, ROOK} from '../PieceType';

export default class Move {
  constructor(from, to, from2, to2, promotionTo, enPassantCapture) {
    this.castling = false;
    this.from2 = null;
    this.to2 = null;
    this.promotion = false;
    this.promotionTo = null;
    this.enPassantCapture = null;

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
      this.castling = true;
      this.from2 = from2;
      this.to2 = to2;
    }

    if (promotionTo) {
      if (promotionTo.constructor.name !== 'PieceType') {
        throw new Error(
          `Illegal argument for promotionTo: ${promotionTo.constructor.name}: ${promotionTo}`,
        );
      }
      this.promotion = true;
      this.promotionTo = promotionTo;
    }

    if (enPassantCapture) {
      if (enPassantCapture.constructor.name !== 'Square') {
        throw new Error(
          `Illegal argument for enPassantCapture: ${enPassantCapture.constructor.name}: ${enPassantCapture}`,
        );
      }
      this.enPassantCapture = enPassantCapture;
    }
  }
}
