import { getSquare as getSquareFromBoard } from './Board';
import { clearPosition, clone as clonePiece, setPosition } from './Piece';
import { create as createSquare } from './Square';

export function create(rank, file) {
  return {
    id: `${rank}-${file}`,
    rank,
    file,
    piece: null,
  };
}

export function asPosition(square) {
  return {
    rank: square.rank,
    file: square.file,
  };
}

export function setPiece(square, piece) {
  square.piece = piece;
  setPosition(piece, square.rank, square.file);
}

export function removePiece(square) {
  if (square.piece) {
    const piece = square.piece;
    clearPosition(square.piece);
    square.piece = null;
    return piece;
  }
  return null;
}

export function getFileAsLetter(square) {
  return String.fromCharCode(square.file + 96); // 97 = 'a'
}

export function clone(square) {
  if (!square) {
    return null;
  }
  const clonedSquare = createSquare(square.rank, square.file);
  if (square.piece) {
    clonedSquare.piece = clonePiece(square.piece);
  }
  return clonedSquare;
}

export function is(square, other) {
  return square.id === other.id;
}

export function transferToBoard(square, board) {
  const squareForBoard = getSquareFromBoard(board, square.rank, square.file);
  return squareForBoard;
}
