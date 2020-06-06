import { is as isType, KING, ROOK } from '../PieceType';
import { transferToBoard as transferSquareToBoard } from '../Square';

export function create(from, to, from2, to2, promotionTo, enPassantCapture) {
  let castling = false;
  let promotion = false;

  if (!from) {
    throw new Error('Missing mandatory argument: from.');
  }
  if (!to) {
    throw new Error('Missing mandatory argument: to.');
  }

  if (from2 && to2) {
    if (!isType(from.piece.type, KING)) {
      throw new Error(
        `Only kings are allowed for argument from when from2 is also given, got: ${from.piece.type}`,
      );
    }
    if (!isType(from2.piece.type, ROOK)) {
      throw new Error(
        `Only rooks are allowed for argument from2, got: ${from.piece.type}`,
      );
    }
    castling = true;
  }

  if (promotionTo) {
    promotion = true;
  }

  return {
    from,
    to,
    castling,
    from2,
    to2,
    promotion,
    promotionTo,
    enPassantCapture,
  };
}

export function transferToBoard(move, board) {
  const moveForBoard = { ...move };
  moveForBoard.from = transferSquareToBoard(moveForBoard.from, board);
  moveForBoard.to = transferSquareToBoard(moveForBoard.to, board);
  if (moveForBoard.from2) {
    moveForBoard.from2 = transferSquareToBoard(moveForBoard.from2, board);
  }
  if (moveForBoard.to2) {
    moveForBoard.to2 = transferSquareToBoard(moveForBoard.to2, board);
  }
  if (moveForBoard.enPassantCapture) {
    moveForBoard.enPassantCapture = transferSquareToBoard(
      moveForBoard.enPassantCapture,
      board,
    );
  }
  return moveForBoard;
}
