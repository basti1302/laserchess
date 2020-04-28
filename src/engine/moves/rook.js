import Piece from '../Piece';
import {ROOK} from '../PieceType';
import {NORTH, EAST, SOUTH, WEST} from './Direction';
import movesStraightLine from './movesStraightLine';

export default function movesRook(board, moves, rook) {
  if (rook.constructor !== Piece) {
    throw new Error(
      `Illegal argument for piece: ${JSON.stringify(rook)}`,
    );
  }
  if (rook.type !== ROOK) {
    throw new Error(`Not a rook: ${rook}`);
  }

  const from = rook.getSquare(board);
  movesStraightLine(board, moves, from, NORTH);
  movesStraightLine(board, moves, from, EAST);
  movesStraightLine(board, moves, from, SOUTH);
  movesStraightLine(board, moves, from, WEST);
}
