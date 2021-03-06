import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
  ranks,
  files,
} from '../../../engine/Board';
import { create as createPiece, fire } from '../../../engine/Piece';
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
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { getFileAsLetter } from '../../../engine/Square';
import { NORTH, EAST, SOUTH, WEST } from '../../../engine/Orientation';

import fireLaser from '../../../engine/laser/fireLaser';
import {
  START,
  STRAIGHT,
  REFLECTED_LEFT,
  REFLECTED_RIGHT,
  REFLECTED_STRAIGHT,
  ABSORB,
  DESTROY,
} from '../../../engine/laser/segmentTypes';

describe('fire laser', () => {
  let board;

  beforeEach(() => {
    board = createBoard();
  });

  test('should not create segments without a source piece', () => {
    const shot = fireLaser(board, getSquareFromBoard(board, 1, 'a'), NORTH);
    expect(shot.segments.length).toEqual(0);
  });

  describe('straight shots', () => {
    test('fireLaser util should shoot', () => {
      const laserPos = getSquareFromBoard(board, 1, 'c');
      setPieceOnBoard(
        board,
        laserPos.rank,
        laserPos.file,
        createPiece(PLAYER_WHITE, LASER, NORTH),
      );

      const shot = fireLaser(board, laserPos, NORTH);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(ranks);
      verifySegment(segments[0], 1, 'c', NORTH, START);
      for (let i = 1; i < segments.length - 1; i++) {
        verifySegment(segments[i], i + 1, 'c', NORTH, STRAIGHT);
      }
    });

    test('laser piece should shoot straight north', () => {
      const laserPos = getSquareFromBoard(board, 1, 'c');
      const laser = createPiece(PLAYER_WHITE, LASER, NORTH);
      setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);

      const shot = fire(laser, board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(ranks);
      verifySegment(segments[0], 1, 'c', NORTH, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], i + 1, 'c', NORTH, STRAIGHT);
      }
    });

    test('laser piece should shoot straight east', () => {
      const laserPos = getSquareFromBoard(board, 5, 'a');
      const laser = createPiece(PLAYER_WHITE, LASER, EAST);
      setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);

      const shot = fire(laser, board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(files);
      verifySegment(segments[0], 5, 'a', EAST, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], 5, i + 1, EAST, STRAIGHT);
      }
    });

    test('laser piece should shoot straight south', () => {
      const laserPos = getSquareFromBoard(board, ranks, 'f');
      const laser = createPiece(PLAYER_WHITE, LASER, SOUTH);
      setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);

      const shot = fire(laser, board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(ranks);
      verifySegment(segments[0], ranks, 'f', SOUTH, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], ranks - i, 'f', SOUTH, STRAIGHT);
      }
    });

    test('laser piece should shoot straight west', () => {
      const laserPos = getSquareFromBoard(board, 7, files);
      const laser = createPiece(PLAYER_WHITE, LASER, WEST);
      setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);

      const shot = fire(laser, board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(files);
      verifySegment(segments[0], 7, files, WEST, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], 7, files - i, WEST, STRAIGHT);
      }
    });

    test('should shoot friendly piece', () => {
      const laserPos = getSquareFromBoard(board, 1, 'c');
      const laser = createPiece(PLAYER_WHITE, LASER, NORTH);
      setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
      const targetPos = getSquareFromBoard(board, 7, 'c');
      const target = createPiece(PLAYER_WHITE, KING, NORTH);
      setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

      const shot = fire(laser, board);

      expect(shot.destroyedSquares.length).toBe(1);
      expect(shot.destroyedSquares[0]).toBe(targetPos);
      const segments = shot.segments;
      expect(segments.length).toBe(7);
      verifySegment(segments[0], 1, 'c', NORTH, START);
      for (let i = 1; i < segments.length - 1; i++) {
        verifySegment(segments[i], i + 1, 'c', NORTH, STRAIGHT);
      }
      verifySegment(segments[6], 7, 'c', NORTH, DESTROY);
    });

    test('should shoot enemy piece', () => {
      const laserPos = getSquareFromBoard(board, 5, 'b');
      const laser = createPiece(PLAYER_WHITE, LASER, EAST);
      setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
      const targetPos = getSquareFromBoard(board, 5, 'g');
      const target = createPiece(PLAYER_BLACK, KING, NORTH);
      setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

      const shot = fire(laser, board);

      expect(shot.destroyedSquares.length).toBe(1);
      expect(shot.destroyedSquares[0]).toBe(targetPos);
      const segments = shot.segments;
      expect(segments.length).toBe(6);
      verifySegment(segments[0], 5, 'b', EAST, START);
      for (let i = 1; i < segments.length - 1; i++) {
        verifySegment(segments[i], 5, 2 + i, EAST, STRAIGHT);
      }
      verifySegment(segments[5], 5, 'g', EAST, DESTROY);
    });

    describe('shield pawn', () => {
      test('shield surface shoult stop a shot from north to south', () => {
        const laserPos = getSquareFromBoard(board, 7, 'e');
        const laser = createPiece(PLAYER_WHITE, LASER, SOUTH);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = getSquareFromBoard(board, 3, 'e');
        const shieldPawn = createPiece(PLAYER_WHITE, PAWN_SHIELD, NORTH);
        setPieceOnBoard(
          board,
          shieldPawnPos.rank,
          shieldPawnPos.file,
          shieldPawn,
        );

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(0);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 7, 'e', SOUTH, START);
        for (let i = 1; i < segments.length - 1; i++) {
          verifySegment(segments[i], 7 - i, 'e', SOUTH, STRAIGHT);
        }
        verifySegment(segments[4], 3, 'e', SOUTH, ABSORB);
      });

      test('shield surface shoult stop a shot from east to west', () => {
        const laserPos = getSquareFromBoard(board, 5, 'g');
        const laser = createPiece(PLAYER_WHITE, LASER, WEST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = getSquareFromBoard(board, 5, 'c');
        const shieldPawn = createPiece(PLAYER_WHITE, PAWN_SHIELD, EAST);
        setPieceOnBoard(
          board,
          shieldPawnPos.rank,
          shieldPawnPos.file,
          shieldPawn,
        );

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(0);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'g', WEST, START);
        for (let i = 1; i < segments.length - 1; i++) {
          verifySegment(segments[i], 5, 7 - i, WEST, STRAIGHT);
        }
        verifySegment(segments[4], 5, 'c', WEST, ABSORB);
      });

      test('shield surface shoult stop a shot from south to north', () => {
        const laserPos = getSquareFromBoard(board, 3, 'e');
        const laser = createPiece(PLAYER_WHITE, LASER, NORTH);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = getSquareFromBoard(board, 7, 'e');
        const shieldPawn = createPiece(PLAYER_WHITE, PAWN_SHIELD, SOUTH);
        setPieceOnBoard(
          board,
          shieldPawnPos.rank,
          shieldPawnPos.file,
          shieldPawn,
        );

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(0);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 3, 'e', NORTH, START);
        for (let i = 1; i < segments.length - 1; i++) {
          verifySegment(segments[i], i + 3, 'e', NORTH, STRAIGHT);
        }
        verifySegment(segments[4], 7, 'e', NORTH, ABSORB);
      });

      test('shield surface shoult stop a shot from east to west', () => {
        const laserPos = getSquareFromBoard(board, 5, 'c');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = getSquareFromBoard(board, 5, 'g');
        const shieldPawn = createPiece(PLAYER_WHITE, PAWN_SHIELD, WEST);
        setPieceOnBoard(
          board,
          shieldPawnPos.rank,
          shieldPawnPos.file,
          shieldPawn,
        );

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(0);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'c', EAST, START);
        for (let i = 1; i < segments.length - 1; i++) {
          verifySegment(segments[i], 5, i + 3, EAST, STRAIGHT);
        }
        verifySegment(segments[4], 5, 'g', EAST, ABSORB);
      });
    });

    describe('90-degree pawn', () => {
      test('should reflect south-bound shot left/east', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, SOUTH);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const ninetyDegPawnPos = getSquareFromBoard(board, 3, 'd');
        const ninetyDegPawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH);
        setPieceOnBoard(
          board,
          ninetyDegPawnPos.rank,
          ninetyDegPawnPos.file,
          ninetyDegPawn,
        );
        const targetPos = getSquareFromBoard(board, 3, 'f');
        const target = createPiece(PLAYER_BLACK, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'd', SOUTH, START);
        verifySegment(segments[1], 4, 'd', SOUTH, STRAIGHT);
        verifySegment(segments[2], 3, 'd', SOUTH, REFLECTED_LEFT);
        verifySegment(segments[3], 3, 'e', EAST, STRAIGHT);
        verifySegment(segments[4], 3, 'f', EAST, DESTROY);
      });

      test('should reflect west-bound shot right/north', () => {
        const laserPos = getSquareFromBoard(board, 3, 'f');
        const laser = createPiece(PLAYER_WHITE, LASER, WEST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const ninetyDegPawnPos = getSquareFromBoard(board, 3, 'd');
        const ninetyDegPawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH);
        setPieceOnBoard(
          board,
          ninetyDegPawnPos.rank,
          ninetyDegPawnPos.file,
          ninetyDegPawn,
        );
        const targetPos = getSquareFromBoard(board, 5, 'd');
        const target = createPiece(PLAYER_BLACK, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 3, 'f', WEST, START);
        verifySegment(segments[1], 3, 'e', WEST, STRAIGHT);
        verifySegment(segments[2], 3, 'd', WEST, REFLECTED_RIGHT);
        verifySegment(segments[3], 4, 'd', NORTH, STRAIGHT);
        verifySegment(segments[4], 5, 'd', NORTH, DESTROY);
      });

      test('should reflect west-bound shot left/shouth', () => {
        const laserPos = getSquareFromBoard(board, 5, 'f');
        const laser = createPiece(PLAYER_WHITE, LASER, WEST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const ninetyDegPawnPos = getSquareFromBoard(board, 5, 'd');
        const ninetyDegPawn = createPiece(PLAYER_WHITE, PAWN_90_DEGREES, EAST);
        setPieceOnBoard(
          board,
          ninetyDegPawnPos.rank,
          ninetyDegPawnPos.file,
          ninetyDegPawn,
        );
        const targetPos = getSquareFromBoard(board, 3, 'd');
        const target = createPiece(PLAYER_BLACK, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'f', WEST, START);
        verifySegment(segments[1], 5, 'e', WEST, STRAIGHT);
        verifySegment(segments[2], 5, 'd', WEST, REFLECTED_LEFT);
        verifySegment(segments[3], 4, 'd', SOUTH, STRAIGHT);
        verifySegment(segments[4], 3, 'd', SOUTH, DESTROY);
      });
    });

    describe('threeway pawn', () => {
      test('should reflect straight', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const threewayPawnPos = getSquareFromBoard(board, 5, 'f');
        const threewayPawn = createPiece(PLAYER_WHITE, PAWN_THREEWAY, WEST);
        setPieceOnBoard(
          board,
          threewayPawnPos.rank,
          threewayPawnPos.file,
          threewayPawn,
        );

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(laserPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, REFLECTED_STRAIGHT);
        verifySegment(segments[3], 5, 'e', WEST, STRAIGHT);
        verifySegment(segments[4], 5, 'd', WEST, DESTROY);
      });

      test('should reflect left', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const threewayPawnPos = getSquareFromBoard(board, 5, 'f');
        const threewayPawn = createPiece(PLAYER_WHITE, PAWN_THREEWAY, NORTH);
        setPieceOnBoard(
          board,
          threewayPawnPos.rank,
          threewayPawnPos.file,
          threewayPawn,
        );
        const targetPos = getSquareFromBoard(board, 7, 'f');
        const target = createPiece(PLAYER_BLACK, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, REFLECTED_LEFT);
        verifySegment(segments[3], 6, 'f', NORTH, STRAIGHT);
        verifySegment(segments[4], 7, 'f', NORTH, DESTROY);
      });

      test('should reflect right', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const threewayPawnPos = getSquareFromBoard(board, 5, 'f');
        const threewayPawn = createPiece(PLAYER_WHITE, PAWN_THREEWAY, SOUTH);
        setPieceOnBoard(
          board,
          threewayPawnPos.rank,
          threewayPawnPos.file,
          threewayPawn,
        );
        const targetPos = getSquareFromBoard(board, 3, 'f');
        const target = createPiece(PLAYER_BLACK, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, REFLECTED_RIGHT);
        verifySegment(segments[3], 4, 'f', SOUTH, STRAIGHT);
        verifySegment(segments[4], 3, 'f', SOUTH, DESTROY);
      });

      test('must detect and stop shots that are reflected infinitely ', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const threewayPawn1Pos = getSquareFromBoard(board, 5, 'f');
        const threewayPawn1 = createPiece(PLAYER_WHITE, PAWN_THREEWAY, NORTH);
        setPieceOnBoard(
          board,
          threewayPawn1Pos.rank,
          threewayPawn1Pos.file,
          threewayPawn1,
        );
        const threewayPawn2Pos = getSquareFromBoard(board, 7, 'f');
        const threewayPawn2 = createPiece(PLAYER_WHITE, PAWN_THREEWAY, SOUTH);
        setPieceOnBoard(
          board,
          threewayPawn2Pos.rank,
          threewayPawn2Pos.file,
          threewayPawn2,
        );
        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(0);
        const segments = shot.segments;
        expect(segments.length).toBe(9);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, REFLECTED_LEFT);
        verifySegment(segments[3], 6, 'f', NORTH, STRAIGHT);
        verifySegment(segments[4], 7, 'f', NORTH, REFLECTED_STRAIGHT);
        verifySegment(segments[5], 6, 'f', SOUTH, STRAIGHT);
        verifySegment(segments[6], 5, 'f', SOUTH, REFLECTED_STRAIGHT);
        verifySegment(segments[7], 6, 'f', NORTH, STRAIGHT);
        verifySegment(segments[8], 7, 'f', NORTH, ABSORB);
      });
    });

    describe('knight', () => {
      test('knight facing north should split shots from south', () => {
        const laserPos = getSquareFromBoard(board, 4, 'e');
        const laser = createPiece(PLAYER_WHITE, LASER, NORTH);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const knightPos = getSquareFromBoard(board, 6, 'e');
        const knight = createPiece(PLAYER_WHITE, KNIGHT, NORTH);
        setPieceOnBoard(board, knightPos.rank, knightPos.file, knight);

        const target1Pos = getSquareFromBoard(board, 6, 'g');
        const target1 = createPiece(PLAYER_BLACK, KING);
        setPieceOnBoard(board, target1Pos.rank, target1Pos.file, target1);
        const target2Pos = getSquareFromBoard(board, 6, 'c');
        const target2 = createPiece(PLAYER_BLACK, KING);
        setPieceOnBoard(board, target2Pos.rank, target2Pos.file, target2);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(2);
        expect(shot.destroyedSquares[0]).toBe(target1Pos);
        expect(shot.destroyedSquares[1]).toBe(target2Pos);
        const segments = shot.segments;
        expect(segments.length).toBe(9);
        verifySegment(segments[0], 4, 'e', NORTH, START);
        verifySegment(segments[1], 5, 'e', NORTH, STRAIGHT);
        verifySegment(segments[2], 6, 'e', NORTH, ABSORB);
        verifySegment(segments[3], 6, 'e', EAST, START);
        verifySegment(segments[4], 6, 'f', EAST, STRAIGHT);
        verifySegment(segments[5], 6, 'g', EAST, DESTROY);
        verifySegment(segments[6], 6, 'e', WEST, START);
        verifySegment(segments[7], 6, 'd', WEST, STRAIGHT);
        verifySegment(segments[8], 6, 'c', WEST, DESTROY);
      });

      test('knight facing north should split shots from north', () => {
        const laserPos = getSquareFromBoard(board, 6, 'e');
        const laser = createPiece(PLAYER_WHITE, LASER, SOUTH);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const knightPos = getSquareFromBoard(board, 4, 'e');
        const knight = createPiece(PLAYER_WHITE, KNIGHT, NORTH);
        setPieceOnBoard(board, knightPos.rank, knightPos.file, knight);

        const target1Pos = getSquareFromBoard(board, 4, 'g');
        const target1 = createPiece(PLAYER_BLACK, KING);
        setPieceOnBoard(board, target1Pos.rank, target1Pos.file, target1);
        const target2Pos = getSquareFromBoard(board, 4, 'c');
        const target2 = createPiece(PLAYER_BLACK, KING);
        setPieceOnBoard(board, target2Pos.rank, target2Pos.file, target2);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(2);
        expect(shot.destroyedSquares[0]).toBe(target2Pos);
        expect(shot.destroyedSquares[1]).toBe(target1Pos);
        const segments = shot.segments;
        expect(segments.length).toBe(9);
        verifySegment(segments[0], 6, 'e', SOUTH, START);
        verifySegment(segments[1], 5, 'e', SOUTH, STRAIGHT);
        verifySegment(segments[2], 4, 'e', SOUTH, ABSORB);
        verifySegment(segments[3], 4, 'e', WEST, START);
        verifySegment(segments[4], 4, 'd', WEST, STRAIGHT);
        verifySegment(segments[5], 4, 'c', WEST, DESTROY);
        verifySegment(segments[6], 4, 'e', EAST, START);
        verifySegment(segments[7], 4, 'f', EAST, STRAIGHT);
        verifySegment(segments[8], 4, 'g', EAST, DESTROY);
      });

      test('knight facing north should be shot from west', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const knightPos = getSquareFromBoard(board, 5, 'f');
        const knight = createPiece(PLAYER_WHITE, KNIGHT, NORTH);
        setPieceOnBoard(board, knightPos.rank, knightPos.file, knight);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(knightPos);
        const segments = shot.segments;
        expect(segments.length).toBe(3);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, DESTROY);
      });

      test('knight facing north should be shot from east', () => {
        const laserPos = getSquareFromBoard(board, 5, 'f');
        const laser = createPiece(PLAYER_WHITE, LASER, WEST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const knightPos = getSquareFromBoard(board, 5, 'd');
        const knight = createPiece(PLAYER_WHITE, KNIGHT, NORTH);
        setPieceOnBoard(board, knightPos.rank, knightPos.file, knight);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(knightPos);
        const segments = shot.segments;
        expect(segments.length).toBe(3);
        verifySegment(segments[0], 5, 'f', WEST, START);
        verifySegment(segments[1], 5, 'e', WEST, STRAIGHT);
        verifySegment(segments[2], 5, 'd', WEST, DESTROY);
      });

      test('knight facing east should split shots from west', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const knightPos = getSquareFromBoard(board, 5, 'f');
        const knight = createPiece(PLAYER_WHITE, KNIGHT, EAST);
        setPieceOnBoard(board, knightPos.rank, knightPos.file, knight);

        const target1Pos = getSquareFromBoard(board, 3, 'f');
        const target1 = createPiece(PLAYER_BLACK, KING);
        setPieceOnBoard(board, target1Pos.rank, target1Pos.file, target1);
        const target2Pos = getSquareFromBoard(board, 7, 'f');
        const target2 = createPiece(PLAYER_BLACK, KING);
        setPieceOnBoard(board, target2Pos.rank, target2Pos.file, target2);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(2);
        expect(shot.destroyedSquares[0]).toBe(target1Pos);
        expect(shot.destroyedSquares[1]).toBe(target2Pos);
        const segments = shot.segments;
        expect(segments.length).toBe(9);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, ABSORB);
        verifySegment(segments[3], 5, 'f', SOUTH, START);
        verifySegment(segments[4], 4, 'f', SOUTH, STRAIGHT);
        verifySegment(segments[5], 3, 'f', SOUTH, DESTROY);
        verifySegment(segments[6], 5, 'f', NORTH, START);
        verifySegment(segments[7], 6, 'f', NORTH, STRAIGHT);
        verifySegment(segments[8], 7, 'f', NORTH, DESTROY);
      });

      test('a piece hit by multiple shot legs should only be listed as destroyed once', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const knightPos = getSquareFromBoard(board, 5, 'f');
        const knight = createPiece(PLAYER_WHITE, KNIGHT, EAST);
        setPieceOnBoard(board, knightPos.rank, knightPos.file, knight);

        const shieldPawn1Pos = getSquareFromBoard(board, 3, 'f');
        const shieldPawn1 = createPiece(PLAYER_BLACK, PAWN_THREEWAY, NORTH);
        setPieceOnBoard(
          board,
          shieldPawn1Pos.rank,
          shieldPawn1Pos.file,
          shieldPawn1,
        );
        const shieldPawn2Pos = getSquareFromBoard(board, 7, 'f');
        const shieldPawn2 = createPiece(PLAYER_BLACK, PAWN_THREEWAY, SOUTH);
        setPieceOnBoard(
          board,
          shieldPawn2Pos.rank,
          shieldPawn2Pos.file,
          shieldPawn2,
        );

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(knightPos);
        const segments = shot.segments;
        expect(segments.length).toBe(13);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, ABSORB);
        verifySegment(segments[3], 5, 'f', SOUTH, START);
        verifySegment(segments[4], 4, 'f', SOUTH, STRAIGHT);
        verifySegment(segments[5], 3, 'f', SOUTH, REFLECTED_STRAIGHT);
        verifySegment(segments[6], 4, 'f', NORTH, STRAIGHT);
        verifySegment(segments[7], 5, 'f', NORTH, DESTROY);
        verifySegment(segments[8], 5, 'f', NORTH, START);
        verifySegment(segments[9], 6, 'f', NORTH, STRAIGHT);
        verifySegment(segments[10], 7, 'f', NORTH, REFLECTED_STRAIGHT);
        verifySegment(segments[11], 6, 'f', SOUTH, STRAIGHT);
        verifySegment(segments[12], 5, 'f', SOUTH, DESTROY);
      });
    });

    describe('bishop', () => {
      test('should reflect straight', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const bishopPos = getSquareFromBoard(board, 5, 'f');
        const bishop = createPiece(PLAYER_WHITE, BISHOP, WEST);
        setPieceOnBoard(board, bishopPos.rank, bishopPos.file, bishop);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(laserPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, REFLECTED_STRAIGHT);
        verifySegment(segments[3], 5, 'e', WEST, STRAIGHT);
        verifySegment(segments[4], 5, 'd', WEST, DESTROY);
      });

      test('should reflect right', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const bishopPos = getSquareFromBoard(board, 5, 'f');
        const bishop = createPiece(PLAYER_WHITE, BISHOP, NORTH);
        setPieceOnBoard(board, bishopPos.rank, bishopPos.file, bishop);
        const targetPos = getSquareFromBoard(board, 3, 'f');
        const target = createPiece(PLAYER_BLACK, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, REFLECTED_RIGHT);
        verifySegment(segments[3], 4, 'f', SOUTH, STRAIGHT);
        verifySegment(segments[4], 3, 'f', SOUTH, DESTROY);
      });

      test('should reflect left', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const bishopPos = getSquareFromBoard(board, 5, 'f');
        const bishop = createPiece(PLAYER_WHITE, BISHOP, SOUTH);
        setPieceOnBoard(board, bishopPos.rank, bishopPos.file, bishop);
        const targetPos = getSquareFromBoard(board, 7, 'f');
        const target = createPiece(PLAYER_BLACK, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(5);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, REFLECTED_LEFT);
        verifySegment(segments[3], 6, 'f', NORTH, STRAIGHT);
        verifySegment(segments[4], 7, 'f', NORTH, DESTROY);
      });
    });

    describe('rook', () => {
      [NORTH, EAST, SOUTH, WEST].forEach(rookOrientation => {
        test('should not be destroyed by laser', () => {
          const laserPos = getSquareFromBoard(board, 5, 'd');
          const laser = createPiece(PLAYER_WHITE, LASER, EAST);
          setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
          const rookPos = getSquareFromBoard(board, 5, 'f');
          const rook = createPiece(PLAYER_WHITE, ROOK, rookOrientation);
          setPieceOnBoard(board, rookPos.rank, rookPos.file, rook);

          const shot = fire(laser, board);

          expect(shot.destroyedSquares.length).toBe(0);
          const segments = shot.segments;
          expect(segments.length).toBe(3);
          verifySegment(segments[0], 5, 'd', EAST, START);
          verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
          verifySegment(segments[2], 5, 'f', EAST, ABSORB);
        });
      });
    });

    describe('laser', () => {
      [NORTH, EAST, SOUTH, WEST].forEach(targetLaserOrientation => {
        test('should be destroyed from every direction', () => {
          const sourceLaserPos = getSquareFromBoard(board, 5, 'd');
          const sourceLaser = createPiece(PLAYER_WHITE, LASER, EAST);
          setPieceOnBoard(
            board,
            sourceLaserPos.rank,
            sourceLaserPos.file,
            sourceLaser,
          );
          const targetLaserPos = getSquareFromBoard(board, 5, 'f');
          const targetLaser = createPiece(
            PLAYER_WHITE,
            LASER,
            targetLaserOrientation,
          );
          setPieceOnBoard(
            board,
            targetLaserPos.rank,
            targetLaserPos.file,
            targetLaser,
          );

          const shot = fire(sourceLaser, board);

          expect(shot.destroyedSquares.length).toBe(1);
          expect(shot.destroyedSquares[0]).toBe(targetLaserPos);
          const segments = shot.segments;
          expect(segments.length).toBe(3);
          verifySegment(segments[0], 5, 'd', EAST, START);
          verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
          verifySegment(segments[2], 5, 'f', EAST, DESTROY);
        });
      });
    });

    describe('queen', () => {
      test('should relay shot when facing laser head on', () => {
        const laserPos = getSquareFromBoard(board, 5, 'd');
        const laser = createPiece(PLAYER_WHITE, LASER, EAST);
        setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
        const queenPos = getSquareFromBoard(board, 5, 'f');
        const queen = createPiece(PLAYER_WHITE, QUEEN, WEST);
        setPieceOnBoard(board, queenPos.rank, queenPos.file, queen);
        const targetPos = getSquareFromBoard(board, 5, 'h');
        const target = createPiece(PLAYER_WHITE, KING, NORTH);
        setPieceOnBoard(board, targetPos.rank, targetPos.file, target);

        const shot = fire(laser, board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(targetPos);
        const segments = shot.segments;
        expect(segments.length).toBe(6);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, ABSORB);
        verifySegment(segments[3], 5, 'f', EAST, START);
        verifySegment(segments[4], 5, 'g', EAST, STRAIGHT);
        verifySegment(segments[5], 5, 'h', EAST, DESTROY);
      });

      [NORTH, EAST, SOUTH].forEach(queenOrientation => {
        test(`should be destroyed when facing ${queenOrientation}`, () => {
          const laserPos = getSquareFromBoard(board, 5, 'd');
          const laser = createPiece(PLAYER_WHITE, LASER, EAST);
          setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
          const queenPos = getSquareFromBoard(board, 5, 'f');
          const queen = createPiece(PLAYER_WHITE, QUEEN, queenOrientation);
          setPieceOnBoard(board, queenPos.rank, queenPos.file, queen);

          const shot = fire(laser, board);

          expect(shot.destroyedSquares.length).toBe(1);
          expect(shot.destroyedSquares[0]).toBe(queenPos);
          const segments = shot.segments;
          expect(segments.length).toBe(3);
          verifySegment(segments[0], 5, 'd', EAST, START);
          verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
          verifySegment(segments[2], 5, 'f', EAST, DESTROY);
        });
      });
    });

    describe('king', () => {
      [NORTH, EAST, SOUTH, WEST].forEach(kingOrientation => {
        test('should be destroyed from every direction', () => {
          const laserPos = getSquareFromBoard(board, 5, 'd');
          const laser = createPiece(PLAYER_WHITE, LASER, EAST);
          setPieceOnBoard(board, laserPos.rank, laserPos.file, laser);
          const kingPos = getSquareFromBoard(board, 5, 'f');
          const king = createPiece(PLAYER_WHITE, KING, kingOrientation);
          setPieceOnBoard(board, kingPos.rank, kingPos.file, king);

          const shot = fire(laser, board);

          expect(shot.destroyedSquares.length).toBe(1);
          expect(shot.destroyedSquares[0]).toBe(kingPos);
          const segments = shot.segments;
          expect(segments.length).toBe(3);
          verifySegment(segments[0], 5, 'd', EAST, START);
          verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
          verifySegment(segments[2], 5, 'f', EAST, DESTROY);
        });
      });
    });
  });

  function verifySegment(segment, rank, file, orientation, type) {
    expect(segment.square.rank).toBe(rank);
    if (typeof file === 'string') {
      expect(getFileAsLetter(segment.square)).toEqual(file);
    } else {
      expect(segment.square.file).toEqual(file);
    }
    expect(segment.orientation).toBe(orientation);
    expect(segment.type).toBe(type);
  }
});
