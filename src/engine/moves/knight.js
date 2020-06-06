import { getSquare as getSquareFromBoard } from '../Board';
import { is as isType, KNIGHT } from '../PieceType';
import { getSquare as getSquareFromPiece } from '../Piece';
import moveTo from './moveTo';

export default function movesKnight(board, moves, knight) {
  if (!knight) {
    throw new Error('Missing mandatory argument: knight.');
  }
  if (!isType(knight.type, KNIGHT)) {
    throw new Error(`Not a knight: ${knight}`);
  }

  const from = getSquareFromPiece(knight, board);
  const rank = from.rank;
  const file = from.file;

  moveTo(board, moves, from, getSquareFromBoard(board, rank + 2, file - 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank + 2, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file + 2));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file + 2));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 2, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 2, file - 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file - 2));
  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file - 2));
}
