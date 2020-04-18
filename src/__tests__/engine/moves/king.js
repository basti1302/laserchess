import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {
  BISHOP,
  KING,
  KNIGHT,
  LASER,
  QUEEN,
  ROOK,
} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import Move from '../../../engine/moves/Move';
import checkMove from '../../../testutil/checkMove';

describe('king moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should move one square in each direction', () => {
    const from = board.getSquare(1, 'c');
    const king = new Piece(PLAYER_WHITE, KING);
    from.setPiece(king);

    // Set up some pieces that block the king's movement.

    // block
    board.setPiece(2, 4, new Piece(PLAYER_WHITE, KNIGHT));
    // capture
    board.setPiece(2, 2, new Piece(PLAYER_BLACK, KNIGHT));

    king.possibleMovesIgnoringCheck(board, moves);

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
      whiteKing = new Piece(PLAYER_WHITE, KING);
      const whiteKingSideRook = new Piece(PLAYER_WHITE, ROOK);
      const whiteQueenSideRook = new Piece(PLAYER_WHITE, ROOK);
      blackKing = new Piece(PLAYER_BLACK, KING);
      const blackKingSideRook = new Piece(PLAYER_BLACK, ROOK);
      const blackQueenSideRook = new Piece(PLAYER_BLACK, ROOK);
      whiteKingHome = board.getSquare(1, 'e');
      whiteKingHome.setPiece(whiteKing);
      whiteRookKingSideHome = board.getSquare(1, 'a');
      whiteRookKingSideHome.setPiece(whiteKingSideRook);
      whiteRookQueenSideHome = board.getSquare(1, files);
      whiteRookQueenSideHome.setPiece(whiteQueenSideRook);
      blackKingHome = board.getSquare(ranks, 'e');
      blackKingHome.setPiece(blackKing);
      blackRookKingSideHome = board.getSquare(ranks, files);
      blackRookKingSideHome.setPiece(blackKingSideRook);
      blackRookQueenSideHome = board.getSquare(ranks, 'a');
      blackRookQueenSideHome.setPiece(blackQueenSideRook);

      whiteKingKingSideDestination = board.getSquare(1, 'c');
      whiteRookKingSideDestination = board.getSquare(1, 'd');

      whiteKingQueenSideDestination = board.getSquare(1, 'g');
      whiteRookQueenSideDestination = board.getSquare(1, 'f');

      blackKingKingSideDestination = board.getSquare(ranks, 'g');
      blackRookKingSideDestination = board.getSquare(ranks, 'f');

      blackKingQueenSideDestination = board.getSquare(ranks, 'c');
      blackRookQueenSideDestination = board.getSquare(ranks, 'd');
    });

    describe('white can castle both sides', () => {
      test('should add castling moves', () => {
        whiteKing.possibleMovesIgnoringCheck(board, moves);
        expect(moves.length).toBe(7);
        checkNoCastlingMoveUntil(5);
        checkWhiteKingSideCastling(5);
        checkWhiteQueenSideCastling(6);
      });
    });

    describe('white cannot castle king side', () => {
      test('rook has moved', () => {
        const square = board.getSquare(2, 'a');
        board.applyMove(new Move(whiteRookKingSideHome, square));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('rook has moved and returned', () => {
        const square = board.getSquare(2, 'a');
        board.applyMove(new Move(whiteRookKingSideHome, square));
        board.applyMove(new Move(square, whiteRookKingSideHome));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = board.getSquare(1, 'b');
        square.setPiece(new Piece(PLAYER_WHITE, KNIGHT));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = board.getSquare(1, 'c');
        square.setPiece(new Piece(PLAYER_WHITE, BISHOP));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = board.getSquare(1, 'd');
        square.setPiece(new Piece(PLAYER_WHITE, LASER));
        whiteKing.possibleMovesIgnoringCheck(board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkWhiteQueenSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = board.getSquare(5, 'd');
        square.setPiece(new Piece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleQueenSide();
      });

      test("the king's destination square is under attack", () => {
        const square = board.getSquare(5, 'c');
        square.setPiece(new Piece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleQueenSide();
      });
    });

    describe('white cannot castle queen side', () => {
      test('rook has moved', () => {
        const square = board.getSquare(2, 'i');
        board.applyMove(new Move(whiteRookQueenSideHome, square));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('rook has moved and returned', () => {
        const square = board.getSquare(2, 'i');
        board.applyMove(new Move(whiteRookQueenSideHome, square));
        board.applyMove(new Move(square, whiteRookQueenSideHome));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = board.getSquare(1, 'h');
        square.setPiece(new Piece(PLAYER_WHITE, KNIGHT));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = board.getSquare(1, 'g');
        square.setPiece(new Piece(PLAYER_WHITE, BISHOP));
        checkWhiteCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = board.getSquare(1, 'f');
        square.setPiece(new Piece(PLAYER_WHITE, QUEEN));
        whiteKing.possibleMovesIgnoringCheck(board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkWhiteKingSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = board.getSquare(5, 'f');
        square.setPiece(new Piece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleKingSide();
      });

      test("the king's destination square is under attack", () => {
        const square = board.getSquare(5, 'g');
        square.setPiece(new Piece(PLAYER_BLACK, ROOK));
        checkWhiteCanOnlyCastleKingSide();
      });
    });

    describe('white cannot castle', () => {
      test('king has moved', () => {
        const square = board.getSquare(1, 'd');
        board.applyMove(new Move(whiteKingHome, square));
        checkWhiteCantCastle();
      });

      test('king has moved and returned', () => {
        const square = board.getSquare(1, 'd');
        board.applyMove(new Move(whiteKingHome, square));
        board.applyMove(new Move(square, whiteKingHome));
        checkWhiteCantCastle();
      });

      test('the king is in check', () => {
        const square = board.getSquare(5, 'e');
        square.setPiece(new Piece(PLAYER_BLACK, ROOK));
        checkWhiteCantCastle();
      });
    });

    describe('black can castle both sides', () => {
      test('should add castling moves', () => {
        blackKing.possibleMovesIgnoringCheck(board, moves);
        expect(moves.length).toBe(7);
        checkNoCastlingMoveUntil(5);
        checkBlackKingSideCastling(5);
        checkBlackQueenSideCastling(6);
      });
    });

    describe('black cannot castle king side', () => {
      test('rook has moved', () => {
        const square = board.getSquare(ranks - 1, 'i');
        board.applyMove(new Move(blackRookKingSideHome, square));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('rook has moved and returned', () => {
        const square = board.getSquare(ranks - 1, 'i');
        board.applyMove(new Move(blackRookKingSideHome, square));
        board.applyMove(new Move(square, blackRookKingSideHome));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = board.getSquare(ranks, 'h');
        square.setPiece(new Piece(PLAYER_BLACK, KNIGHT));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = board.getSquare(ranks, 'g');
        square.setPiece(new Piece(PLAYER_BLACK, BISHOP));
        checkBlackCanOnlyCastleQueenSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = board.getSquare(ranks, 'f');
        square.setPiece(new Piece(PLAYER_BLACK, LASER));
        blackKing.possibleMovesIgnoringCheck(board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkBlackQueenSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = board.getSquare(5, 'f');
        square.setPiece(new Piece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleQueenSide();
      });

      test("the king's destination square is under attack", () => {
        const square = board.getSquare(5, 'g');
        square.setPiece(new Piece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleQueenSide();
      });
    });

    describe('black cannot castle queen side', () => {
      test('rook has moved', () => {
        const square = board.getSquare(ranks - 1, 'a');
        board.applyMove(new Move(blackRookQueenSideHome, square));
        checkBlackCanOnlyCastleKingSide();
      });

      test('rook has moved and returned', () => {
        const square = board.getSquare(ranks - 1, 'a');
        board.applyMove(new Move(blackRookQueenSideHome, square));
        board.applyMove(new Move(square, blackRookQueenSideHome));
        checkBlackCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #1', () => {
        const square = board.getSquare(ranks, 'b');
        square.setPiece(new Piece(PLAYER_BLACK, KNIGHT));
        checkBlackCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #2', () => {
        const square = board.getSquare(ranks, 'c');
        square.setPiece(new Piece(PLAYER_BLACK, BISHOP));
        checkBlackCanOnlyCastleKingSide();
      });

      test('there is a piece on a square that needs to be empty #3', () => {
        const square = board.getSquare(ranks, 'd');
        square.setPiece(new Piece(PLAYER_BLACK, QUEEN));
        blackKing.possibleMovesIgnoringCheck(board, moves);
        expect(moves.length).toBe(5);
        checkNoCastlingMoveUntil(4);
        checkBlackKingSideCastling(4);
      });

      test('the square the king travels over is under attack', () => {
        const square = board.getSquare(5, 'd');
        square.setPiece(new Piece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleKingSide();
      });

      test("the king's destination square is under attack", () => {
        const square = board.getSquare(5, 'c');
        square.setPiece(new Piece(PLAYER_WHITE, ROOK));
        checkBlackCanOnlyCastleKingSide();
      });
    });

    describe('black cannot castle', () => {
      test('king has moved', () => {
        const square = board.getSquare(ranks, 'd');
        board.applyMove(new Move(blackKingHome, square));
        checkBlackCantCastle();
      });

      test('king has moved and returned', () => {
        const square = board.getSquare(ranks, 'd');
        board.applyMove(new Move(blackKingHome, square));
        board.applyMove(new Move(square, blackKingHome));
        checkBlackCantCastle();
      });

      test('the king is in check', () => {
        const square = board.getSquare(5, 'e');
        square.setPiece(new Piece(PLAYER_WHITE, ROOK));
        checkBlackCantCastle();
      });
    });

    function checkWhiteCantCastle() {
      whiteKing.possibleMovesIgnoringCheck(board, moves);
      expect(moves.length).toBe(5);
      checkNoCastlingMoveUntil(5);
    }

    function checkBlackCantCastle() {
      blackKing.possibleMovesIgnoringCheck(board, moves);
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
      whiteKing.possibleMovesIgnoringCheck(board, moves);
      expect(moves.length).toBe(6);
      checkNoCastlingMoveUntil(5);
      checkWhiteQueenSideCastling(5);
    }

    function checkWhiteCanOnlyCastleKingSide() {
      whiteKing.possibleMovesIgnoringCheck(board, moves);
      expect(moves.length).toBe(6);
      checkNoCastlingMoveUntil(5);
      checkWhiteKingSideCastling(5);
    }

    function checkBlackCanOnlyCastleQueenSide() {
      blackKing.possibleMovesIgnoringCheck(board, moves);
      expect(moves.length).toBe(6);
      checkNoCastlingMoveUntil(5);
      checkBlackQueenSideCastling(5);
    }

    function checkBlackCanOnlyCastleKingSide() {
      blackKing.possibleMovesIgnoringCheck(board, moves);
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
