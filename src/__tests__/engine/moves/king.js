import {
  applyMove,
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
  ranks,
  files,
} from '../../../engine/Board';
import {
  create as createPiece,
  possibleMovesIgnoringCheck,
} from '../../../engine/Piece';
import {
  BISHOP,
  KING,
  KNIGHT,
  LASER,
  QUEEN,
  ROOK,
} from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';
import { create as createMove } from '../../../engine/moves/Move';
import checkMove from '../../../testutil/checkMove';

describe('king moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should move one square in each direction', () => {
    const from = getSquareFromBoard(board, 1, 'c');
    const king = createPiece(PLAYER_WHITE, KING);
    setPieceOnSquare(from, king);

    // Set up some pieces that block the king's movement.

    // block
    setPieceOnBoard(board, 2, 4, createPiece(PLAYER_WHITE, KNIGHT));
    // capture
    setPieceOnBoard(board, 2, 2, createPiece(PLAYER_BLACK, KNIGHT));

    possibleMovesIgnoringCheck(king, board, moves);

    expect(moves.length).toEqual(4);
    checkMove(moves[0], from, 2, 'c');
    // blocked: 2, 4
    checkMove(moves[1], from, 1, 'd');
    checkMove(moves[2], from, 1, 'b');
    checkMove(moves[3], from, 2, 'b');
  });

  describe('castling', () => {
    let whiteKingHome;
    let whiteRookKingSideHome;
    let whiteRookQueenSideHome;
    let blackKingHome;
    let blackRookKingSideHome;
    let blackRookQueenSideHome;
    let whiteKing;
    let blackKing;

    let whiteKingKingSideDestination;
    let whiteRookKingSideDestination;
    let whiteKingQueenSideDestination;
    let whiteRookQueenSideDestination;
    let blackKingKingSideDestination;
    let blackRookKingSideDestination;
    let blackKingQueenSideDestination;
    let blackRookQueenSideDestination;

    beforeEach(() => {
      whiteKing = createPiece(PLAYER_WHITE, KING);
      const whiteKingSideRook = createPiece(PLAYER_WHITE, ROOK);
      const whiteQueenSideRook = createPiece(PLAYER_WHITE, ROOK);
      blackKing = createPiece(PLAYER_BLACK, KING);
      const blackKingSideRook = createPiece(PLAYER_BLACK, ROOK);
      const blackQueenSideRook = createPiece(PLAYER_BLACK, ROOK);
      whiteKingHome = getSquareFromBoard(board, 1, 'e');
      setPieceOnSquare(whiteKingHome, whiteKing);
      whiteRookKingSideHome = getSquareFromBoard(board, 1, 'a');
      setPieceOnSquare(whiteRookKingSideHome, whiteKingSideRook);
      whiteRookQueenSideHome = getSquareFromBoard(board, 1, files);
      setPieceOnSquare(whiteRookQueenSideHome, whiteQueenSideRook);
      blackKingHome = getSquareFromBoard(board, ranks, 'e');
      setPieceOnSquare(blackKingHome, blackKing);
      blackRookKingSideHome = getSquareFromBoard(board, ranks, files);
      setPieceOnSquare(blackRookKingSideHome, blackKingSideRook);
      blackRookQueenSideHome = getSquareFromBoard(board, ranks, 'a');
      setPieceOnSquare(blackRookQueenSideHome, blackQueenSideRook);

      whiteKingKingSideDestination = getSquareFromBoard(board, 1, 'c');
      whiteRookKingSideDestination = getSquareFromBoard(board, 1, 'd');

      whiteKingQueenSideDestination = getSquareFromBoard(board, 1, 'g');
      whiteRookQueenSideDestination = getSquareFromBoard(board, 1, 'f');

      blackKingKingSideDestination = getSquareFromBoard(board, ranks, 'g');
      blackRookKingSideDestination = getSquareFromBoard(board, ranks, 'f');

      blackKingQueenSideDestination = getSquareFromBoard(board, ranks, 'c');
      blackRookQueenSideDestination = getSquareFromBoard(board, ranks, 'd');
    });

    describe('white can castle both sides', () => {
      test('should add castling moves', () => {
        possibleMovesIgnoringCheck(whiteKing, board, moves);
        expect(moves.length).toBe(7);
        checkNoCastlingMoveUntil(5);
        checkWhiteKingSideCastling(5);
        checkWhiteQueenSideCastling(6);
      });
    });

    describe('white cannot castle king side', () => {
      test('rook has moved', () => {
        const square = getSquareFromBoard(board, 2, 'a');
        applyMove(board, createMove(whiteRookKingSideHome, square));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('rook has moved and returned', () => {
        const square = getSquareFromBoard(board, 2, 'a');
        applyMove(board, createMove(whiteRookKingSideHome, square));
        applyMove(board, createMove(square, whiteRookKingSideHome));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = getSquareFromBoard(board, 1, 'b');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, KNIGHT));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = getSquareFromBoard(board, 1, 'c');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, BISHOP));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = getSquareFromBoard(board, 1, 'd');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, LASER));
        possibleMovesIgnoringCheck(whiteKing, board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkWhiteQueenSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = getSquareFromBoard(board, 5, 'd');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test("the king's destination square is under attack", () => {
        const square = getSquareFromBoard(board, 5, 'c');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleQueenSide();
      });
    });

    describe('white cannot castle queen side', () => {
      test('rook has moved', () => {
        const square = getSquareFromBoard(board, 2, 'i');
        applyMove(board, createMove(whiteRookQueenSideHome, square));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('rook has moved and returned', () => {
        const square = getSquareFromBoard(board, 2, 'i');
        applyMove(board, createMove(whiteRookQueenSideHome, square));
        applyMove(board, createMove(square, whiteRookQueenSideHome));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = getSquareFromBoard(board, 1, 'h');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, KNIGHT));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = getSquareFromBoard(board, 1, 'g');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, BISHOP));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = getSquareFromBoard(board, 1, 'f');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, QUEEN));
        possibleMovesIgnoringCheck(whiteKing, board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkWhiteKingSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = getSquareFromBoard(board, 5, 'f');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleKingSide();
      });

      test("the king's destination square is under attack", () => {
        const square = getSquareFromBoard(board, 5, 'g');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleKingSide();
      });
    });

    describe('white cannot castle', () => {
      test('king has moved', () => {
        const square = getSquareFromBoard(board, 1, 'd');
        applyMove(board, createMove(whiteKingHome, square));
        checkWhiteCantCastle();
      });

      test('king has moved and returned', () => {
        const square = getSquareFromBoard(board, 1, 'd');
        applyMove(board, createMove(whiteKingHome, square));
        applyMove(board, createMove(square, whiteKingHome));
        checkWhiteCantCastle();
      });

      test('the king is in check', () => {
        const square = getSquareFromBoard(board, 5, 'e');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, ROOK));
        checkWhiteCantCastle();
      });
    });

    describe('black can castle both sides', () => {
      test('should add castling moves', () => {
        possibleMovesIgnoringCheck(blackKing, board, moves);
        expect(moves.length).toBe(7);
        checkNoCastlingMoveUntil(5);
        checkBlackKingSideCastling(5);
        checkBlackQueenSideCastling(6);
      });
    });

    describe('black cannot castle king side', () => {
      test('rook has moved', () => {
        const square = getSquareFromBoard(board, ranks - 1, 'i');
        applyMove(board, createMove(blackRookKingSideHome, square));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('rook has moved and returned', () => {
        const square = getSquareFromBoard(board, ranks - 1, 'i');
        applyMove(board, createMove(blackRookKingSideHome, square));
        applyMove(board, createMove(square, blackRookKingSideHome));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = getSquareFromBoard(board, ranks, 'h');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, KNIGHT));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = getSquareFromBoard(board, ranks, 'g');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, BISHOP));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = getSquareFromBoard(board, ranks, 'f');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, LASER));
        possibleMovesIgnoringCheck(blackKing, board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkBlackQueenSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = getSquareFromBoard(board, 5, 'f');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleQueenSide();
      });

      test("the king's destination square is under attack", () => {
        const square = getSquareFromBoard(board, 5, 'g');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleQueenSide();
      });
    });

    describe('black cannot castle queen side', () => {
      test('rook has moved', () => {
        const square = getSquareFromBoard(board, ranks - 1, 'a');
        applyMove(board, createMove(blackRookQueenSideHome, square));
        checkBlackCanOnlyCastleKingSide();
      });

      test('rook has moved and returned', () => {
        const square = getSquareFromBoard(board, ranks - 1, 'a');
        applyMove(board, createMove(blackRookQueenSideHome, square));
        applyMove(board, createMove(square, blackRookQueenSideHome));
        checkBlackCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = getSquareFromBoard(board, ranks, 'b');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, KNIGHT));
        checkBlackCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = getSquareFromBoard(board, ranks, 'c');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, BISHOP));
        checkBlackCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = getSquareFromBoard(board, ranks, 'd');
        setPieceOnSquare(square, createPiece(PLAYER_BLACK, QUEEN));
        possibleMovesIgnoringCheck(blackKing, board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkBlackKingSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = getSquareFromBoard(board, 5, 'd');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleKingSide();
      });

      test("the king's destination square is under attack", () => {
        const square = getSquareFromBoard(board, 5, 'c');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleKingSide();
      });
    });

    describe('black cannot castle', () => {
      test('king has moved', () => {
        const square = getSquareFromBoard(board, ranks, 'd');
        applyMove(board, createMove(blackKingHome, square));
        checkBlackCantCastle();
      });

      test('king has moved and returned', () => {
        const square = getSquareFromBoard(board, ranks, 'd');
        applyMove(board, createMove(blackKingHome, square));
        applyMove(board, createMove(square, blackKingHome));
        checkBlackCantCastle();
      });

      test('the king is in check', () => {
        const square = getSquareFromBoard(board, 5, 'e');
        setPieceOnSquare(square, createPiece(PLAYER_WHITE, ROOK));
        checkBlackCantCastle();
      });
    });

    function checkWhiteCantCastle() {
      possibleMovesIgnoringCheck(whiteKing, board, moves);
      expect(moves.length).toBe(5);
      checkNoCastlingMoveUntil(5);
    }

    function checkBlackCantCastle() {
      possibleMovesIgnoringCheck(blackKing, board, moves);
      expect(moves.length).toBe(5);
      checkNoCastlingMoveUntil(5);
    }

    function checkWhiteKingSideCastling(i) {
      checkCastlingMove(
        moves[i],
        whiteKingHome,
        whiteKingKingSideDestination,
        whiteRookKingSideHome,
        whiteRookKingSideDestination,
      );
    }

    function checkWhiteCanOnlyCastleQueenSide() {
      possibleMovesIgnoringCheck(whiteKing, board, moves);
      expect(moves.length).toBe(6);
      checkNoCastlingMoveUntil(5);
      checkWhiteQueenSideCastling(5);
    }

    function checkWhiteCanOnlyCastleKingSide() {
      possibleMovesIgnoringCheck(whiteKing, board, moves);
      expect(moves.length).toBe(6);
      checkNoCastlingMoveUntil(5);
      checkWhiteKingSideCastling(5);
    }

    function checkBlackCanOnlyCastleQueenSide() {
      possibleMovesIgnoringCheck(blackKing, board, moves);
      expect(moves.length).toBe(6);
      checkNoCastlingMoveUntil(5);
      checkBlackQueenSideCastling(5);
    }

    function checkBlackCanOnlyCastleKingSide() {
      possibleMovesIgnoringCheck(blackKing, board, moves);
      expect(moves.length).toBe(6);
      checkNoCastlingMoveUntil(5);
      checkBlackKingSideCastling(5);
    }

    function checkNoCastlingMoveUntil(until) {
      for (let i = 0; i < until; i++) {
        expect(moves[i].castling).toBe(false);
      }
    }

    function checkWhiteQueenSideCastling(i) {
      checkCastlingMove(
        moves[i],
        whiteKingHome,
        whiteKingQueenSideDestination,
        whiteRookQueenSideHome,
        whiteRookQueenSideDestination,
      );
    }

    function checkBlackKingSideCastling(i) {
      checkCastlingMove(
        moves[i],
        blackKingHome,
        blackKingKingSideDestination,
        blackRookKingSideHome,
        blackRookKingSideDestination,
      );
    }

    function checkBlackQueenSideCastling(i) {
      checkCastlingMove(
        moves[i],
        blackKingHome,
        blackKingQueenSideDestination,
        blackRookQueenSideHome,
        blackRookQueenSideDestination,
      );
    }

    function checkCastlingMove(move, from, to, from2, to2) {
      expect(move.castling).toBe(true);
      expect(move.from).toBe(from);
      expect(move.to).toBe(to);
      expect(move.from2).toBe(from2);
      expect(move.to2).toBe(to2);
    }
  });
});
