import {PAWN} from '../PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../Player';
import {ranks} from '../Board';
import moveTo, {CAPTURE_MODE_MUST, CAPTURE_MODE_MUST_NOT} from './moveTo';
import Move from './Move';

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

  let direction;
  let homeRank;
  let enemyPawnHomeRank;
  let enemyEnPassantDestinationRank;
  let isPromotion;
  if (pawn.player === PLAYER_WHITE) {
    direction = 1;
    homeRank = 2;
    enemyPawnHomeRank = ranks - 1;
    enemyEnPassantDestinationRank = ranks - 3;
    isPromotion = rank === ranks - 1;
  } else if (pawn.player === PLAYER_BLACK) {
    direction = -1;
    homeRank = ranks - 1;
    enemyPawnHomeRank = 2;
    enemyEnPassantDestinationRank = 4;
    isPromotion = rank === 2;
  } else {
    throw new Error(`Unknown player: ${pawn.player}.`);
  }

  if (
    moveTo(
      board,
      moves,
      from,
      board.getSquare(rank + direction, file),
      CAPTURE_MODE_MUST_NOT,
      isPromotion,
    ) &&
    rank === homeRank
  ) {
    moveTo(
      board,
      moves,
      from,
      board.getSquare(rank + 2 * direction, file),
      CAPTURE_MODE_MUST_NOT,
    );
  }
  moveTo(
    board,
    moves,
    from,
    board.getSquare(rank + direction, file + 1),
    CAPTURE_MODE_MUST,
    isPromotion,
  );
  moveTo(
    board,
    moves,
    from,
    board.getSquare(rank + direction, file - 1),
    CAPTURE_MODE_MUST,
    isPromotion,
  );

  if (rank === enemyEnPassantDestinationRank) {
    const lastMove = board.getLastMove();
    if (lastMove) {
      if (
        lastMove.from.rank === enemyPawnHomeRank &&
        lastMove.to.rank === enemyEnPassantDestinationRank
      ) {
        if (lastMove.from.file === file + 1) {
          moves.push(
            new Move(
              from,
              board.getSquare(rank + direction, file + 1),
              null,
              null,
              null,
              board.getSquare(rank, file + 1),
            ),
          );
        } else if (lastMove.from.file === file - 1) {
          moves.push(
            new Move(
              from,
              board.getSquare(rank + direction, file - 1),
              null,
              null,
              null,
              board.getSquare(rank, file - 1),
            ),
          );
        }
      }
    }
  }
}
