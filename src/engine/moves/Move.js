import Square from '../Square';
import PieceType, {KING, ROOK} from '../PieceType';

export default class Move {
  constructor(from, to, from2, to2, promotionTo, enPassantCapture) {
    this.castling = false;
    this.from2 = null;
    this.to2 = null;
    this.promotion = false;
    this.promotionTo = null;
    this.enPassantCapture = null;

    if (from.constructor !== Square) {
      throw new Error(`Illegal argument for from: ${JSON.stringify(from)}`);
    }
    if (to.constructor !== Square) {
      throw new Error(`Illegal argument for to: ${JSON.stringify(to)}`);
    }
    this.from = from;
    this.to = to;

    if (from2 && to2) {
      if (from2.constructor !== Square) {
        throw new Error(`Illegal argument for from2: ${JSON.stringify(from2)}`);
      }
      if (to2.constructor !== Square) {
        throw new Error(`Illegal argument for to2: ${JSON.stringify(to2)}`);
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
      if (promotionTo.constructor !== PieceType) {
        throw new Error(
          `Illegal argument for promotionTo: ${JSON.stringify(promotionTo)}`,
        );
      }
      this.promotion = true;
      this.promotionTo = promotionTo;
    }

    if (enPassantCapture) {
      if (enPassantCapture.constructor !== Square) {
        throw new Error(
          `Illegal argument for enPassantCapture: ${JSON.stringify(
            enPassantCapture,
          )}`,
        );
      }
      this.enPassantCapture = enPassantCapture;
    }
  }

  transferToClonedBoard(clonedBoard) {
    const moveForClonedBoard = Object.assign(
      Object.create(Move.prototype),
      this,
    );
    moveForClonedBoard.from = clonedBoard.getSquare(
      moveForClonedBoard.from.rank,
      moveForClonedBoard.from.file,
    );
    moveForClonedBoard.to = clonedBoard.getSquare(this.to.rank, this.to.file);
    if (moveForClonedBoard.from2) {
      moveForClonedBoard.from2 = clonedBoard.getSquare(
        moveForClonedBoard.from2.rank,
        moveForClonedBoard.from2.file,
      );
    }
    if (moveForClonedBoard.to2) {
      moveForClonedBoard.to2 = clonedBoard.getSquare(
        moveForClonedBoard.from2.rank,
        moveForClonedBoard.from2.file,
      );
    }
    if (moveForClonedBoard.promotionTo) {
      moveForClonedBoard.promotionTo = clonedBoard.getSquare(
        moveForClonedBoard.promotionTo.rank,
        moveForClonedBoard.promotionTo.file,
      );
    }
    if (moveForClonedBoard.enPassantCapture) {
      moveForClonedBoard.enPassantCapture = clonedBoard.getSquare(
        moveForClonedBoard.enPassantCapture.rank,
        moveForClonedBoard.enPassantCapture.file,
      );
    }
    return moveForClonedBoard;
  }
}
