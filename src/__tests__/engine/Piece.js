import { PLAYER_WHITE, PLAYER_BLACK } from '../../engine/Player';
import {
  isPawn,
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
import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  ranks,
  setPiece as setPieceOnBoard,
} from '../../engine/Board';
import { create as createPiece, possibleMoves } from '../../engine/Piece';
import checkMove from '../../testutil/checkMove';

describe('Piece', () => {
  let board;

  beforeEach(() => {
    board = createBoard();
  });

  test('pawn types are pawns', () => {
    expect(isPawn(KING)).toBe(false);
    expect(isPawn(LASER)).toBe(false);
    expect(isPawn(QUEEN)).toBe(false);
    expect(isPawn(ROOK)).toBe(false);
    expect(isPawn(KNIGHT)).toBe(false);
    expect(isPawn(BISHOP)).toBe(false);
    expect(isPawn(PAWN_SHIELD)).toBe(true);
    expect(isPawn(PAWN_90_DEGREES)).toBe(true);
    expect(isPawn(PAWN_THREEWAY)).toBe(true);
  });

  describe('possible moves', () => {
    test('should calculate possible moves', () => {
      const king = createPiece(PLAYER_BLACK, KING);
      const kingsHome = getSquareFromBoard(board, ranks - 1, 'e');
      setPieceOnBoard(board, kingsHome.rank, kingsHome.file, king);
      setPieceOnBoard(board, ranks - 2, 'd', createPiece(PLAYER_WHITE, ROOK));

      const moves = [];
      possibleMoves(king, board, moves);

      expect(moves.length).toBe(4);
      checkMove(moves[0], kingsHome, ranks, 'e');
      checkMove(moves[1], kingsHome, ranks, 'f');
      checkMove(moves[2], kingsHome, ranks - 1, 'f');
      checkMove(moves[3], kingsHome, ranks - 2, 'd');
    });
  });
});
