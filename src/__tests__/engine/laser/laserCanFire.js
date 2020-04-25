import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {
  BISHOP,
  KING,
  KNIGHT,
  LASER,
  PAWN_90_DEGREES,
  PAWN_SHIELD,
  PAWN_THREEWAY,
  QUEEN,
  ROOK,
} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import {NORTH, EAST, SOUTH, WEST} from '../../../engine/Orientation';

describe('laser can fire', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test('a laser can usually fire', () => {
    board.setPiece(1, 'a', new Piece(PLAYER_WHITE, KING));
    board.setPiece(3, 'a', new Piece(PLAYER_WHITE, PAWN_SHIELD, EAST));
    const laser = new Piece(PLAYER_WHITE, LASER, WEST);
    board.setPiece(3, files, laser);

    board.setPiece(ranks, files, new Piece(PLAYER_BLACK, KING));
    board.setPiece(ranks, 'a', new Piece(PLAYER_BLACK, ROOK));

    // Shooting would not remove the shield pawn (due to its shield facing the
    // laser, so that the king is still not in check by the enemy rook.
    const canFire = board.laserCanFire(laser);

    expect(canFire).toBe(true);
  });

  test('a laser cannot fire if the king is in check and the shot does not resolve the check', () => {
    board.setPiece(1, 'a', new Piece(PLAYER_WHITE, KING));
    board.setPiece(3, 'b', new Piece(PLAYER_WHITE, PAWN_SHIELD, NORTH));
    const laser = new Piece(PLAYER_WHITE, LASER, WEST);
    board.setPiece(3, files, laser);
    board.setPiece(ranks, files, new Piece(PLAYER_BLACK, KING));
    board.setPiece(ranks, 'a', new Piece(PLAYER_BLACK, ROOK));

    const canFire = board.laserCanFire(laser);

    expect(canFire).toBe(false);
  });

  test('a laser cannot fire if it results in check for its own king', () => {
    board.setPiece(1, 'a', new Piece(PLAYER_WHITE, KING));
    board.setPiece(3, 'a', new Piece(PLAYER_WHITE, PAWN_SHIELD, NORTH));
    const laser = new Piece(PLAYER_WHITE, LASER, WEST);
    board.setPiece(3, files, laser);

    board.setPiece(ranks, files, new Piece(PLAYER_BLACK, KING));
    board.setPiece(ranks, 'a', new Piece(PLAYER_BLACK, ROOK));

    // Shooting would remove the shield pawn so that the king is in check by
    // the enemy rook.
    const canFire = board.laserCanFire(laser);

    expect(canFire).toBe(false);
  });

  test('a laser can fire if the king is in check and the shot does resolve the check', () => {
    board.setPiece(1, 'a', new Piece(PLAYER_WHITE, KING));
    const laser = new Piece(PLAYER_WHITE, LASER, WEST);
    board.setPiece(3, files, laser);

    board.setPiece(ranks, files, new Piece(PLAYER_BLACK, KING));
    board.setPiece(3, 'a', new Piece(PLAYER_BLACK, QUEEN));

    // Shooting would remove the queen and resolve the check.
    const canFire = board.laserCanFire(laser);

    expect(canFire).toBe(true);
  });
});
