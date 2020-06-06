import { is as isType, BISHOP } from '../PieceType';
import { getSquare as getSquareFromPiece } from '../Piece';
import { NORTH_EAST, SOUTH_EAST, SOUTH_WEST, NORTH_WEST } from './directions';
import movesStraightLine from './movesStraightLine';

export default function movesBishop(board, moves, bishop) {
  if (!bishop) {
    throw new Error('Missing mandatory argument: bishop.');
  }
  if (!isType(bishop.type, BISHOP)) {
    throw new Error(`Not a bishop: ${bishop}`);
  }

  const from = getSquareFromPiece(bishop, board);
  movesStraightLine(board, moves, from, NORTH_EAST);
  movesStraightLine(board, moves, from, SOUTH_EAST);
  movesStraightLine(board, moves, from, SOUTH_WEST);
  movesStraightLine(board, moves, from, NORTH_WEST);
}
