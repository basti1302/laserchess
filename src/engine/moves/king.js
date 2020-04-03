import {KING} from '../PieceType';
import moveTo from './moveTo';

export default function movesKing(board, moves, king) {
  if (king.constructor.name !== 'Piece') {
    throw new Error(
      `Illegal argument for piece: ${king.constructor.name}: ${king}`,
    );
  }
  if (king.type !== KING) {
    throw new Error(`Not a king: ${king}`);
  }

  const from = king.getSquare(board);
  const rank = from.rank;
  const file = from.file;

  moveTo(board, moves, from, board.getSquare(rank + 1, file));
  moveTo(board, moves, from, board.getSquare(rank + 1, file + 1));
  moveTo(board, moves, from, board.getSquare(rank, file + 1));
  moveTo(board, moves, from, board.getSquare(rank - 1, file + 1));
  moveTo(board, moves, from, board.getSquare(rank - 1, file));
  moveTo(board, moves, from, board.getSquare(rank - 1, file - 1));
  moveTo(board, moves, from, board.getSquare(rank, file - 1));
  moveTo(board, moves, from, board.getSquare(rank + 1, file - 1));
}
