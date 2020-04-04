import {BISHOP} from '../PieceType';
import {NORTH_EAST, SOUTH_EAST, SOUTH_WEST, NORTH_WEST} from './Direction';
import movesStraightLine from './movesStraightLine';

export default function movesBishop(board, moves, bishop) {
  if (bishop.constructor.name !== 'Piece') {
    throw new Error(
      `Illegal argument for piece: ${bishop.constructor.name}: ${bishop}`,
    );
  }
  if (bishop.type !== BISHOP) {
    throw new Error(`Not a bishop: ${bishop}`);
  }

  const from = bishop.getSquare(board);
  movesStraightLine(board, moves, from, NORTH_EAST);
  movesStraightLine(board, moves, from, SOUTH_EAST);
  movesStraightLine(board, moves, from, SOUTH_WEST);
  movesStraightLine(board, moves, from, NORTH_WEST);
}