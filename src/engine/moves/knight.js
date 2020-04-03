import {KNIGHT} from '../PieceType';
import moveTo from './moveTo';

export default function movesKnight(board, moves, knight) {
  if (knight.constructor.name !== 'Piece') {
    throw new Error(
      `Illegal argument for piece: ${knight.constructor.name}: ${knight}`,
    );
  }
  if (knight.type !== KNIGHT) {
    throw new Error(`Not a knight: ${knight}`);
  }

  const from = knight.getSquare(board);
  const rank = from.rank;
  const file = from.file;

  moveTo(board, moves, from, board.getSquare(rank + 2, file - 1));
  moveTo(board, moves, from, board.getSquare(rank + 2, file + 1));
  moveTo(board, moves, from, board.getSquare(rank + 1, file + 2));
  moveTo(board, moves, from, board.getSquare(rank - 1, file + 2));
  moveTo(board, moves, from, board.getSquare(rank - 2, file + 1));
  moveTo(board, moves, from, board.getSquare(rank - 2, file - 1));
  moveTo(board, moves, from, board.getSquare(rank - 1, file - 2));
  moveTo(board, moves, from, board.getSquare(rank + 1, file - 2));
}
