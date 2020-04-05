import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {PAWN} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import checkMove from '../../../testutil/checkMove';

describe('pawn moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  // TODO capture, en passant, promotion, blocked by enemy piece

  describe(`white pawn`, () => {
    test('should move one or two squares', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 3, 'c');
      checkMove(moves[1], from, 4, 'c');
    });

    test('should move one square when blocked', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN);
      from.setPiece(pawn);

      board.setPiece(4, 'c', new Piece(PLAYER_WHITE, PAWN));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, 3, 'c');
    });

    test('should not move when blocked', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN);
      from.setPiece(pawn);

      board.setPiece(3, 'c', new Piece(PLAYER_WHITE, PAWN));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(0);
    });

    test('is also blocked by enemy pieces', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN);
      from.setPiece(pawn);

      board.setPiece(3, 'c', new Piece(PLAYER_BLACK, PAWN));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(0);
    });
  });

  describe(`black pawn`, () => {
    test('should move one or two squares', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, ranks - 2, 'c');
      checkMove(moves[1], from, ranks - 3, 'c');
    });

    test('should move one square when blocked', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN);
      from.setPiece(pawn);

      board.setPiece(ranks - 3, 'c', new Piece(PLAYER_BLACK, PAWN));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 2, 'c');
    });

    test('should not move when blocked', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN);
      from.setPiece(pawn);

      board.setPiece(ranks - 2, 'c', new Piece(PLAYER_BLACK, PAWN));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(0);
    });

    test('is also blocked by enemy pieces', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN);
      from.setPiece(pawn);

      board.setPiece(ranks - 3, 'c', new Piece(PLAYER_WHITE, PAWN));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 2, 'c');
    });
  });
});
