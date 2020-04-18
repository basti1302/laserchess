import {PLAYER_WHITE, PLAYER_BLACK} from '../../engine/Player';
import {
  KING,
  LASER,
  QUEEN,
  ROOK,
  KNIGHT,
  BISHOP,
  PAWN_SHIELD,
  PAWN_90_DEGREES,
  PAWN_THREEWAY,
} from '../../engine/PieceType';
import Board, {ranks, files} from '../../engine/Board';
import Piece from '../../engine/Piece';
import checkMove from '../../testutil/checkMove';

describe('Piece', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test('pawn types are pawns', () => {
    expect(KING.isPawn()).toBe(false);
    expect(LASER.isPawn()).toBe(false);
    expect(QUEEN.isPawn()).toBe(false);
    expect(ROOK.isPawn()).toBe(false);
    expect(KNIGHT.isPawn()).toBe(false);
    expect(BISHOP.isPawn()).toBe(false);
    expect(PAWN_SHIELD.isPawn()).toBe(true);
    expect(PAWN_90_DEGREES.isPawn()).toBe(true);
    expect(PAWN_THREEWAY.isPawn()).toBe(true);
  });

  describe('possible moves', () => {
    test('should calculate possible moves', () => {
      const king = new Piece(PLAYER_BLACK, KING);
      const kingsHome = board.getSquare(ranks - 1, 'e');
      board.setPiece(kingsHome.rank, kingsHome.file, king);
      board.setPiece(ranks - 2, 'd', new Piece(PLAYER_WHITE, ROOK));

      const moves = [];
      king.possibleMoves(board, moves);

      expect(moves.length).toBe(4);
      checkMove(moves[0], kingsHome, ranks, 'e');
      checkMove(moves[1], kingsHome, ranks, 'f');
      checkMove(moves[2], kingsHome, ranks - 1, 'f');
      checkMove(moves[3], kingsHome, ranks - 2, 'd');
    });
  });
});
