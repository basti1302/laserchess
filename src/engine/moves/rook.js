import {ROOK} from '../PieceType';
import {NORTH, EAST, SOUTH, WEST} from './Direction';
import movesStraightLine from './movesStraightLine';

export default function movesRook(board, moves, rook) {
  if (rook.constructor.name !== 'Piece') {
    throw new Error(
      `Illegal argument for piece: ${rook.constructor.name}: ${rook}`,
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
