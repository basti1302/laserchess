import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
  applyMove,
  ranks,
} from '../../../engine/Board';
import {
  create as createPiece,
  possibleMovesIgnoringCheck,
} from '../../../engine/Piece';
import {
  PAWN_SHIELD,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  LASER,
} from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import {
  getFileAsLetter,
  setPiece as setPieceOnSquare,
} from '../../../engine/Square';
import { create as createMove } from '../../../engine/moves/Move';
import checkMove from '../../../testutil/checkMove';

describe('pawn moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  describe(`white pawn`, () => {
    test('should move one or two squares from home rank', () => {
      const from = getSquareFromBoard(board, 2, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 3, 'c');
      checkMove(moves[1], from, 4, 'c');
    });

    test('should move only one square when not on home rank', () => {
      const from = getSquareFromBoard(board, 3, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, 4, 'c');
    });

    test('should move one square when blocked', () => {
      const from = getSquareFromBoard(board, 2, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 4, 'c', createPiece(PLAYER_WHITE, PAWN_SHIELD));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, 3, 'c');
    });

    test('should not move when blocked', () => {
      const from = getSquareFromBoard(board, 2, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 3, 'c', createPiece(PLAYER_WHITE, PAWN_SHIELD));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(0);
    });

    test('does not capture straight', () => {
      const from = getSquareFromBoard(board, 2, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 3, 'c', createPiece(PLAYER_BLACK, PAWN_SHIELD));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(0);
    });

    test('captures north-east', () => {
      const from = getSquareFromBoard(board, 5, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 6, 'd', createPiece(PLAYER_BLACK, PAWN_SHIELD));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 6, 'c');
      checkMove(moves[1], from, 6, 'd');
    });

    test('captures north-west', () => {
      const from = getSquareFromBoard(board, 5, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 6, 'd', createPiece(PLAYER_BLACK, PAWN_SHIELD));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 6, 'c');
      checkMove(moves[1], from, 6, 'd');
    });

    test('captures en passant north-east', () => {
      const whitePawnFrom = getSquareFromBoard(board, ranks - 3, 'c');
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(whitePawnFrom, whitePawn);
      const blackPawnFrom = getSquareFromBoard(board, ranks - 1, 'd');
      const blackPawnTo = getSquareFromBoard(board, ranks - 3, 'd');
      const blackPawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(blackPawnFrom, blackPawn);
      applyMove(board, createMove(blackPawnFrom, blackPawnTo));

      possibleMovesIgnoringCheck(whitePawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], whitePawnFrom, ranks - 2, 'c');
      checkMove(moves[1], whitePawnFrom, ranks - 2, 'd');
      expect(moves[1].enPassantCapture).toBe(blackPawnTo);
    });

    test('captures en passant north-west', () => {
      const whitePawnFrom = getSquareFromBoard(board, ranks - 3, 'c');
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(whitePawnFrom, whitePawn);
      const blackPawnFrom = getSquareFromBoard(board, ranks - 1, 'b');
      const blackPawnTo = getSquareFromBoard(board, ranks - 3, 'b');
      const blackPawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(blackPawnFrom, blackPawn);
      applyMove(board, createMove(blackPawnFrom, blackPawnTo));

      possibleMovesIgnoringCheck(whitePawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], whitePawnFrom, ranks - 2, 'c');
      checkMove(moves[1], whitePawnFrom, ranks - 2, 'b');
      expect(moves[1].enPassantCapture).toBe(blackPawnTo);
    });

    test('should not capture en passant after a one-square move', () => {
      const whitePawnFrom = getSquareFromBoard(board, ranks - 3, 'c');
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(whitePawnFrom, whitePawn);
      const blackPawnFrom = getSquareFromBoard(board, ranks - 2, 'd');
      const blackPawnTo = getSquareFromBoard(board, ranks - 3, 'd');
      const blackPawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(blackPawnFrom, blackPawn);
      applyMove(board, createMove(blackPawnFrom, blackPawnTo));

      possibleMovesIgnoringCheck(whitePawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], whitePawnFrom, ranks - 2, 'c');
    });

    test('should not capture a piece that is not a pawn en passant', () => {
      const whitePawnFrom = getSquareFromBoard(board, ranks - 3, 'c');
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(whitePawnFrom, whitePawn);
      const blackRookFrom = getSquareFromBoard(board, ranks - 1, 'd');
      const blackRookTo = getSquareFromBoard(board, ranks - 3, 'd');
      const blackRook = createPiece(PLAYER_BLACK, ROOK);
      setPieceOnSquare(blackRookFrom, blackRook);
      applyMove(board, createMove(blackRookFrom, blackRookTo));

      possibleMovesIgnoringCheck(whitePawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], whitePawnFrom, ranks - 2, 'c');
    });

    test('should promote without capturing', () => {
      const from = getSquareFromBoard(board, ranks - 1, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, ranks, 'c', LASER);
      checkPromotion(moves[1], from, ranks, 'c', QUEEN);
      checkPromotion(moves[2], from, ranks, 'c', ROOK);
      checkPromotion(moves[3], from, ranks, 'c', KNIGHT);
      checkPromotion(moves[4], from, ranks, 'c', BISHOP);
    });

    test('should promote while capturing north-east', () => {
      const from = getSquareFromBoard(board, ranks - 1, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, ranks, 'd', createPiece(PLAYER_BLACK, QUEEN));
      // block non-capturing promotion
      setPieceOnBoard(board, ranks, 'c', createPiece(PLAYER_WHITE, QUEEN));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, ranks, 'd', LASER);
      checkPromotion(moves[1], from, ranks, 'd', QUEEN);
      checkPromotion(moves[2], from, ranks, 'd', ROOK);
      checkPromotion(moves[3], from, ranks, 'd', KNIGHT);
      checkPromotion(moves[4], from, ranks, 'd', BISHOP);
    });

    test('should promote while capturing north-west', () => {
      const from = getSquareFromBoard(board, ranks - 1, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, ranks, 'b', createPiece(PLAYER_BLACK, KNIGHT));
      // block non-capturing promotion
      setPieceOnBoard(board, ranks, 'c', createPiece(PLAYER_WHITE, KNIGHT));

      possibleMovesIgnoringCheck(pawn, board, moves);

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
      const from = getSquareFromBoard(board, ranks - 1, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, ranks - 2, 'c');
      checkMove(moves[1], from, ranks - 3, 'c');
    });

    test('should move only one square when not on home rank', () => {
      const from = getSquareFromBoard(board, ranks - 2, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 3, 'c');
    });

    test('should move one square when blocked', () => {
      const from = getSquareFromBoard(board, ranks - 1, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(
        board,
        ranks - 3,
        'c',
        createPiece(PLAYER_BLACK, PAWN_SHIELD),
      );

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 2, 'c');
    });

    test('should not move when blocked', () => {
      const from = getSquareFromBoard(board, ranks - 1, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(
        board,
        ranks - 2,
        'c',
        createPiece(PLAYER_BLACK, PAWN_SHIELD),
      );

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(0);
    });

    test('does not capture straight', () => {
      const from = getSquareFromBoard(board, ranks - 1, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(
        board,
        ranks - 3,
        'c',
        createPiece(PLAYER_WHITE, PAWN_SHIELD),
      );

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], from, ranks - 2, 'c');
    });

    test('captures south-east', () => {
      const from = getSquareFromBoard(board, 5, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 4, 'd', createPiece(PLAYER_WHITE, PAWN_SHIELD));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 4, 'c');
      checkMove(moves[1], from, 4, 'd');
    });

    test('captures south-west', () => {
      const from = getSquareFromBoard(board, 5, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 4, 'b', createPiece(PLAYER_WHITE, PAWN_SHIELD));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], from, 4, 'c');
      checkMove(moves[1], from, 4, 'b');
    });

    test('captures en passant south-east', () => {
      const blackPawnFrom = getSquareFromBoard(board, 4, 'c');
      const blackPawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(blackPawnFrom, blackPawn);
      const whitePawnFrom = getSquareFromBoard(board, 2, 'd');
      const whitePawnTo = getSquareFromBoard(board, 4, 'd');
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(whitePawnFrom, whitePawn);
      applyMove(board, createMove(whitePawnFrom, whitePawnTo));

      possibleMovesIgnoringCheck(blackPawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], blackPawnFrom, 3, 'c');
      checkMove(moves[1], blackPawnFrom, 3, 'd');
      expect(moves[1].enPassantCapture).toBe(whitePawnTo);
    });

    test('captures en passant south-west', () => {
      const blackPawnFrom = getSquareFromBoard(board, 4, 'c');
      const blackPawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(blackPawnFrom, blackPawn);
      const whitePawnFrom = getSquareFromBoard(board, 2, 'b');
      const whitePawnTo = getSquareFromBoard(board, 4, 'b');
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(whitePawnFrom, whitePawn);
      applyMove(board, createMove(whitePawnFrom, whitePawnTo));

      possibleMovesIgnoringCheck(blackPawn, board, moves);

      expect(moves.length).toEqual(2);
      checkMove(moves[0], blackPawnFrom, 3, 'c');
      checkMove(moves[1], blackPawnFrom, 3, 'b');
      expect(moves[1].enPassantCapture).toBe(whitePawnTo);
    });

    test('should not capture en passant after a one-square move', () => {
      const blackPawnFrom = getSquareFromBoard(board, 4, 'c');
      const blackPawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(blackPawnFrom, blackPawn);
      const whitePawnFrom = getSquareFromBoard(board, 3, 'd');
      const whitePawnTo = getSquareFromBoard(board, 4, 'd');
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_SHIELD);
      setPieceOnSquare(whitePawnFrom, whitePawn);
      applyMove(board, createMove(whitePawnFrom, whitePawnTo));

      possibleMovesIgnoringCheck(blackPawn, board, moves);

      expect(moves.length).toEqual(1);
      checkMove(moves[0], blackPawnFrom, 3, 'c');
    });

    test('should promote without capturing', () => {
      const from = getSquareFromBoard(board, 2, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, 1, 'c', LASER);
      checkPromotion(moves[1], from, 1, 'c', QUEEN);
      checkPromotion(moves[2], from, 1, 'c', ROOK);
      checkPromotion(moves[3], from, 1, 'c', KNIGHT);
      checkPromotion(moves[4], from, 1, 'c', BISHOP);
    });

    test('should promote while capturing south-east', () => {
      const from = getSquareFromBoard(board, 2, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 1, 'd', createPiece(PLAYER_WHITE, LASER));
      // block non-capturing promotion
      setPieceOnBoard(board, 1, 'c', createPiece(PLAYER_BLACK, LASER));

      possibleMovesIgnoringCheck(pawn, board, moves);

      expect(moves.length).toEqual(5);
      checkPromotion(moves[0], from, 1, 'd', LASER);
      checkPromotion(moves[1], from, 1, 'd', QUEEN);
      checkPromotion(moves[2], from, 1, 'd', ROOK);
      checkPromotion(moves[3], from, 1, 'd', KNIGHT);
      checkPromotion(moves[4], from, 1, 'd', BISHOP);
    });

    test('should promote while capturing south-west', () => {
      const from = getSquareFromBoard(board, 2, 'c');
      const pawn = createPiece(PLAYER_BLACK, PAWN_SHIELD);
      setPieceOnSquare(from, pawn);
      setPieceOnBoard(board, 1, 'b', createPiece(PLAYER_WHITE, KNIGHT));
      // block non-capturing promotion
      setPieceOnBoard(board, 1, 'c', createPiece(PLAYER_BLACK, KNIGHT));

      possibleMovesIgnoringCheck(pawn, board, moves);

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
  expect(getFileAsLetter(move.to)).toEqual(file);
  expect(move.castling).toBe(false);
  expect(move.from2).toBeNull();
  expect(move.to2).toBeNull();
  expect(move.promotion).toBe(true);
  expect(move.promotionTo).toBe(promotionTo);
}
