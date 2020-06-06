import { is as isType, QUEEN } from '../PieceType';
import { getSquare as getSquareFromPiece } from '../Piece';
import {
  NORTH,
  NORTH_EAST,
  EAST,
  SOUTH_EAST,
  SOUTH,
  SOUTH_WEST,
  WEST,
  NORTH_WEST,
} from './directions';
import movesStraightLine from './movesStraightLine';

export default function movesQueen(board, moves, queen) {
  if (!queen) {
    throw new Error('Missing mandatory argument: queen.');
  }
  if (!isType(queen.type, QUEEN)) {
    throw new Error(`Not a queen: ${queen}`);
  }

  const from = getSquareFromPiece(queen, board);
  movesStraightLine(board, moves, from, NORTH);
  movesStraightLine(board, moves, from, NORTH_EAST);
  movesStraightLine(board, moves, from, EAST);
  movesStraightLine(board, moves, from, SOUTH_EAST);
  movesStraightLine(board, moves, from, SOUTH);
  movesStraightLine(board, moves, from, SOUTH_WEST);
  movesStraightLine(board, moves, from, WEST);
  movesStraightLine(board, moves, from, NORTH_WEST);
}
