import {WHITE, BLACK} from '../../engine/Color';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../engine/Player';
import {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
  LASER,
} from '../../engine/PieceType';
import Board, {ranks, files} from '../../engine/Board';
import checkMove from '../../testutil/checkMove';
import Piece from '../../engine/Piece';
import Move from '../../engine/moves/Move';
import Square from '../../engine/Square';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  describe('pieces and squares', () => {
    test('checks lower bound for rank', () => {
      expect(board.getSquare(0, 1)).toBeNull();
    });

    test('checks lower bound for file', () => {
      expect(board.getSquare(1, 0)).toBeNull();
    });

    test('checks upper bound for rank', () => {
      expect(board.getSquare(10, 1)).toBeNull();
    });

    test('checks upper bound for file', () => {
      expect(board.getSquare(1, 10)).toBeNull();
    });

    test('has empty squares and pieces initially', () => {
      for (let rank = 1; rank <= ranks; rank++) {
        for (let file = 1; file <= files; file++) {
          const square = board.getSquare(rank, file);
          expect(square).toEqual(expect.any(Square));
          expect(square.getPiece()).toBeNull();
        }
      }
    });

    test('accepts files as lower case letters', () => {
      for (let rank = 1; rank <= ranks; rank++) {
        for (let fileIdx = 1; fileIdx <= files; fileIdx++) {
          const file = String.fromCharCode(fileIdx + 96);
          expect(board.getSquare(rank, fileIdx)).toBe(
            board.getSquare(rank, file),
          );
        }
      }
    });

    test('accepts files  as upper case letters', () => {
      for (let rank = 1; rank <= ranks; rank++) {
        for (let fileIdx = 1; fileIdx <= files; fileIdx++) {
          const file = String.fromCharCode(fileIdx + 64);
          expect(board.getSquare(rank, fileIdx)).toBe(
            board.getSquare(rank, file),
          );
        }
      }
    });

    test('remembers pieces that have been set', () => {
      // set up some dummy pieces
      for (let rank = 1; rank <= ranks; rank++) {
        for (let file = 1; file <= files; file++) {
          board.setPiece(rank, file, new Piece(PLAYER_WHITE, PAWN));
        }
      }

      // read out squares and pieces again
      for (let rank = 1; rank <= ranks; rank++) {
        for (let file = 1; file <= files; file++) {
          const square = board.getSquare(rank, file);
          expect(square.id).toBe(`${rank}-${file}`);
          expect(square).toEqual(expect.any(Square));
          expect(square.rank).toBe(rank);
          expect(square.file).toBe(file);
          const piece = square.getPiece();
          expect(piece).toEqual(expect.any(Piece));
          expect(piece.player).toBe(PLAYER_WHITE);
          expect(piece.player.color).toBe(WHITE);
          expect(piece.player.boardIoLabel).toBe('0');
          expect(piece.type).toBe(PAWN);
          const position = piece.getPosition();
          expect(position.rank).toBe(rank);
          expect(position.file).toBe(file);
        }
      }
    });
  });

  describe('initial setup', () => {
    test('should be correct', () => {
      board.setup();

      for (let rank = 1; rank <= 2; rank++) {
        for (let file = 1; file <= files; file++) {
          expect(board.getSquare(rank, file).getPiece().player).toEqual(
            PLAYER_WHITE,
          );
          expect(board.getSquare(rank, file).getPiece().player.color).toEqual(
            WHITE,
          );
          expect(
            board.getSquare(rank, file).getPiece().player.boardIoLabel,
          ).toEqual('0');
        }
      }
      for (let rank = files - 1; rank <= ranks; rank++) {
        for (let file = 1; file <= files; file++) {
          expect(board.getSquare(rank, file).getPiece().player).toEqual(
            PLAYER_BLACK,
          );
          expect(board.getSquare(rank, file).getPiece().player.color).toEqual(
            BLACK,
          );
          expect(
            board.getSquare(rank, file).getPiece().player.boardIoLabel,
          ).toEqual('1');
        }
      }

      for (let file = 1; file <= files; file++) {
        expect(board.getSquare(2, file).getPiece().type).toEqual(PAWN);
        expect(board.getSquare(ranks - 1, file).getPiece().type).toEqual(PAWN);
      }

      expect(board.getSquare(1, 'a').getPiece().type).toEqual(ROOK);
      expect(board.getSquare(1, 'b').getPiece().type).toEqual(KNIGHT);
      expect(board.getSquare(1, 'c').getPiece().type).toEqual(BISHOP);
      expect(board.getSquare(1, 'd').getPiece().type).toEqual(LASER);
      expect(board.getSquare(1, 'e').getPiece().type).toEqual(KING);
      expect(board.getSquare(1, 'f').getPiece().type).toEqual(QUEEN);
      expect(board.getSquare(1, 'g').getPiece().type).toEqual(BISHOP);
      expect(board.getSquare(1, 'h').getPiece().type).toEqual(KNIGHT);
      expect(board.getSquare(1, 'i').getPiece().type).toEqual(ROOK);

      expect(board.getSquare(ranks, 'a').getPiece().type).toEqual(ROOK);
      expect(board.getSquare(ranks, 'b').getPiece().type).toEqual(KNIGHT);
      expect(board.getSquare(ranks, 'c').getPiece().type).toEqual(BISHOP);
      expect(board.getSquare(ranks, 'd').getPiece().type).toEqual(QUEEN);
      expect(board.getSquare(ranks, 'e').getPiece().type).toEqual(KING);
      expect(board.getSquare(ranks, 'f').getPiece().type).toEqual(LASER);
      expect(board.getSquare(ranks, 'g').getPiece().type).toEqual(BISHOP);
      expect(board.getSquare(ranks, 'h').getPiece().type).toEqual(KNIGHT);
      expect(board.getSquare(ranks, 'i').getPiece().type).toEqual(ROOK);

      // verify empty squares from ranks 3 to rank 7
      for (let rank = 3; rank <= ranks - 2; rank++) {
        for (let file = 1; file <= files; file++) {
          const square = board.getSquare(rank, file);
          expect(square).toEqual(expect.any(Square));
          expect(square.getPiece()).toBeNull();
        }
      }
    });
  });

  describe('all moves', () => {
    test('find all moves ignoring check for white', () => {
      const queenFrom = board.getSquare(3, 'b');
      board.setPiece(3, 'b', new Piece(PLAYER_WHITE, QUEEN));
      const laserFrom = board.getSquare(5, 'a');
      board.setPiece(5, 'a', new Piece(PLAYER_WHITE, LASER));
      const rookFrom = board.getSquare(6, 'e');
      board.setPiece(6, 'e', new Piece(PLAYER_WHITE, ROOK));

      board.setPiece(7, 'e', new Piece(PLAYER_BLACK, PAWN));
      board.setPiece(6, 'c', new Piece(PLAYER_BLACK, PAWN));

      const moves = board.allMovesIgnoringCheck(PLAYER_WHITE);

      expect(moves.length).toEqual(39);
      let i = 0;
      // queen (3-b) moving north
      checkMove(moves[i++], queenFrom, 4, 'b');
      checkMove(moves[i++], queenFrom, 5, 'b');
      checkMove(moves[i++], queenFrom, 6, 'b');
      checkMove(moves[i++], queenFrom, 7, 'b');
      checkMove(moves[i++], queenFrom, 8, 'b');
      checkMove(moves[i++], queenFrom, 9, 'b');
      // queen (3-b) moving north-east until blocked by laser
      checkMove(moves[i++], queenFrom, 4, 'c');
      checkMove(moves[i++], queenFrom, 5, 'd');
      // queen (3-b) moving east
      checkMove(moves[i++], queenFrom, 3, 'c');
      checkMove(moves[i++], queenFrom, 3, 'd');
      checkMove(moves[i++], queenFrom, 3, 'e');
      checkMove(moves[i++], queenFrom, 3, 'f');
      checkMove(moves[i++], queenFrom, 3, 'g');
      checkMove(moves[i++], queenFrom, 3, 'h');
      checkMove(moves[i++], queenFrom, 3, 'i');
      // queen (3-b) moving south-east
      checkMove(moves[i++], queenFrom, 2, 'c');
      checkMove(moves[i++], queenFrom, 1, 'd');
      // queen (3-b) moving south
      checkMove(moves[i++], queenFrom, 2, 'b');
      checkMove(moves[i++], queenFrom, 1, 'b');
      // queen (3-b) moving south-west
      checkMove(moves[i++], queenFrom, 2, 'a');
      // queen (3-b) moving west
      checkMove(moves[i++], queenFrom, 3, 'a');
      // queen (3-b) moving north-west
      checkMove(moves[i++], queenFrom, 4, 'a');

      // laser (5-a)
      checkMove(moves[i++], laserFrom, 6, 'a');
      checkMove(moves[i++], laserFrom, 6, 'b');
      checkMove(moves[i++], laserFrom, 5, 'b');
      checkMove(moves[i++], laserFrom, 4, 'b');
      checkMove(moves[i++], laserFrom, 4, 'a');

      // rook (6-e) moving north until capturing enemy pawn on 7-e
      checkMove(moves[i++], rookFrom, 7, 'e');
      // rook (6-e) moving east
      checkMove(moves[i++], rookFrom, 6, 'f');
      checkMove(moves[i++], rookFrom, 6, 'g');
      checkMove(moves[i++], rookFrom, 6, 'h');
      checkMove(moves[i++], rookFrom, 6, 'i');
      // rook (6-e) moving south
      checkMove(moves[i++], rookFrom, 5, 'e');
      checkMove(moves[i++], rookFrom, 4, 'e');
      checkMove(moves[i++], rookFrom, 3, 'e');
      checkMove(moves[i++], rookFrom, 2, 'e');
      checkMove(moves[i++], rookFrom, 1, 'e');
      // rook (6-e) moving west until capturing enemy pawn 6-c
      checkMove(moves[i++], rookFrom, 6, 'd');
      checkMove(moves[i++], rookFrom, 6, 'c');
    });
  });

  describe('attacked by', () => {
    test('must verify that a square is attacked by a player', () => {
      const queenFrom = board.getSquare(3, 'b');
      board.setPiece(3, 'b', new Piece(PLAYER_WHITE, QUEEN));
      const laserFrom = board.getSquare(5, 'a');
      board.setPiece(5, 'a', new Piece(PLAYER_WHITE, LASER));
      const rookFrom = board.getSquare(6, 'e');
      board.setPiece(6, 'e', new Piece(PLAYER_WHITE, ROOK));

      board.setPiece(7, 'e', new Piece(PLAYER_BLACK, PAWN));
      board.setPiece(6, 'c', new Piece(PLAYER_BLACK, PAWN));

      const moves = board.allMovesIgnoringCheck(PLAYER_WHITE);

      const expectedAttackedSquares = [
        // queen (3-b) moving north
        board.getSquare(4, 'b'),
        board.getSquare(5, 'b'),
        board.getSquare(6, 'b'),
        board.getSquare(7, 'b'),
        board.getSquare(8, 'b'),
        board.getSquare(9, 'b'),
        // queen (3-b) moving north-east until blocked by laser
        board.getSquare(4, 'c'),
        board.getSquare(5, 'd'),
        // queen (3-b) moving east
        board.getSquare(3, 'c'),
        board.getSquare(3, 'd'),
        board.getSquare(3, 'e'),
        board.getSquare(3, 'f'),
        board.getSquare(3, 'g'),
        board.getSquare(3, 'h'),
        board.getSquare(3, 'i'),
        // queen (3-b) moving south-east
        board.getSquare(2, 'c'),
        board.getSquare(1, 'd'),
        // queen (3-b) moving south
        board.getSquare(2, 'b'),
        board.getSquare(1, 'b'),
        // queen (3-b) moving south-west
        board.getSquare(2, 'a'),
        // queen (3-b) moving west
        board.getSquare(3, 'a'),
        // queen (3-b) moving north-west
        board.getSquare(4, 'a'),

        // laser (5-a)
        board.getSquare(6, 'a'),
        board.getSquare(6, 'b'),
        board.getSquare(5, 'b'),
        board.getSquare(4, 'b'),
        board.getSquare(4, 'a'),

        // rook (6-e) moving north until capturing enemy pawn on 7-e
        board.getSquare(7, 'e'),
        // rook (6-e) moving east
        board.getSquare(6, 'f'),
        board.getSquare(6, 'g'),
        board.getSquare(6, 'h'),
        board.getSquare(6, 'i'),
        // rook (6-e) moving south
        board.getSquare(5, 'e'),
        board.getSquare(4, 'e'),
        board.getSquare(3, 'e'),
        board.getSquare(2, 'e'),
        board.getSquare(1, 'e'),
        // rook (6-e) moving west until capturing enemy pawn 6-c
        board.getSquare(6, 'd'),
        board.getSquare(6, 'c'),
      ];

      // verify all attacked fields
      expectedAttackedSquares.forEach((attackedSquare) =>
        expect(board.isAttackedBy(attackedSquare, PLAYER_WHITE)).toBe(true),
      );

      // verify all non-attacked fields
      board.forEachSquare((s) => {
        if (!expectedAttackedSquares.includes(s)) {
          expect(board.isAttackedBy(s, PLAYER_WHITE)).toBe(false);
        }
      });
    });
  });

  describe('apply moves', () => {
    test('should move the piece', () => {
      const pawn = new Piece(PLAYER_WHITE, PAWN);
      const pawnPos1 = board.getSquare(2, 'a');
      const pawnPos2 = board.getSquare(4, 'a');
      board.setPiece(pawnPos1.rank, pawnPos1.file, pawn);

      board.applyMove(new Move(pawnPos1, pawnPos2));

      expect(pawnPos1.getPiece()).toBeNull();
      expect(pawnPos2.getPiece()).toBe(pawn);
      expect(pawn.getPosition().rank).toBe(pawnPos2.rank);
      expect(pawn.getPosition().file).toBe(pawnPos2.file);
    });

    test('should record that a piece has moved', () => {
      const pawn1 = new Piece(PLAYER_WHITE, PAWN);
      const pawn1Pos = board.getSquare(2, 'a');
      const pawn2 = new Piece(PLAYER_WHITE, PAWN);
      const pawn2Pos = board.getSquare(2, 'b');
      board.setPiece(pawn1Pos.rank, pawn1Pos.file, pawn1);
      board.setPiece(pawn2Pos.rank, pawn2Pos.file, pawn2);

      board.applyMove(new Move(pawn1Pos, board.getSquare(3, 'a')));

      expect(pawn1.hasMoved).toBe(true);
      expect(pawn2.hasMoved).toBe(false);
    });

    test('should capture a piece', () => {
      const whiteRook = new Piece(PLAYER_WHITE, ROOK);
      const blackKnight = new Piece(PLAYER_BLACK, KNIGHT);
      const whiteRookPos = board.getSquare(1, 'a');
      const blackKnightPos = board.getSquare(5, 'a');
      board.setPiece(whiteRookPos.rank, whiteRookPos.file, whiteRook);
      board.setPiece(blackKnightPos.rank, blackKnightPos.file, blackKnight);

      board.applyMove(new Move(whiteRookPos, blackKnightPos));

      expect(whiteRookPos.getPiece()).toBeNull();
      expect(blackKnightPos.getPiece()).toBe(whiteRook);
      expect(whiteRook.getPosition().rank).toBe(blackKnightPos.rank);
      expect(whiteRook.getPosition().file).toBe(blackKnightPos.file);
      expect(blackKnight.getPosition()).toBe(null);
    });

    test('should apply a castling', () => {
      const whiteKing = new Piece(PLAYER_WHITE, KING);
      const whiteKingPos = board.getSquare(1, 'e');
      const whiteKingDest = board.getSquare(1, 'c');
      const whiteKingSideRook = new Piece(PLAYER_WHITE, ROOK);
      const whiteKingSideRookPos = board.getSquare(1, 'a');
      const whiteKingSideRookDest = board.getSquare(1, 'd');
      board.setPiece(whiteKingPos.rank, whiteKingPos.file, whiteKing);
      board.setPiece(
        whiteKingSideRookPos.rank,
        whiteKingSideRookPos.file,
        whiteKingSideRook,
      );

      board.applyMove(
        new Move(
          whiteKingPos,
          whiteKingDest,
          whiteKingSideRookPos,
          whiteKingSideRookDest,
        ),
      );

      expect(whiteKingPos.getPiece()).toBeNull();
      expect(whiteKingDest.getPiece()).toBe(whiteKing);
      expect(whiteKingSideRookPos.getPiece()).toBeNull();
      expect(whiteKingSideRookDest.getPiece()).toBe(whiteKingSideRook);
      expect(whiteKing.getPosition().rank).toBe(whiteKingDest.rank);
      expect(whiteKing.getPosition().file).toBe(whiteKingDest.file);
      expect(whiteKingSideRook.getPosition().rank).toBe(
        whiteKingSideRookDest.rank,
      );
      expect(whiteKingSideRook.getPosition().file).toBe(
        whiteKingSideRookDest.file,
      );
      expect(board.moveHistory.length).toBe(1);
      const historyEntry = board.moveHistory[0];
      expect(historyEntry.from.rank).toBe(whiteKingPos.rank);
      expect(historyEntry.from.file).toBe(whiteKingPos.file);
      expect(historyEntry.to.rank).toBe(whiteKingDest.rank);
      expect(historyEntry.to.file).toBe(whiteKingDest.file);
      expect(historyEntry.from2.rank).toBe(whiteKingSideRookPos.rank);
      expect(historyEntry.from2.file).toBe(whiteKingSideRookPos.file);
      expect(historyEntry.to2.rank).toBe(whiteKingSideRookDest.rank);
      expect(historyEntry.to2.file).toBe(whiteKingSideRookDest.file);
      expect(historyEntry.type).toBe(KING);
      expect(historyEntry.player).toBe(PLAYER_WHITE);
      expect(historyEntry.captured).toBeNull();
    });

    test('should record move history', () => {
      const wQueenPos1 = board.getSquare(3, 'b');
      const wQueenPos2 = board.getSquare(5, 'b');
      const wQueenPos3 = board.getSquare(5, 'e');
      const wLaserPos1 = board.getSquare(1, 'h');
      const wLaserPos2 = board.getSquare(1, 'g');
      const bPawnPos1 = board.getSquare(7, 'e');
      const bPawnPos2 = board.getSquare(6, 'e');
      const bPawnPos3 = board.getSquare(5, 'e');

      board.setPiece(
        wQueenPos1.rank,
        wQueenPos1.file,
        new Piece(PLAYER_WHITE, QUEEN),
      );
      board.setPiece(
        wLaserPos1.rank,
        wLaserPos1.file,
        new Piece(PLAYER_WHITE, LASER),
      );
      board.setPiece(
        bPawnPos1.rank,
        bPawnPos1.file,
        new Piece(PLAYER_BLACK, PAWN),
      );

      board.applyMove(new Move(wQueenPos1, wQueenPos2));
      board.applyMove(new Move(bPawnPos1, bPawnPos2));
      board.applyMove(new Move(wLaserPos1, wLaserPos2));
      board.applyMove(new Move(bPawnPos2, bPawnPos3));
      // captures black pawn
      board.applyMove(new Move(wQueenPos2, wQueenPos3));

      expect(board.moveHistory.length).toBe(5);
      verifyHistoryEntry(board.moveHistory[0], 3, 2, 5, 2, QUEEN, PLAYER_WHITE);
      verifyHistoryEntry(board.moveHistory[1], 7, 5, 6, 5, PAWN, PLAYER_BLACK);
      verifyHistoryEntry(board.moveHistory[2], 1, 8, 1, 7, LASER, PLAYER_WHITE);
      verifyHistoryEntry(board.moveHistory[3], 6, 5, 5, 5, PAWN, PLAYER_BLACK);
      verifyHistoryEntry(
        board.moveHistory[4],
        5,
        2,
        5,
        5,
        QUEEN,
        PLAYER_WHITE,
        PAWN,
      );
    });

    function verifyHistoryEntry(
      historyEntry,
      fromRank,
      fromFile,
      toRank,
      toFile,
      pieceType,
      player,
      capturedType,
    ) {
      expect(historyEntry.from.rank).toBe(fromRank);
      expect(historyEntry.from.file).toBe(fromFile);
      expect(historyEntry.to.rank).toBe(toRank);
      expect(historyEntry.to.file).toBe(toFile);
      expect(historyEntry.type).toBe(pieceType);
      expect(historyEntry.player).toBe(player);
      if (capturedType) {
        const captured = historyEntry.captured;
        expect(captured).not.toBeNull();
        expect(captured.type).toBe(capturedType);
        expect(captured.getPosition()).toBeNull();
      } else {
        expect(historyEntry.captured).toBeNull();
      }
    }

    test('should know that white king has not moved', () => {
      const piece = new Piece(PLAYER_WHITE, KING);
      const pos = board.getSquare(1, 'e');
      board.setPiece(pos.rank, pos.file, piece);
      expect(board.hasKingMoved(PLAYER_WHITE)).toBe(false);
    });

    test('should know that white king has moved', () => {
      const piece = new Piece(PLAYER_WHITE, KING);
      const pos = board.getSquare(1, 'e');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(2, 'e')));
      expect(board.hasKingMoved(PLAYER_WHITE)).toBe(true);
    });

    test('should know that white king has moved after coming back to home square', () => {
      const piece = new Piece(PLAYER_WHITE, KING);
      const pos = board.getSquare(1, 'e');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(2, 'e')));
      board.applyMove(new Move(board.getSquare(2, 'e'), pos));
      expect(board.hasKingMoved(PLAYER_WHITE)).toBe(true);
    });

    test('should know that black king has not moved', () => {
      const piece = new Piece(PLAYER_BLACK, KING);
      const pos = board.getSquare(ranks, 'e');
      board.setPiece(pos.rank, pos.file, piece);
      expect(board.hasKingMoved(PLAYER_BLACK)).toBe(false);
    });

    test('should know that black king has moved', () => {
      const piece = new Piece(PLAYER_BLACK, KING);
      const pos = board.getSquare(ranks, 'e');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(ranks - 1, 'e')));
      expect(board.hasKingMoved(PLAYER_BLACK)).toBe(true);
    });

    test('should know that black king has moved after coming back to home square', () => {
      const piece = new Piece(PLAYER_BLACK, KING);
      const pos = board.getSquare(ranks, 'e');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(ranks - 1, 'e')));
      board.applyMove(new Move(board.getSquare(ranks - 1, 'e'), pos));
      expect(board.hasKingMoved(PLAYER_BLACK)).toBe(true);
    });

    test('should know that white king side rook has not moved', () => {
      const piece = new Piece(PLAYER_WHITE, ROOK);
      const pos = board.getSquare(1, 'a');
      board.setPiece(pos.rank, pos.file, piece);
      expect(board.hasKingSideRookMoved(PLAYER_WHITE)).toBe(false);
    });

    test('should know that white king side rook has moved', () => {
      const piece = new Piece(PLAYER_WHITE, ROOK);
      const pos = board.getSquare(1, 'a');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(2, 'a')));
      expect(board.hasKingSideRookMoved(PLAYER_WHITE)).toBe(true);
    });

    test('should know that white king side rook has moved after coming back to home square', () => {
      const piece = new Piece(PLAYER_WHITE, ROOK);
      const pos = board.getSquare(1, 'a');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(2, 'a')));
      board.applyMove(new Move(board.getSquare(2, 'a'), pos));
      expect(board.hasKingSideRookMoved(PLAYER_WHITE)).toBe(true);
    });

    test('should know that black king side rook has not moved', () => {
      const piece = new Piece(PLAYER_BLACK, ROOK);
      const pos = board.getSquare(ranks, files);
      board.setPiece(pos.rank, pos.file, piece);
      expect(board.hasKingSideRookMoved(PLAYER_BLACK)).toBe(false);
    });

    test('should know that black king side rook has moved', () => {
      const piece = new Piece(PLAYER_BLACK, ROOK);
      const pos = board.getSquare(ranks, files);
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(ranks - 1, files)));
      expect(board.hasKingSideRookMoved(PLAYER_BLACK)).toBe(true);
    });

    test('should know that black king side rook has moved after coming back to home square', () => {
      const piece = new Piece(PLAYER_BLACK, ROOK);
      const pos = board.getSquare(ranks, files);
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(ranks - 1, files)));
      board.applyMove(new Move(board.getSquare(ranks - 1, files), pos));
      expect(board.hasKingSideRookMoved(PLAYER_BLACK)).toBe(true);
    });

    test('should know that white queen side rook has not moved', () => {
      const piece = new Piece(PLAYER_WHITE, ROOK);
      const pos = board.getSquare(1, files);
      board.setPiece(pos.rank, pos.file, piece);
      expect(board.hasQueenSideRookMoved(PLAYER_WHITE)).toBe(false);
    });

    test('should know that white queen side rook has moved', () => {
      const piece = new Piece(PLAYER_WHITE, ROOK);
      const pos = board.getSquare(1, files);
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(2, files)));
      expect(board.hasQueenSideRookMoved(PLAYER_WHITE)).toBe(true);
    });

    test('should know that white queen side rook has moved after coming back to home square', () => {
      const piece = new Piece(PLAYER_WHITE, ROOK);
      const pos = board.getSquare(1, files);
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(2, files)));
      board.applyMove(new Move(board.getSquare(2, files), pos));
      expect(board.hasQueenSideRookMoved(PLAYER_WHITE)).toBe(true);
    });

    test('should know that black queen side rook has not moved', () => {
      const piece = new Piece(PLAYER_BLACK, ROOK);
      const pos = board.getSquare(ranks, 'a');
      board.setPiece(pos.rank, pos.file, piece);
      expect(board.hasQueenSideRookMoved(PLAYER_BLACK)).toBe(false);
    });

    test('should know that black queen side rook has moved', () => {
      const piece = new Piece(PLAYER_BLACK, ROOK);
      const pos = board.getSquare(ranks, 'a');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(ranks - 1, 'a')));
      expect(board.hasQueenSideRookMoved(PLAYER_BLACK)).toBe(true);
    });

    test('should know that black queen side rook has moved after coming back to home square', () => {
      const piece = new Piece(PLAYER_BLACK, ROOK);
      const pos = board.getSquare(ranks, 'a');
      board.setPiece(pos.rank, pos.file, piece);
      board.applyMove(new Move(pos, board.getSquare(ranks - 1, 'a')));
      board.applyMove(new Move(board.getSquare(ranks - 1, 'a'), pos));
      expect(board.hasQueenSideRookMoved(PLAYER_BLACK)).toBe(true);
    });
  });
});
