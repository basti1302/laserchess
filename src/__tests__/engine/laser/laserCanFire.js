import {
  create as createBoard,
  ranks,
  files,
  setPiece as setPieceOnBoard,
  laserCanFire,
} from '../../../engine/Board';
import { create as createPiece } from '../../../engine/Piece';
import {
  KING,
  LASER,
  PAWN_SHIELD,
  QUEEN,
  ROOK,
} from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { NORTH, EAST, WEST } from '../../../engine/Orientation';

describe('laser can fire', () => {
  let board;

  beforeEach(() => {
    board = createBoard();
  });

  test('a laser can usually fire', () => {
    setPieceOnBoard(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
    setPieceOnBoard(
      board,
      3,
      'a',
      createPiece(PLAYER_WHITE, PAWN_SHIELD, EAST),
    );
    const laser = createPiece(PLAYER_WHITE, LASER, WEST);
    setPieceOnBoard(board, 3, files, laser);

    setPieceOnBoard(board, ranks, files, createPiece(PLAYER_BLACK, KING));
    setPieceOnBoard(board, ranks, 'a', createPiece(PLAYER_BLACK, ROOK));

    // Shooting would not remove the shield pawn (due to its shield facing the
    // laser, so that the king is still not in check by the enemy rook.
    const canFire = laserCanFire(board, laser);

    expect(canFire).toBe(true);
  });

  test('a laser cannot fire if the king is in check and the shot does not resolve the check', () => {
    setPieceOnBoard(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
    setPieceOnBoard(
      board,
      3,
      'b',
      createPiece(PLAYER_WHITE, PAWN_SHIELD, NORTH),
    );
    const laser = createPiece(PLAYER_WHITE, LASER, WEST);
    setPieceOnBoard(board, 3, files, laser);
    setPieceOnBoard(board, ranks, files, createPiece(PLAYER_BLACK, KING));
    setPieceOnBoard(board, ranks, 'a', createPiece(PLAYER_BLACK, ROOK));

    const canFire = laserCanFire(board, laser);

    expect(canFire).toBe(false);
  });

  test('a laser cannot fire if it results in check for its own king', () => {
    setPieceOnBoard(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
    setPieceOnBoard(
      board,
      3,
      'a',
      createPiece(PLAYER_WHITE, PAWN_SHIELD, NORTH),
    );
    const laser = createPiece(PLAYER_WHITE, LASER, WEST);
    setPieceOnBoard(board, 3, files, laser);

    setPieceOnBoard(board, ranks, files, createPiece(PLAYER_BLACK, KING));
    setPieceOnBoard(board, ranks, 'a', createPiece(PLAYER_BLACK, ROOK));

    // Shooting would remove the shield pawn so that the king is in check by
    // the enemy rook.
    const canFire = laserCanFire(board, laser);

    expect(canFire).toBe(false);
  });

  test('a laser can fire if the king is in check and the shot does resolve the check', () => {
    setPieceOnBoard(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
    const laser = createPiece(PLAYER_WHITE, LASER, WEST);
    setPieceOnBoard(board, 3, files, laser);

    setPieceOnBoard(board, ranks, files, createPiece(PLAYER_BLACK, KING));
    setPieceOnBoard(board, 3, 'a', createPiece(PLAYER_BLACK, QUEEN));

    // Shooting would remove the queen and resolve the check.
    const canFire = laserCanFire(board, laser);

    expect(canFire).toBe(true);
  });
});
