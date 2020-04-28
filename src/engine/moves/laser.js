import Piece from '../Piece';
import {LASER} from '../PieceType';
import moveTo from './moveTo';

export default function movesLaser(board, moves, laser) {
  if (laser.constructor !== Piece) {
    throw new Error(
      `Illegal argument for piece: ${JSON.stringify(laser)}`,
    );
  }
  if (laser.type !== LASER) {
    throw new Error(`Not a laser: ${laser}`);
  }

  const from = laser.getSquare(board);
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
