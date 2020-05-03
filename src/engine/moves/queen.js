import Piece from '../Piece';
import {QUEEN} from '../PieceType';
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
  if (queen.constructor !== Piece) {
    throw new Error(`Illegal argument for piece: ${JSON.stringify(queen)}`);
  }
  if (!queen.type.is(QUEEN)) {
    throw new Error(`Not a queen: ${queen}`);
  }

  const from = queen.getSquare(board);
  movesStraightLine(board, moves, from, NORTH);
  movesStraightLine(board, moves, from, NORTH_EAST);
  movesStraightLine(board, moves, from, EAST);
  movesStraightLine(board, moves, from, SOUTH_EAST);
  movesStraightLine(board, moves, from, SOUTH);
  movesStraightLine(board, moves, from, SOUTH_WEST);
  movesStraightLine(board, moves, from, WEST);
  movesStraightLine(board, moves, from, NORTH_WEST);
}
