import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {
  PAWN_SHIELD,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  LASER,
} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import Move from '../../../engine/moves/Move';
import checkMove from '../../../testutil/checkMove';

describe('pawn moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  describe(`white pawn`, () => {
    test('should move one or two squares from home rank', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 3, 'c');
      checkMove(moves[1], from, 4, 'c');
    });

    test('should move only one square when not on home rank', () => {
      const from = board.getSquare(3, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, 4, 'c');
    });

    test('should move one square when blocked', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(4, 'c', new Piece(PLAYER_WHITE, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, 3, 'c');
    });

    test('should not move when blocked', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(3, 'c', new Piece(PLAYER_WHITE, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(0);
    });

    test('does not capture straight', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(3, 'c', new Piece(PLAYER_BLACK, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(0);
    });

    test('captures north-east', () => {
      const from = board.getSquare(5, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(6, 'd', new Piece(PLAYER_BLACK, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 6, 'c');
      checkMove(moves[1], from, 6, 'd');
    });

    test('captures north-west', () => {
      const from = board.getSquare(5, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(6, 'd', new Piece(PLAYER_BLACK, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 6, 'c');
      checkMove(moves[1], from, 6, 'd');
    });

    test('captures en passant north-east', () => {
      const whitePawnFrom = board.getSquare(ranks - 3, 'c');
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      whitePawnFrom.setPiece(whitePawn);
      const blackPawnFrom = board.getSquare(ranks - 1, 'd');
      const blackPawnTo = board.getSquare(ranks - 3, 'd');
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      blackPawnFrom.setPiece(blackPawn);
      board.applyMove(new Move(blackPawnFrom, blackPawnTo));

      whitePawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], whitePawnFrom, ranks - 2, 'c');
      checkMove(moves[1], whitePawnFrom, ranks - 2, 'd');
      expect(moves[1].enPassantCapture).toBe(blackPawnTo);
    });

    test('captures en passant north-west', () => {
      const whitePawnFrom = board.getSquare(ranks - 3, 'c');
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      whitePawnFrom.setPiece(whitePawn);
      const blackPawnFrom = board.getSquare(ranks - 1, 'b');
      const blackPawnTo = board.getSquare(ranks - 3, 'b');
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      blackPawnFrom.setPiece(blackPawn);
      board.applyMove(new Move(blackPawnFrom, blackPawnTo));

      whitePawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], whitePawnFrom, ranks - 2, 'c');
      checkMove(moves[1], whitePawnFrom, ranks - 2, 'b');
      expect(moves[1].enPassantCapture).toBe(blackPawnTo);
    });

    test('should not capture en passant after a one-square move', () => {
      const whitePawnFrom = board.getSquare(ranks - 3, 'c');
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      whitePawnFrom.setPiece(whitePawn);
      const blackPawnFrom = board.getSquare(ranks - 2, 'd');
      const blackPawnTo = board.getSquare(ranks - 3, 'd');
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      blackPawnFrom.setPiece(blackPawn);
      board.applyMove(new Move(blackPawnFrom, blackPawnTo));

      whitePawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], whitePawnFrom, ranks - 2, 'c');
    });

    test('should promote without capturing', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, ranks, 'c', LASER);
      checkPromotion(moves[1], from, ranks, 'c', QUEEN);
      checkPromotion(moves[2], from, ranks, 'c', ROOK);
      checkPromotion(moves[3], from, ranks, 'c', KNIGHT);
      checkPromotion(moves[4], from, ranks, 'c', BISHOP);
    });

    test('should promote while capturing north-east', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(ranks, 'd', new Piece(PLAYER_BLACK, QUEEN));
      // block non-capturing promotion
      board.setPiece(ranks, 'c', new Piece(PLAYER_WHITE, QUEEN));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, ranks, 'd', LASER);
      checkPromotion(moves[1], from, ranks, 'd', QUEEN);
      checkPromotion(moves[2], from, ranks, 'd', ROOK);
      checkPromotion(moves[3], from, ranks, 'd', KNIGHT);
      checkPromotion(moves[4], from, ranks, 'd', BISHOP);
    });

    test('should promote while capturing north-west', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(ranks, 'b', new Piece(PLAYER_BLACK, KNIGHT));
      // block non-capturing promotion
      board.setPiece(ranks, 'c', new Piece(PLAYER_WHITE, KNIGHT));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, ranks, 'b', LASER);
      checkPromotion(moves[1], from, ranks, 'b', QUEEN);
      checkPromotion(moves[2], from, ranks, 'b', ROOK);
      checkPromotion(moves[3], from, ranks, 'b', KNIGHT);
      checkPromotion(moves[4], from, ranks, 'b', BISHOP);
    });
  });

  describe(`black pawn`, () => {
    test('should move one or two squares from home rank', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, ranks - 2, 'c');
      checkMove(moves[1], from, ranks - 3, 'c');
    });

    test('should move only one square when not on home rank', () => {
      const from = board.getSquare(ranks - 2, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 3, 'c');
    });

    test('should move one square when blocked', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(ranks - 3, 'c', new Piece(PLAYER_BLACK, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 2, 'c');
    });

    test('should not move when blocked', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(ranks - 2, 'c', new Piece(PLAYER_BLACK, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(0);
    });

    test('does not capture straight', () => {
      const from = board.getSquare(ranks - 1, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(ranks - 3, 'c', new Piece(PLAYER_WHITE, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 2, 'c');
    });

    test('captures south-east', () => {
      const from = board.getSquare(5, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(4, 'd', new Piece(PLAYER_WHITE, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 4, 'c');
      checkMove(moves[1], from, 4, 'd');
    });

    test('captures south-west', () => {
      const from = board.getSquare(5, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(4, 'b', new Piece(PLAYER_WHITE, PAWN_SHIELD));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 4, 'c');
      checkMove(moves[1], from, 4, 'b');
    });

    test('captures en passant south-east', () => {
      const blackPawnFrom = board.getSquare(4, 'c');
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      blackPawnFrom.setPiece(blackPawn);
      const whitePawnFrom = board.getSquare(2, 'd');
      const whitePawnTo = board.getSquare(4, 'd');
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      whitePawnFrom.setPiece(whitePawn);
      board.applyMove(new Move(whitePawnFrom, whitePawnTo));

      blackPawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], blackPawnFrom, 3, 'c');
      checkMove(moves[1], blackPawnFrom, 3, 'd');
      expect(moves[1].enPassantCapture).toBe(whitePawnTo);
    });

    test('captures en passant south-west', () => {
      const blackPawnFrom = board.getSquare(4, 'c');
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      blackPawnFrom.setPiece(blackPawn);
      const whitePawnFrom = board.getSquare(2, 'b');
      const whitePawnTo = board.getSquare(4, 'b');
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      whitePawnFrom.setPiece(whitePawn);
      board.applyMove(new Move(whitePawnFrom, whitePawnTo));

      blackPawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], blackPawnFrom, 3, 'c');
      checkMove(moves[1], blackPawnFrom, 3, 'b');
      expect(moves[1].enPassantCapture).toBe(whitePawnTo);
    });

    test('should not capture en passant after a one-square move', () => {
      const blackPawnFrom = board.getSquare(4, 'c');
      const blackPawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      blackPawnFrom.setPiece(blackPawn);
      const whitePawnFrom = board.getSquare(3, 'd');
      const whitePawnTo = board.getSquare(4, 'd');
      const whitePawn = new Piece(PLAYER_WHITE, PAWN_SHIELD);
      whitePawnFrom.setPiece(whitePawn);
      board.applyMove(new Move(whitePawnFrom, whitePawnTo));

      blackPawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], blackPawnFrom, 3, 'c');
    });

    test('should promote without capturing', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, 1, 'c', LASER);
      checkPromotion(moves[1], from, 1, 'c', QUEEN);
      checkPromotion(moves[2], from, 1, 'c', ROOK);
      checkPromotion(moves[3], from, 1, 'c', KNIGHT);
      checkPromotion(moves[4], from, 1, 'c', BISHOP);
    });

    test('should promote while capturing south-east', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(1, 'd', new Piece(PLAYER_WHITE, LASER));
      // block non-capturing promotion
      board.setPiece(1, 'c', new Piece(PLAYER_BLACK, LASER));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, 1, 'd', LASER);
      checkPromotion(moves[1], from, 1, 'd', QUEEN);
      checkPromotion(moves[2], from, 1, 'd', ROOK);
      checkPromotion(moves[3], from, 1, 'd', KNIGHT);
      checkPromotion(moves[4], from, 1, 'd', BISHOP);
    });

    test('should promote while capturing south-west', () => {
      const from = board.getSquare(2, 'c');
      const pawn = new Piece(PLAYER_BLACK, PAWN_SHIELD);
      from.setPiece(pawn);
      board.setPiece(1, 'b', new Piece(PLAYER_WHITE, KNIGHT));
      // block non-capturing promotion
      board.setPiece(1, 'c', new Piece(PLAYER_BLACK, KNIGHT));

      pawn.possibleMovesIgnoringCheck(board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, 1, 'b', LASER);
      checkPromotion(moves[1], from, 1, 'b', QUEEN);
      checkPromotion(moves[2], from, 1, 'b', ROOK);
      checkPromotion(moves[3], from, 1, 'b', KNIGHT);
      checkPromotion(moves[4], from, 1, 'b', BISHOP);
    });
  });
});

function checkPromotion(move, from, rank, file, promotionTo) {
  expect(move.from).toBe(from);
  expect(move.to.rank).toEqual(rank);
  expect(move.to.getFileAsLetter()).toEqual(file);
  expect(move.castling).toBe(false);
  expect(move.from2).toBeNull();
  expect(move.to2).toBeNull();
  expect(move.promotion).toBe(true);
  expect(move.promotionTo).toBe(promotionTo);
}
