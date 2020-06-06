import { is as isType, ROOK } from '../PieceType';
import { getSquare as getSquareFromPiece } from '../Piece';
import { NORTH, EAST, SOUTH, WEST } from './directions';
import movesStraightLine from './movesStraightLine';

export default function movesRook(board, moves, rook) {
  if (!rook) {
    throw new Error('Missing mandatory argument: rook.');
  }
  if (!isType(rook.type, ROOK)) {
    throw new Error(`Not a rook: ${rook}`);
  }

  const from = getSquareFromPiece(rook, board);
  movesStraightLine(board, moves, from, NORTH);
  movesStraightLine(board, moves, from, EAST);
  movesStraightLine(board, moves, from, SOUTH);
  movesStraightLine(board, moves, from, WEST);
}
