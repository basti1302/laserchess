import { WHITE, BLACK } from '../../engine/Color';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../engine/Player';
import {
  PAWN_SHIELD,
  PAWN_90_DEGREES,
  PAWN_THREEWAY,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
  LASER,
} from '../../engine/PieceType';
import { NORTH, EAST, SOUTH, WEST } from '../../engine/Orientation';
import {
  BOTH_KINGS_LOST,
  CHECKMATE,
  IN_PROGRESS,
  KING_LOST,
  KING_SUICIDE,
  STALEMATE,
} from '../../engine/gameStates';
import * as Board from '../../engine/Board';
import { create as createPiece, getPosition } from '../../engine/Piece';
import { create as createMove } from '../../engine/moves/Move';
import { create as createShot } from '../../engine/laser/Shot';
import { create as createSegment } from '../../engine/laser/Segment';
import { START, STRAIGHT, DESTROY } from '../../engine/laser/segmentTypes';

import checkMove from '../../testutil/checkMove';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = Board.create();
  });

  describe('pieces and squares', () => {
    test('checks lower bound for rank', () => {
      expect(Board.getSquare(board, 0, 1)).toBeNull();
    });

    test('checks lower bound for file', () => {
      expect(Board.getSquare(board, 1, 0)).toBeNull();
    });

    test('checks upper bound for rank', () => {
      expect(Board.getSquare(board, 10, 1)).toBeNull();
    });

    test('checks upper bound for file', () => {
      expect(Board.getSquare(board, 1, 10)).toBeNull();
    });

    test('has empty squares and pieces initially', () => {
      for (let rank = 1; rank <= Board.ranks; rank++) {
        for (let file = 1; file <= Board.ranks; file++) {
          const square = Board.getSquare(board, rank, file);
          expect(square.piece).toBeNull();
        }
      }
    });

    test('accepts Board.ranks as lower case letters', () => {
      for (let rank = 1; rank <= Board.ranks; rank++) {
        for (let fileIdx = 1; fileIdx <= Board.ranks; fileIdx++) {
          const file = String.fromCharCode(fileIdx + 96);
          expect(Board.getSquare(board, rank, fileIdx)).toBe(
            Board.getSquare(board, rank, file),
          );
        }
      }
    });

    test('accepts Board.ranks  as upper case letters', () => {
      for (let rank = 1; rank <= Board.ranks; rank++) {
        for (let fileIdx = 1; fileIdx <= Board.ranks; fileIdx++) {
          const file = String.fromCharCode(fileIdx + 64);
          expect(Board.getSquare(board, rank, fileIdx)).toBe(
            Board.getSquare(board, rank, file),
          );
        }
      }
    });

    test('remembers pieces that have been set', () => {
      // set up some dummy pieces
      for (let rank = 1; rank <= Board.ranks; rank++) {
        for (let file = 1; file <= Board.ranks; file++) {
          Board.setPiece(
            board,
            rank,
            file,
            createPiece(PLAYER_WHITE, PAWN_90_DEGREES),
          );
        }
      }

      // read out squares and pieces again
      for (let rank = 1; rank <= Board.ranks; rank++) {
        for (let file = 1; file <= Board.ranks; file++) {
          const square = Board.getSquare(board, rank, file);
          expect(square.id).toBe(`${rank}-${file}`);
          expect(square.rank).toBe(rank);
          expect(square.file).toBe(file);
          const piece = square.piece;
          expect(piece.player).toBe(PLAYER_WHITE);
          expect(piece.player.color).toBe(WHITE);
          expect(piece.player.boardIoLabel).toBe('0');
          expect(piece.type).toBe(PAWN_90_DEGREES);
          const position = getPosition(piece);
          expect(position.rank).toBe(rank);
          expect(position.file).toBe(file);
        }
      }
    });
  });

  describe('initial setup', () => {
    test('should be correct', () => {
      Board.setup(board);

      for (let rank = 1; rank <= 2; rank++) {
        for (let file = 1; file <= Board.ranks; file++) {
          expect(Board.getSquare(board, rank, file).piece.player).toEqual(
            PLAYER_WHITE,
          );
          expect(Board.getSquare(board, rank, file).piece.player.color).toEqual(
            WHITE,
          );
          expect(
            Board.getSquare(board, rank, file).piece.player.boardIoLabel,
          ).toEqual('0');
        }
      }
      for (let rank = Board.ranks - 1; rank <= Board.ranks; rank++) {
        for (let file = 1; file <= Board.ranks; file++) {
          expect(Board.getSquare(board, rank, file).piece.player).toEqual(
            PLAYER_BLACK,
          );
          expect(Board.getSquare(board, rank, file).piece.player.color).toEqual(
            BLACK,
          );
          expect(
            Board.getSquare(board, rank, file).piece.player.boardIoLabel,
          ).toEqual('1');
        }
      }
      for (let file = 1; file <= Board.ranks; file++) {
        expect(Board.getSquare(board, 1, file).piece.orientation).toBe(NORTH);
        expect(
          Board.getSquare(board, Board.ranks, file).piece.orientation,
        ).toBe(SOUTH);
      }

      expect(Board.getSquare(board, 1, 'a').piece.type).toEqual(ROOK);
      expect(Board.getSquare(board, 1, 'b').piece.type).toEqual(KNIGHT);
      expect(Board.getSquare(board, 1, 'c').piece.type).toEqual(BISHOP);
      expect(Board.getSquare(board, 1, 'd').piece.type).toEqual(LASER);
      expect(Board.getSquare(board, 1, 'e').piece.type).toEqual(KING);
      expect(Board.getSquare(board, 1, 'f').piece.type).toEqual(QUEEN);
      expect(Board.getSquare(board, 1, 'g').piece.type).toEqual(BISHOP);
      expect(Board.getSquare(board, 1, 'h').piece.type).toEqual(KNIGHT);
      expect(Board.getSquare(board, 1, 'i').piece.type).toEqual(ROOK);

      expect(Board.getSquare(board, 2, 'a').piece.type).toEqual(PAWN_SHIELD);
      expect(Board.getSquare(board, 2, 'a').piece.orientation).toBe(NORTH);
      expect(Board.getSquare(board, 2, 'b').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(Board.getSquare(board, 2, 'b').piece.orientation).toBe(NORTH);
      expect(Board.getSquare(board, 2, 'c').piece.type).toEqual(PAWN_SHIELD);
      expect(Board.getSquare(board, 2, 'c').piece.orientation).toEqual(NORTH);
      expect(Board.getSquare(board, 2, 'd').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(Board.getSquare(board, 2, 'd').piece.orientation).toEqual(EAST);
      expect(Board.getSquare(board, 2, 'e').piece.type).toEqual(PAWN_THREEWAY);
      expect(Board.getSquare(board, 2, 'e').piece.orientation).toEqual(NORTH);
      expect(Board.getSquare(board, 2, 'f').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(Board.getSquare(board, 2, 'f').piece.orientation).toEqual(SOUTH);
      expect(Board.getSquare(board, 2, 'g').piece.type).toEqual(PAWN_SHIELD);
      expect(Board.getSquare(board, 2, 'g').piece.orientation).toEqual(NORTH);
      expect(Board.getSquare(board, 2, 'h').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(Board.getSquare(board, 2, 'h').piece.orientation).toEqual(WEST);
      expect(Board.getSquare(board, 2, 'i').piece.type).toEqual(PAWN_SHIELD);
      expect(Board.getSquare(board, 2, 'i').piece.orientation).toEqual(NORTH);

      expect(Board.getSquare(board, Board.ranks, 'a').piece.type).toEqual(ROOK);
      expect(Board.getSquare(board, Board.ranks, 'b').piece.type).toEqual(
        KNIGHT,
      );
      expect(Board.getSquare(board, Board.ranks, 'c').piece.type).toEqual(
        BISHOP,
      );
      expect(Board.getSquare(board, Board.ranks, 'd').piece.type).toEqual(
        QUEEN,
      );
      expect(Board.getSquare(board, Board.ranks, 'e').piece.type).toEqual(KING);
      expect(Board.getSquare(board, Board.ranks, 'f').piece.type).toEqual(
        LASER,
      );
      expect(Board.getSquare(board, Board.ranks, 'g').piece.type).toEqual(
        BISHOP,
      );
      expect(Board.getSquare(board, Board.ranks, 'h').piece.type).toEqual(
        KNIGHT,
      );
      expect(Board.getSquare(board, Board.ranks, 'i').piece.type).toEqual(ROOK);

      expect(Board.getSquare(board, Board.ranks - 1, 'a').piece.type).toEqual(
        PAWN_SHIELD,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'a').piece.orientation,
      ).toBe(SOUTH);
      expect(Board.getSquare(board, Board.ranks - 1, 'b').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'b').piece.orientation,
      ).toBe(EAST);
      expect(Board.getSquare(board, Board.ranks - 1, 'c').piece.type).toEqual(
        PAWN_SHIELD,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'c').piece.orientation,
      ).toBe(SOUTH);
      expect(Board.getSquare(board, Board.ranks - 1, 'd').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'd').piece.orientation,
      ).toBe(NORTH);
      expect(Board.getSquare(board, Board.ranks - 1, 'e').piece.type).toEqual(
        PAWN_THREEWAY,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'e').piece.orientation,
      ).toBe(SOUTH);
      expect(Board.getSquare(board, Board.ranks - 1, 'f').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'f').piece.orientation,
      ).toBe(WEST);
      expect(Board.getSquare(board, Board.ranks - 1, 'g').piece.type).toEqual(
        PAWN_SHIELD,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'g').piece.orientation,
      ).toBe(SOUTH);
      expect(Board.getSquare(board, Board.ranks - 1, 'h').piece.type).toEqual(
        PAWN_90_DEGREES,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'h').piece.orientation,
      ).toBe(SOUTH);
      expect(Board.getSquare(board, Board.ranks - 1, 'i').piece.type).toEqual(
        PAWN_SHIELD,
      );
      expect(
        Board.getSquare(board, Board.ranks - 1, 'i').piece.orientation,
      ).toBe(SOUTH);

      // verify empty squares from Board.ranks 3 to rank 7
      for (let rank = 3; rank <= Board.ranks - 2; rank++) {
        for (let file = 1; file <= Board.ranks; file++) {
          const square = Board.getSquare(board, rank, file);
          expect(square.piece).toBeNull();
        }
      }
    });
  });

  describe('all moves', () => {
    test('find all moves ignoring check for white', () => {
      const queenFrom = Board.getSquare(board, 3, 'b');
      Board.setPiece(board, 3, 'b', createPiece(PLAYER_WHITE, QUEEN));
      const laserFrom = Board.getSquare(board, 5, 'a');
      Board.setPiece(board, 5, 'a', createPiece(PLAYER_WHITE, LASER));
      const rookFrom = Board.getSquare(board, 6, 'e');
      Board.setPiece(board, 6, 'e', createPiece(PLAYER_WHITE, ROOK));

      Board.setPiece(board, 7, 'e', createPiece(PLAYER_BLACK, PAWN_90_DEGREES));
      Board.setPiece(board, 6, 'c', createPiece(PLAYER_BLACK, PAWN_90_DEGREES));

      const moves = Board.allMovesIgnoringCheck(board, PLAYER_WHITE);

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
      const queenFrom = Board.getSquare(board, 3, 'b');
      Board.setPiece(board, 3, 'b', createPiece(PLAYER_WHITE, QUEEN));
      const laserFrom = Board.getSquare(board, 5, 'a');
      Board.setPiece(board, 5, 'a', createPiece(PLAYER_WHITE, LASER));
      const rookFrom = Board.getSquare(board, 6, 'e');
      Board.setPiece(board, 6, 'e', createPiece(PLAYER_WHITE, ROOK));

      Board.setPiece(board, 7, 'e', createPiece(PLAYER_BLACK, PAWN_90_DEGREES));
      Board.setPiece(board, 6, 'c', createPiece(PLAYER_BLACK, PAWN_90_DEGREES));

      const expectedAttackedSquares = [
        // queen (3-b) moving north
        Board.getSquare(board, 4, 'b'),
        Board.getSquare(board, 5, 'b'),
        Board.getSquare(board, 6, 'b'),
        Board.getSquare(board, 7, 'b'),
        Board.getSquare(board, 8, 'b'),
        Board.getSquare(board, 9, 'b'),
        // queen (3-b) moving north-east until blocked by laser
        Board.getSquare(board, 4, 'c'),
        Board.getSquare(board, 5, 'd'),
        // queen (3-b) moving east
        Board.getSquare(board, 3, 'c'),
        Board.getSquare(board, 3, 'd'),
        Board.getSquare(board, 3, 'e'),
        Board.getSquare(board, 3, 'f'),
        Board.getSquare(board, 3, 'g'),
        Board.getSquare(board, 3, 'h'),
        Board.getSquare(board, 3, 'i'),
        // queen (3-b) moving south-east
        Board.getSquare(board, 2, 'c'),
        Board.getSquare(board, 1, 'd'),
        // queen (3-b) moving south
        Board.getSquare(board, 2, 'b'),
        Board.getSquare(board, 1, 'b'),
        // queen (3-b) moving south-west
        Board.getSquare(board, 2, 'a'),
        // queen (3-b) moving west
        Board.getSquare(board, 3, 'a'),
        // queen (3-b) moving north-west
        Board.getSquare(board, 4, 'a'),

        // laser (5-a)
        Board.getSquare(board, 6, 'a'),
        Board.getSquare(board, 6, 'b'),
        Board.getSquare(board, 5, 'b'),
        Board.getSquare(board, 4, 'b'),
        Board.getSquare(board, 4, 'a'),

        // rook (6-e) moving north until capturing enemy pawn on 7-e
        Board.getSquare(board, 7, 'e'),
        // rook (6-e) moving east
        Board.getSquare(board, 6, 'f'),
        Board.getSquare(board, 6, 'g'),
        Board.getSquare(board, 6, 'h'),
        Board.getSquare(board, 6, 'i'),
        // rook (6-e) moving south
        Board.getSquare(board, 5, 'e'),
        Board.getSquare(board, 4, 'e'),
        Board.getSquare(board, 3, 'e'),
        Board.getSquare(board, 2, 'e'),
        Board.getSquare(board, 1, 'e'),
        // rook (6-e) moving west until capturing enemy pawn 6-c
        Board.getSquare(board, 6, 'd'),
        Board.getSquare(board, 6, 'c'),
      ];

      // verify all attacked fields
      expectedAttackedSquares.forEach(attackedSquare =>
        expect(Board.isAttackedBy(board, attackedSquare, PLAYER_WHITE)).toBe(
          true,
        ),
      );

      // verify all non-attacked fields
      Board.forEachSquare(board, s => {
        if (!expectedAttackedSquares.includes(s)) {
          expect(Board.isAttackedBy(board, s, PLAYER_WHITE)).toBe(false);
        }
      });
    });
  });

  describe('apply moves', () => {
    test('should move the piece', () => {
      const pawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES);
      const pawnPos1 = Board.getSquare(board, 2, 'a');
      const pawnPos2 = Board.getSquare(board, 4, 'a');
      Board.setPiece(board, pawnPos1.rank, pawnPos1.file, pawn);

      Board.applyMove(board, createMove(pawnPos1, pawnPos2));

      expect(pawnPos1.piece).toBeNull();
      expect(pawnPos2.piece).toBe(pawn);
      expect(getPosition(pawn).rank).toBe(pawnPos2.rank);
      expect(getPosition(pawn).file).toBe(pawnPos2.file);
    });

    test('should record that a piece has moved', () => {
      const pawn1 = createPiece(PLAYER_WHITE, PAWN_90_DEGREES);
      const pawn1Pos = Board.getSquare(board, 2, 'a');
      const pawn2 = createPiece(PLAYER_WHITE, PAWN_90_DEGREES);
      const pawn2Pos = Board.getSquare(board, 2, 'b');
      Board.setPiece(board, pawn1Pos.rank, pawn1Pos.file, pawn1);
      Board.setPiece(board, pawn2Pos.rank, pawn2Pos.file, pawn2);

      Board.applyMove(
        board,
        createMove(pawn1Pos, Board.getSquare(board, 3, 'a')),
      );

      expect(pawn1.hasMoved).toBe(true);
      expect(pawn2.hasMoved).toBe(false);
    });

    test('should capture a piece', () => {
      const whiteRook = createPiece(PLAYER_WHITE, ROOK);
      const blackKnight = createPiece(PLAYER_BLACK, KNIGHT);
      const whiteRookPos = Board.getSquare(board, 1, 'a');
      const blackKnightPos = Board.getSquare(board, 5, 'a');
      Board.setPiece(board, whiteRookPos.rank, whiteRookPos.file, whiteRook);
      Board.setPiece(
        board,
        blackKnightPos.rank,
        blackKnightPos.file,
        blackKnight,
      );

      Board.applyMove(board, createMove(whiteRookPos, blackKnightPos));

      expect(whiteRookPos.piece).toBeNull();
      expect(blackKnightPos.piece).toBe(whiteRook);
      expect(getPosition(whiteRook).rank).toBe(blackKnightPos.rank);
      expect(getPosition(whiteRook).file).toBe(blackKnightPos.file);
      expect(getPosition(blackKnight)).toBe(null);
    });

    test('should capture en passant', () => {
      const whitePawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES);
      const whitePawnPos1 = Board.getSquare(board, 2, 'e');
      const whitePawnPos2 = Board.getSquare(board, 4, 'e');
      const blackPawn = createPiece(PLAYER_BLACK, PAWN_90_DEGREES);
      const blackPawnPos1 = Board.getSquare(board, 4, 'f');
      const blackPawnPos2 = Board.getSquare(board, 3, 'e');
      Board.setPiece(board, whitePawnPos1.rank, whitePawnPos1.file, whitePawn);
      Board.setPiece(board, blackPawnPos1.rank, blackPawnPos1.file, blackPawn);

      Board.applyMove(board, createMove(whitePawnPos1, whitePawnPos2));
      Board.applyMove(
        board,
        createMove(
          blackPawnPos1,
          blackPawnPos2,
          null,
          null,
          null,
          whitePawnPos2,
        ),
      );

      expect(blackPawnPos1.piece).toBeNull();
      expect(blackPawnPos2.piece).toBe(blackPawn);
      expect(whitePawnPos1.piece).toBeNull();
      expect(whitePawnPos2.piece).toBeNull();
      expect(getPosition(blackPawn).rank).toBe(blackPawnPos2.rank);
      expect(getPosition(blackPawn).file).toBe(blackPawnPos2.file);
      expect(getPosition(whitePawn)).toBe(null);
    });

    test('should apply a castling', () => {
      const whiteKing = createPiece(PLAYER_WHITE, KING);
      const whiteKingPos = Board.getSquare(board, 1, 'e');
      const whiteKingDest = Board.getSquare(board, 1, 'c');
      const whiteKingSideRook = createPiece(PLAYER_WHITE, ROOK);
      const whiteKingSideRookPos = Board.getSquare(board, 1, 'a');
      const whiteKingSideRookDest = Board.getSquare(board, 1, 'd');
      Board.setPiece(board, whiteKingPos.rank, whiteKingPos.file, whiteKing);
      Board.setPiece(
        board,
        whiteKingSideRookPos.rank,
        whiteKingSideRookPos.file,
        whiteKingSideRook,
      );

      Board.applyMove(
        board,
        createMove(
          whiteKingPos,
          whiteKingDest,
          whiteKingSideRookPos,
          whiteKingSideRookDest,
        ),
      );

      expect(whiteKingPos.piece).toBeNull();
      expect(whiteKingDest.piece).toBe(whiteKing);
      expect(whiteKingSideRookPos.piece).toBeNull();
      expect(whiteKingSideRookDest.piece).toBe(whiteKingSideRook);
      expect(getPosition(whiteKing).rank).toBe(whiteKingDest.rank);
      expect(getPosition(whiteKing).file).toBe(whiteKingDest.file);
      expect(getPosition(whiteKingSideRook).rank).toBe(
        whiteKingSideRookDest.rank,
      );
      expect(getPosition(whiteKingSideRook).file).toBe(
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

    test('should apply a promotion', () => {
      const pawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES);
      const pawnPos1 = Board.getSquare(board, Board.ranks - 1, 'e');
      const pawnPos2 = Board.getSquare(board, Board.ranks, 'e');
      Board.setPiece(board, pawnPos1.rank, pawnPos1.file, pawn);

      Board.applyPromotionMove(
        board,
        createMove(pawnPos1, pawnPos2, null, null, QUEEN),
      );

      expect(pawnPos1.piece).toBeNull();
      expect(pawnPos2.piece).toBeDefined();
      expect(pawnPos2.piece).not.toBe(pawn);
      expect(pawnPos2.piece.type).toBe(QUEEN);
      expect(getPosition(pawnPos2.piece).rank).toBe(pawnPos2.rank);
      expect(getPosition(pawnPos2.piece).file).toBe(pawnPos2.file);
      expect(getPosition(pawn)).toBe(null);

      expect(board.moveHistory.length).toBe(1);
      const historyEntry = board.moveHistory[0];
      expect(historyEntry.from.rank).toBe(pawnPos1.rank);
      expect(historyEntry.from.file).toBe(pawnPos1.file);
      expect(historyEntry.to.rank).toBe(pawnPos2.rank);
      expect(historyEntry.to.file).toBe(pawnPos2.file);
      expect(historyEntry.from2).toBeUndefined();
      expect(historyEntry.to2).toBeUndefined();
      expect(historyEntry.type).toBe(PAWN_90_DEGREES);
      expect(historyEntry.promotionTo).toBe(QUEEN);
      expect(historyEntry.player).toBe(PLAYER_WHITE);
      expect(historyEntry.captured).toBeNull();
    });

    test('should record move history', () => {
      const wQueenPos1 = Board.getSquare(board, 3, 'b');
      const wQueenPos2 = Board.getSquare(board, 5, 'b');
      const wQueenPos3 = Board.getSquare(board, 5, 'e');
      const wLaserPos1 = Board.getSquare(board, 1, 'h');
      const wLaserPos2 = Board.getSquare(board, 1, 'g');
      const bPawnPos1 = Board.getSquare(board, 7, 'e');
      const bPawnPos2 = Board.getSquare(board, 6, 'e');
      const bPawnPos3 = Board.getSquare(board, 5, 'e');

      Board.setPiece(
        board,
        wQueenPos1.rank,
        wQueenPos1.file,
        createPiece(PLAYER_WHITE, QUEEN),
      );
      Board.setPiece(
        board,
        wLaserPos1.rank,
        wLaserPos1.file,
        createPiece(PLAYER_WHITE, LASER),
      );
      Board.setPiece(
        board,
        bPawnPos1.rank,
        bPawnPos1.file,
        createPiece(PLAYER_BLACK, PAWN_90_DEGREES),
      );

      Board.applyMove(board, createMove(wQueenPos1, wQueenPos2));
      Board.applyMove(board, createMove(bPawnPos1, bPawnPos2));
      Board.applyMove(board, createMove(wLaserPos1, wLaserPos2));
      Board.applyMove(board, createMove(bPawnPos2, bPawnPos3));
      // captures black pawn
      Board.applyMove(board, createMove(wQueenPos2, wQueenPos3));

      expect(board.moveHistory.length).toBe(5);
      verifyHistoryEntry(board.moveHistory[0], 3, 2, 5, 2, QUEEN, PLAYER_WHITE);
      verifyHistoryEntry(
        board.moveHistory[1],
        7,
        5,
        6,
        5,
        PAWN_90_DEGREES,
        PLAYER_BLACK,
      );
      verifyHistoryEntry(board.moveHistory[2], 1, 8, 1, 7, LASER, PLAYER_WHITE);
      verifyHistoryEntry(
        board.moveHistory[3],
        6,
        5,
        5,
        5,
        PAWN_90_DEGREES,
        PLAYER_BLACK,
      );
      verifyHistoryEntry(
        board.moveHistory[4],
        5,
        2,
        5,
        5,
        QUEEN,
        PLAYER_WHITE,
        PAWN_90_DEGREES,
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
        expect(getPosition(captured)).toBeNull();
      } else {
        expect(historyEntry.captured).toBeNull();
      }
    }

    test('should know that white king has not moved', () => {
      const piece = createPiece(PLAYER_WHITE, KING);
      const pos = Board.getSquare(board, 1, 'e');
      Board.setPiece(board, pos.rank, pos.file, piece);
      expect(Board.hasKingMoved(board, PLAYER_WHITE)).toBe(false);
    });

    test('should know that white king has moved', () => {
      const piece = createPiece(PLAYER_WHITE, KING);
      const pos = Board.getSquare(board, 1, 'e');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(board, createMove(pos, Board.getSquare(board, 2, 'e')));
      expect(Board.hasKingMoved(board, PLAYER_WHITE)).toBe(true);
    });

    test('should know that white king has moved after coming back to home square', () => {
      const piece = createPiece(PLAYER_WHITE, KING);
      const pos = Board.getSquare(board, 1, 'e');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(board, createMove(pos, Board.getSquare(board, 2, 'e')));
      Board.applyMove(board, createMove(Board.getSquare(board, 2, 'e'), pos));
      expect(Board.hasKingMoved(board, PLAYER_WHITE)).toBe(true);
    });

    test('should know that black king has not moved', () => {
      const piece = createPiece(PLAYER_BLACK, KING);
      const pos = Board.getSquare(board, Board.ranks, 'e');
      Board.setPiece(board, pos.rank, pos.file, piece);
      expect(Board.hasKingMoved(board, PLAYER_BLACK)).toBe(false);
    });

    test('should know that black king has moved', () => {
      const piece = createPiece(PLAYER_BLACK, KING);
      const pos = Board.getSquare(board, Board.ranks, 'e');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, Board.ranks - 1, 'e')),
      );
      expect(Board.hasKingMoved(board, PLAYER_BLACK)).toBe(true);
    });

    test('should know that black king has moved after coming back to home square', () => {
      const piece = createPiece(PLAYER_BLACK, KING);
      const pos = Board.getSquare(board, Board.ranks, 'e');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, Board.ranks - 1, 'e')),
      );
      Board.applyMove(
        board,
        createMove(Board.getSquare(board, Board.ranks - 1, 'e'), pos),
      );
      expect(Board.hasKingMoved(board, PLAYER_BLACK)).toBe(true);
    });

    test('should know that white king side rook has not moved', () => {
      const piece = createPiece(PLAYER_WHITE, ROOK);
      const pos = Board.getSquare(board, 1, 'a');
      Board.setPiece(board, pos.rank, pos.file, piece);
      expect(Board.hasKingSideRookMoved(board, PLAYER_WHITE)).toBe(false);
    });

    test('should know that white king side rook has moved', () => {
      const piece = createPiece(PLAYER_WHITE, ROOK);
      const pos = Board.getSquare(board, 1, 'a');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(board, createMove(pos, Board.getSquare(board, 2, 'a')));
      expect(Board.hasKingSideRookMoved(board, PLAYER_WHITE)).toBe(true);
    });

    test('should know that white king side rook has moved after coming back to home square', () => {
      const piece = createPiece(PLAYER_WHITE, ROOK);
      const pos = Board.getSquare(board, 1, 'a');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(board, createMove(pos, Board.getSquare(board, 2, 'a')));
      Board.applyMove(board, createMove(Board.getSquare(board, 2, 'a'), pos));
      expect(Board.hasKingSideRookMoved(board, PLAYER_WHITE)).toBe(true);
    });

    test('should know that black king side rook has not moved', () => {
      const piece = createPiece(PLAYER_BLACK, ROOK);
      const pos = Board.getSquare(board, Board.ranks, Board.ranks);
      Board.setPiece(board, pos.rank, pos.file, piece);
      expect(Board.hasKingSideRookMoved(board, PLAYER_BLACK)).toBe(false);
    });

    test('should know that black king side rook has moved', () => {
      const piece = createPiece(PLAYER_BLACK, ROOK);
      const pos = Board.getSquare(board, Board.ranks, Board.ranks);
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, Board.ranks - 1, Board.ranks)),
      );
      expect(Board.hasKingSideRookMoved(board, PLAYER_BLACK)).toBe(true);
    });

    test('should know that black king side rook has moved after coming back to home square', () => {
      const piece = createPiece(PLAYER_BLACK, ROOK);
      const pos = Board.getSquare(board, Board.ranks, Board.ranks);
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, Board.ranks - 1, Board.ranks)),
      );
      Board.applyMove(
        board,
        createMove(Board.getSquare(board, Board.ranks - 1, Board.ranks), pos),
      );
      expect(Board.hasKingSideRookMoved(board, PLAYER_BLACK)).toBe(true);
    });

    test('should know that white queen side rook has not moved', () => {
      const piece = createPiece(PLAYER_WHITE, ROOK);
      const pos = Board.getSquare(board, 1, Board.ranks);
      Board.setPiece(board, pos.rank, pos.file, piece);
      expect(Board.hasQueenSideRookMoved(board, PLAYER_WHITE)).toBe(false);
    });

    test('should know that white queen side rook has moved', () => {
      const piece = createPiece(PLAYER_WHITE, ROOK);
      const pos = Board.getSquare(board, 1, Board.ranks);
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, 2, Board.ranks)),
      );
      expect(Board.hasQueenSideRookMoved(board, PLAYER_WHITE)).toBe(true);
    });

    test('should know that white queen side rook has moved after coming back to home square', () => {
      const piece = createPiece(PLAYER_WHITE, ROOK);
      const pos = Board.getSquare(board, 1, Board.ranks);
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, 2, Board.ranks)),
      );
      Board.applyMove(
        board,
        createMove(Board.getSquare(board, 2, Board.ranks), pos),
      );
      expect(Board.hasQueenSideRookMoved(board, PLAYER_WHITE)).toBe(true);
    });

    test('should know that black queen side rook has not moved', () => {
      const piece = createPiece(PLAYER_BLACK, ROOK);
      const pos = Board.getSquare(board, Board.ranks, 'a');
      Board.setPiece(board, pos.rank, pos.file, piece);
      expect(Board.hasQueenSideRookMoved(board, PLAYER_BLACK)).toBe(false);
    });

    test('should know that black queen side rook has moved', () => {
      const piece = createPiece(PLAYER_BLACK, ROOK);
      const pos = Board.getSquare(board, Board.ranks, 'a');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, Board.ranks - 1, 'a')),
      );
      expect(Board.hasQueenSideRookMoved(board, PLAYER_BLACK)).toBe(true);
    });

    test('should know that black queen side rook has moved after coming back to home square', () => {
      const piece = createPiece(PLAYER_BLACK, ROOK);
      const pos = Board.getSquare(board, Board.ranks, 'a');
      Board.setPiece(board, pos.rank, pos.file, piece);
      Board.applyMove(
        board,
        createMove(pos, Board.getSquare(board, Board.ranks - 1, 'a')),
      );
      Board.applyMove(
        board,
        createMove(Board.getSquare(board, Board.ranks - 1, 'a'), pos),
      );
      expect(Board.hasQueenSideRookMoved(board, PLAYER_BLACK)).toBe(true);
    });

    test('should apply a shot that hits nothing', () => {
      const laserPos = Board.getSquare(board, Board.ranks - 2, 'c');
      const laser = createPiece(PLAYER_WHITE, LASER, NORTH);
      Board.setPiece(board, laserPos.rank, laserPos.file, laser);
      const shot = createShot([
        createSegment(laserPos, NORTH, START),
        createSegment(
          Board.getSquare(board, Board.ranks - 1, 'c'),
          NORTH,
          STRAIGHT,
        ),
        createSegment(
          Board.getSquare(board, Board.ranks, 'c'),
          NORTH,
          STRAIGHT,
        ),
      ]);

      Board.applyShot(board, shot);

      // verify the laser has not moved
      expect(laserPos.piece).toBe(laser);
      expect(getPosition(laser).rank).toBe(laserPos.rank);
      expect(getPosition(laser).file).toBe(laserPos.file);
      expect(board.moveHistory.length).toBe(1);
      const historyEntry = board.moveHistory[0];
      expect(historyEntry.from.rank).toBe(laserPos.rank);
      expect(historyEntry.from.file).toBe(laserPos.file);
      expect(historyEntry.to).toBeUndefined();
      expect(historyEntry.from2).toBeUndefined();
      expect(historyEntry.to2).toBeUndefined();
      expect(historyEntry.type).toBe(LASER);
      expect(historyEntry.player).toBe(PLAYER_WHITE);
      expect(historyEntry.shot.targets.length).toBe(0);
    });

    test('should destroy friendly piece when applying a shot', () => {
      const laserPos = Board.getSquare(board, 3, 'c');
      const laser = createPiece(PLAYER_WHITE, LASER, NORTH);
      Board.setPiece(board, laserPos.rank, laserPos.file, laser);
      const pawnPos = Board.getSquare(board, 5, 'c');
      const pawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH);
      Board.setPiece(board, pawnPos.rank, pawnPos.file, pawn);
      const shot = createShot(
        [
          createSegment(laserPos, NORTH, START),
          createSegment(Board.getSquare(board, 6, 'c'), NORTH, START),
          createSegment(pawnPos, NORTH, DESTROY),
        ],
        [pawnPos],
      );

      Board.applyShot(board, shot);

      expect(pawnPos.piece).toBeNull();
      expect(getPosition(pawn)).toBe(null);
      // verify the laser has not moved
      expect(laserPos.piece).toBe(laser);
      expect(getPosition(laser).rank).toBe(laserPos.rank);
      expect(getPosition(laser).file).toBe(laserPos.file);
      expect(board.moveHistory.length).toBe(1);
      const historyEntry = board.moveHistory[0];
      expect(historyEntry.from.rank).toBe(laserPos.rank);
      expect(historyEntry.from.file).toBe(laserPos.file);
      expect(historyEntry.to).toBeUndefined();
      expect(historyEntry.from2).toBeUndefined();
      expect(historyEntry.to2).toBeUndefined();
      expect(historyEntry.type).toBe(LASER);
      expect(historyEntry.player).toBe(PLAYER_WHITE);
      expect(historyEntry.shot.targets.length).toBe(1);
      expect(historyEntry.shot.targets[0].square.rank).toBe(pawnPos.rank);
      expect(historyEntry.shot.targets[0].square.file).toBe(pawnPos.file);
      expect(historyEntry.shot.targets[0].player).toBe(PLAYER_WHITE);
      expect(historyEntry.shot.targets[0].type).toBe(PAWN_90_DEGREES);
    });

    test('should destroy enemy piece when applying a shot', () => {
      const laserPos = Board.getSquare(board, 5, 'c');
      const laser = createPiece(PLAYER_WHITE, LASER, EAST);
      Board.setPiece(board, laserPos.rank, laserPos.file, laser);
      const pawnPos = Board.getSquare(board, 5, 'e');
      const pawn = createPiece(PLAYER_BLACK, PAWN_90_DEGREES, EAST);
      Board.setPiece(board, pawnPos.rank, pawnPos.file, pawn);
      const shot = createShot(
        [
          createSegment(laserPos, EAST, START),
          createSegment(Board.getSquare(board, 5, 'd'), EAST, START),
          createSegment(pawnPos, EAST, DESTROY),
        ],
        [pawnPos],
      );

      Board.applyShot(board, shot);

      expect(pawnPos.piece).toBeNull();
      expect(getPosition(pawn)).toBe(null);
      // verify the laser has not moved
      expect(laserPos.piece).toBe(laser);
      expect(getPosition(laser).rank).toBe(laserPos.rank);
      expect(getPosition(laser).file).toBe(laserPos.file);
      expect(board.moveHistory.length).toBe(1);
      const historyEntry = board.moveHistory[0];
      expect(historyEntry.from.rank).toBe(laserPos.rank);
      expect(historyEntry.from.file).toBe(laserPos.file);
      expect(historyEntry.to).toBeUndefined();
      expect(historyEntry.from2).toBeUndefined();
      expect(historyEntry.to2).toBeUndefined();
      expect(historyEntry.type).toBe(LASER);
      expect(historyEntry.player).toBe(PLAYER_WHITE);
      expect(historyEntry.shot.targets.length).toBe(1);
      expect(historyEntry.shot.targets[0].square.rank).toBe(pawnPos.rank);
      expect(historyEntry.shot.targets[0].square.file).toBe(pawnPos.file);
      expect(historyEntry.shot.targets[0].player).toBe(PLAYER_BLACK);
      expect(historyEntry.shot.targets[0].type).toBe(PAWN_90_DEGREES);
    });
  });

  describe('clone and simulate', () => {
    beforeEach(() => {
      Board.setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, ROOK));
      Board.setPiece(board, 1, 'b', createPiece(PLAYER_WHITE, KNIGHT));
      Board.setPiece(board, 1, 'c', createPiece(PLAYER_WHITE, BISHOP));
      Board.setPiece(board, 2, 'a', createPiece(PLAYER_WHITE, PAWN_90_DEGREES));
      Board.setPiece(board, 2, 'b', createPiece(PLAYER_WHITE, PAWN_90_DEGREES));
      Board.setPiece(board, 2, 'c', createPiece(PLAYER_WHITE, PAWN_90_DEGREES));

      Board.setPiece(board, Board.ranks, 'a', createPiece(PLAYER_BLACK, ROOK));
      Board.setPiece(
        board,
        Board.ranks,
        'b',
        createPiece(PLAYER_BLACK, KNIGHT),
      );
      Board.setPiece(
        board,
        Board.ranks,
        'c',
        createPiece(PLAYER_BLACK, BISHOP),
      );
      Board.setPiece(
        board,
        Board.ranks - 1,
        'a',
        createPiece(PLAYER_BLACK, PAWN_90_DEGREES),
      );
      Board.setPiece(
        board,
        Board.ranks - 1,
        'b',
        createPiece(PLAYER_BLACK, PAWN_90_DEGREES),
      );
      Board.setPiece(
        board,
        Board.ranks - 1,
        'c',
        createPiece(PLAYER_BLACK, PAWN_90_DEGREES),
      );
    });

    test('should clone the board including squares and pieces', () => {
      const clonedBoard = Board.clone(board);
      checkBoard(clonedBoard);
    });

    test('modification of clone the board should not modify the original', () => {
      const clonedBoard = Board.clone(board);
      checkBoard(board);
      checkBoard(clonedBoard);
    });

    test('modification of cloned board should not modify the original', () => {
      const clonedBoard = Board.clone(board);
      Board.applyMove(
        clonedBoard,
        createMove(
          Board.getSquare(clonedBoard, 1, 'b'),
          Board.getSquare(clonedBoard, 3, 'c'),
        ),
      );
      Board.applyMove(
        clonedBoard,
        createMove(
          Board.getSquare(clonedBoard, Board.ranks, 'c'),
          Board.getSquare(clonedBoard, Board.ranks - 3, 'f'),
        ),
      );
      Board.applyMove(
        clonedBoard,
        createMove(
          Board.getSquare(clonedBoard, 2, 'a'),
          Board.getSquare(clonedBoard, 3, 'a'),
        ),
      );
      Board.applyMove(
        clonedBoard,
        createMove(
          Board.getSquare(clonedBoard, Board.ranks - 1, 'b'),
          Board.getSquare(clonedBoard, Board.ranks - 3, 'b'),
        ),
      );

      // verify that the original is not modified by the moves
      checkBoard(board);

      // verify that the moves have been applied on the clone
      expect(Board.getPiece(clonedBoard, 1, 'b')).toBeNull();
      checkPiece(clonedBoard, 3, 'c', PLAYER_WHITE, KNIGHT);
      expect(Board.getPiece(clonedBoard, Board.ranks, 'c')).toBeNull();
      checkPiece(clonedBoard, Board.ranks - 3, 'f', PLAYER_BLACK, BISHOP);
      expect(Board.getPiece(clonedBoard, 2, 'a')).toBeNull();
      checkPiece(clonedBoard, 3, 'a', PLAYER_WHITE, PAWN_90_DEGREES);
      expect(Board.getPiece(clonedBoard, Board.ranks - 1, 'b')).toBeNull();
      checkPiece(
        clonedBoard,
        Board.ranks - 3,
        'b',
        PLAYER_BLACK,
        PAWN_90_DEGREES,
      );
    });

    test('simulating a move should not modify the original', () => {
      const simulationResult = Board.simulateMove(
        board,
        createMove(
          Board.getSquare(board, 1, 'b'),
          Board.getSquare(board, 3, 'c'),
        ),
      );

      // verify that the original is not modified by the moves
      checkBoard(board);

      // verify that the moves have been applied on the clone
      expect(Board.getPiece(simulationResult, 1, 'b')).toBeNull();
      checkPiece(simulationResult, 3, 'c', PLAYER_WHITE, KNIGHT);
    });

    function checkBoard(theBoard) {
      checkPiece(theBoard, 1, 'a', PLAYER_WHITE, ROOK);
      checkPiece(theBoard, 1, 'b', PLAYER_WHITE, KNIGHT);
      checkPiece(theBoard, 1, 'c', PLAYER_WHITE, BISHOP);
      checkPiece(theBoard, 2, 'a', PLAYER_WHITE, PAWN_90_DEGREES);
      checkPiece(theBoard, 2, 'b', PLAYER_WHITE, PAWN_90_DEGREES);
      checkPiece(theBoard, 2, 'c', PLAYER_WHITE, PAWN_90_DEGREES);
      checkPiece(theBoard, Board.ranks, 'a', PLAYER_BLACK, ROOK);
      checkPiece(theBoard, Board.ranks, 'b', PLAYER_BLACK, KNIGHT);
      checkPiece(theBoard, Board.ranks, 'c', PLAYER_BLACK, BISHOP);
      checkPiece(theBoard, Board.ranks - 1, 'a', PLAYER_BLACK, PAWN_90_DEGREES);
      checkPiece(theBoard, Board.ranks - 1, 'b', PLAYER_BLACK, PAWN_90_DEGREES);
      checkPiece(theBoard, Board.ranks - 1, 'c', PLAYER_BLACK, PAWN_90_DEGREES);
    }

    function checkPiece(theBoard, rank, file, player, type) {
      expect(Board.getPiece(theBoard, rank, file).player).toBe(player);
      expect(Board.getPiece(theBoard, rank, file).type).toBe(type);
    }
  });

  describe('prune moves leading to check', () => {
    test('should prune moves', () => {
      const kingsHome = Board.getSquare(board, Board.ranks, 'e');
      Board.setPiece(
        board,
        kingsHome.rank,
        kingsHome.file,
        createPiece(PLAYER_BLACK, KING),
      );
      const pawn1Home = Board.getSquare(board, Board.ranks - 1, 'a');
      Board.setPiece(
        board,
        pawn1Home.rank,
        pawn1Home.file,
        createPiece(PLAYER_BLACK, PAWN_90_DEGREES),
      );
      const pawn2Home = Board.getSquare(board, Board.ranks - 1, 'f');
      Board.setPiece(
        board,
        pawn2Home.rank,
        pawn2Home.file,
        createPiece(PLAYER_BLACK, PAWN_90_DEGREES),
      );

      Board.setPiece(
        board,
        Board.ranks - 4,
        'i',
        createPiece(PLAYER_WHITE, QUEEN),
      );
      Board.setPiece(
        board,
        Board.ranks - 4,
        'd',
        createPiece(PLAYER_WHITE, ROOK),
      );

      const moves = [
        // okay
        createMove(kingsHome, Board.getSquare(board, Board.ranks, 'f')),
        // check by rook
        createMove(kingsHome, Board.getSquare(board, Board.ranks - 1, 'd')),
        // okay
        createMove(kingsHome, Board.getSquare(board, Board.ranks - 1, 'e')),
        // check by rook
        createMove(kingsHome, Board.getSquare(board, Board.ranks, 'd')),
        // okay
        createMove(pawn1Home, Board.getSquare(board, Board.ranks - 2, 'a')),
        // check by queen
        createMove(pawn2Home, Board.getSquare(board, Board.ranks - 2, 'f')),
        // check by queen
        createMove(pawn2Home, Board.getSquare(board, Board.ranks - 3, 'f')),
        // okay
        createMove(pawn1Home, Board.getSquare(board, Board.ranks - 3, 'a')),
      ];

      Board.pruneMovesThatLeadToCheckFor(board, moves, PLAYER_BLACK);

      expect(moves.length).toBe(4);
      checkMove(moves[0], kingsHome, Board.ranks, 'f');
      checkMove(moves[1], kingsHome, Board.ranks - 1, 'e');
      checkMove(moves[2], pawn1Home, Board.ranks - 2, 'a');
      checkMove(moves[3], pawn1Home, Board.ranks - 3, 'a');
    });
  });

  describe('compute game state', () => {
    it('king lost', () => {
      Board.setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
      const gameState = Board.computeGameState(board, PLAYER_BLACK);
      expect(gameState).toBe(KING_LOST);
    });

    it('enemy king lost', () => {
      Board.setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
      const gameState = Board.computeGameState(board, PLAYER_WHITE);
      expect(gameState).toBe(KING_SUICIDE);
    });

    it('both kings lost', () => {
      Board.setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, LASER));
      Board.setPiece(board, 2, 'a', createPiece(PLAYER_BLACK, LASER));
      const gameState = Board.computeGameState(board, PLAYER_WHITE);
      expect(gameState).toBe(BOTH_KINGS_LOST);
    });

    it('checkmate', () => {
      Board.setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
      Board.setPiece(
        board,
        Board.ranks,
        Board.ranks,
        createPiece(PLAYER_BLACK, KING),
      );
      Board.setPiece(board, 2, 'b', createPiece(PLAYER_BLACK, QUEEN));
      Board.setPiece(board, 3, 'c', createPiece(PLAYER_BLACK, BISHOP));

      const gameState = Board.computeGameState(board, PLAYER_WHITE);

      expect(gameState).toBe(CHECKMATE);
    });

    it('stalemate', () => {
      Board.setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
      Board.setPiece(
        board,
        Board.ranks,
        Board.ranks,
        createPiece(PLAYER_BLACK, KING),
      );
      Board.setPiece(board, Board.ranks, 'b', createPiece(PLAYER_BLACK, ROOK));
      Board.setPiece(board, 2, Board.ranks, createPiece(PLAYER_BLACK, ROOK));

      const gameState = Board.computeGameState(board, PLAYER_WHITE);

      expect(gameState).toBe(STALEMATE);
    });

    it('in progress', () => {
      Board.setPiece(board, 1, 'a', createPiece(PLAYER_WHITE, KING));
      Board.setPiece(
        board,
        Board.ranks,
        Board.ranks,
        createPiece(PLAYER_BLACK, KING),
      );

      const gameState = Board.computeGameState(board, PLAYER_WHITE);

      expect(gameState).toBe(IN_PROGRESS);
    });
  });
});
