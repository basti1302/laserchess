import { isPawn } from '../PieceType';
import { getSquare as getSquareFromPiece } from '../Piece';
import { is as playerIs, PLAYER_WHITE, PLAYER_BLACK } from '../Player';
import { getSquare as getSquareFromBoard, getLastMove, ranks } from '../Board';
import moveTo, { CAPTURE_MODE_MUST, CAPTURE_MODE_MUST_NOT } from './moveTo';
import { create as createMove } from './Move';

export default function movesPawn(board, moves, pawn) {
  if (!pawn) {
    throw new Error('Missing mandatory argument: pawn.');
  }
  if (!isPawn(pawn.type)) {
    throw new Error(`Not a pawn: ${pawn}`);
  }

  const from = getSquareFromPiece(pawn, board);
  const rank = from.rank;
  const file = from.file;

  let direction;
  let homeRank;
  let enemyPawnHomeRank;
  let enemyEnPassantDestinationRank;
  let isPromotion;
  if (playerIs(pawn.player, PLAYER_WHITE)) {
    direction = 1;
    homeRank = 2;
    enemyPawnHomeRank = ranks - 1;
    enemyEnPassantDestinationRank = ranks - 3;
    isPromotion = rank === ranks - 1;
  } else if (playerIs(pawn.player, PLAYER_BLACK)) {
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
      getSquareFromBoard(board, rank + direction, file),
      CAPTURE_MODE_MUST_NOT,
      isPromotion,
    ) &&
    rank === homeRank
  ) {
    moveTo(
      board,
      moves,
      from,
      getSquareFromBoard(board, rank + 2 * direction, file),
      CAPTURE_MODE_MUST_NOT,
    );
  }
  moveTo(
    board,
    moves,
    from,
    getSquareFromBoard(board, rank + direction, file + 1),
    CAPTURE_MODE_MUST,
    isPromotion,
  );
  moveTo(
    board,
    moves,
    from,
    getSquareFromBoard(board, rank + direction, file - 1),
    CAPTURE_MODE_MUST,
    isPromotion,
  );

  if (rank === enemyEnPassantDestinationRank) {
    const lastMove = getLastMove(board);
    if (lastMove) {
      if (
        isPawn(lastMove.type) &&
        lastMove.from.rank === enemyPawnHomeRank &&
        lastMove.to.rank === enemyEnPassantDestinationRank
      ) {
        if (lastMove.from.file === file + 1) {
          moves.push(
            createMove(
              from,
              getSquareFromBoard(board, rank + direction, file + 1),
              null,
              null,
              null,
              getSquareFromBoard(board, rank, file + 1),
            ),
          );
        } else if (lastMove.from.file === file - 1) {
          moves.push(
            createMove(
              from,
              getSquareFromBoard(board, rank + direction, file - 1),
              null,
              null,
              null,
              getSquareFromBoard(board, rank, file - 1),
            ),
          );
        }
      }
    }
  }
}
