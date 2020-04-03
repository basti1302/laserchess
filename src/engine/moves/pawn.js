import {PAWN} from '../PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../Player';
import moveTo from './moveTo';

export default function movesPawn(board, moves, pawn) {
  if (pawn.constructor.name !== 'Piece') {
    throw new Error(
      `Illegal argument for piece: ${pawn.constructor.name}: ${pawn}`,
    );
  }
  if (pawn.type !== PAWN) {
    throw new Error(`Not a pawn: ${pawn}`);
  }

  const from = pawn.getSquare(board);
  const rank = from.rank;
  const file = from.file;

  if (pawn.player === PLAYER_WHITE) {
    if (moveTo(board, moves, from, board.getSquare(rank + 1, file), true)) {
      moveTo(board, moves, from, board.getSquare(rank + 2, file), true);
    }
  } else if (pawn.player === PLAYER_BLACK) {
    if (moveTo(board, moves, from, board.getSquare(rank - 1, file), true)) {
      moveTo(board, moves, from, board.getSquare(rank - 2, file), true);
    }
  } else {
    throw new Error(`Unknown player: ${pawn.player}.`);
  }
}
