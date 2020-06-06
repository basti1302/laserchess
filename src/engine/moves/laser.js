import { getSquare as getSquareFromBoard } from '../Board';
import { is as isType, LASER } from '../PieceType';
import { getSquare as getSquareFromPiece } from '../Piece';
import moveTo from './moveTo';

export default function movesLaser(board, moves, laser) {
  if (!laser) {
    throw new Error('Missing mandatory argument: laser.');
  }
  if (!isType(laser.type, LASER)) {
    throw new Error(`Not a laser: ${laser}`);
  }

  const from = getSquareFromPiece(laser, board);
  const rank = from.rank;
  const file = from.file;

  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file));
  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file + 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file));
  moveTo(board, moves, from, getSquareFromBoard(board, rank - 1, file - 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank, file - 1));
  moveTo(board, moves, from, getSquareFromBoard(board, rank + 1, file - 1));
}
