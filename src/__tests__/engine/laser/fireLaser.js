import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
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
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import {NORTH, EAST, SOUTH, WEST} from '../../../engine/Orientation';

import fireLaser from '../../../engine/laser/fireLaser';
import {
  START,
  STRAIGHT,
  REFLECTED_LEFT,
  REFLECTED_RIGHT,
  REFLECTED_STRAIGHT,
  ABSORB,
  DESTROY,
} from '../../../engine/laser/SegmentType';
import {SHIELD} from '../../../engine/laser/Surface';

describe('fire laser', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test('should not create segments without a source piece', () => {
    const shot = fireLaser(board, board.getSquare(1, 'a'), NORTH);
    expect(shot.segments.length).toEqual(0);
  });

  describe('straight shots', () => {
    test('fireLaser util should shoot', () => {
      const laserPos = board.getSquare(1, 'c');
      board.setPiece(
        laserPos.rank,
        laserPos.file,
        new Piece(PLAYER_WHITE, LASER, NORTH),
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
      const laserPos = board.getSquare(1, 'c');
      const laser = new Piece(PLAYER_WHITE, LASER, NORTH);
      board.setPiece(laserPos.rank, laserPos.file, laser);

      const shot = laser.fire(board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(ranks);
      verifySegment(segments[0], 1, 'c', NORTH, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], i + 1, 'c', NORTH, STRAIGHT);
      }
    });

    test('laser piece should shoot straight east', () => {
      const laserPos = board.getSquare(5, 'a');
      const laser = new Piece(PLAYER_WHITE, LASER, EAST);
      board.setPiece(laserPos.rank, laserPos.file, laser);

      const shot = laser.fire(board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(files);
      verifySegment(segments[0], 5, 'a', EAST, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], 5, i + 1, EAST, STRAIGHT);
      }
    });

    test('laser piece should shoot straight south', () => {
      const laserPos = board.getSquare(ranks, 'f');
      const laser = new Piece(PLAYER_WHITE, LASER, SOUTH);
      board.setPiece(laserPos.rank, laserPos.file, laser);

      const shot = laser.fire(board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(ranks);
      verifySegment(segments[0], ranks, 'f', SOUTH, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], ranks - i, 'f', SOUTH, STRAIGHT);
      }
    });

    test('laser piece should shoot straight west', () => {
      const laserPos = board.getSquare(7, files);
      const laser = new Piece(PLAYER_WHITE, LASER, WEST);
      board.setPiece(laserPos.rank, laserPos.file, laser);

      const shot = laser.fire(board);

      expect(shot.destroyedSquares.length).toBe(0);
      const segments = shot.segments;
      expect(segments.length).toBe(files);
      verifySegment(segments[0], 7, files, WEST, START);
      for (let i = 1; i < segments.length; i++) {
        verifySegment(segments[i], 7, files - i, WEST, STRAIGHT);
      }
    });

    test('should shoot friendly piece', () => {
      const laserPos = board.getSquare(1, 'c');
      const laser = new Piece(PLAYER_WHITE, LASER, NORTH);
      board.setPiece(laserPos.rank, laserPos.file, laser);
      const targetPos = board.getSquare(7, 'c');
      const target = new Piece(PLAYER_WHITE, KING, NORTH);
      board.setPiece(targetPos.rank, targetPos.file, target);

      const shot = laser.fire(board);

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
      const laserPos = board.getSquare(5, 'b');
      const laser = new Piece(PLAYER_WHITE, LASER, EAST);
      board.setPiece(laserPos.rank, laserPos.file, laser);
      const targetPos = board.getSquare(5, 'g');
      const target = new Piece(PLAYER_BLACK, KING, NORTH);
      board.setPiece(targetPos.rank, targetPos.file, target);

      const shot = laser.fire(board);

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
        const laserPos = board.getSquare(7, 'e');
        const laser = new Piece(PLAYER_WHITE, LASER, SOUTH);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = board.getSquare(3, 'e');
        const shieldPawn = new Piece(PLAYER_WHITE, PAWN_SHIELD, NORTH);
        board.setPiece(shieldPawnPos.rank, shieldPawnPos.file, shieldPawn);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'g');
        const laser = new Piece(PLAYER_WHITE, LASER, WEST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = board.getSquare(5, 'c');
        const shieldPawn = new Piece(PLAYER_WHITE, PAWN_SHIELD, EAST);
        board.setPiece(shieldPawnPos.rank, shieldPawnPos.file, shieldPawn);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(3, 'e');
        const laser = new Piece(PLAYER_WHITE, LASER, NORTH);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = board.getSquare(7, 'e');
        const shieldPawn = new Piece(PLAYER_WHITE, PAWN_SHIELD, SOUTH);
        board.setPiece(shieldPawnPos.rank, shieldPawnPos.file, shieldPawn);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'c');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const shieldPawnPos = board.getSquare(5, 'g');
        const shieldPawn = new Piece(PLAYER_WHITE, PAWN_SHIELD, WEST);
        board.setPiece(shieldPawnPos.rank, shieldPawnPos.file, shieldPawn);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, SOUTH);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const ninetyDegPawnPos = board.getSquare(3, 'd');
        const ninetyDegPawn = new Piece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH);
        board.setPiece(
          ninetyDegPawnPos.rank,
          ninetyDegPawnPos.file,
          ninetyDegPawn,
        );
        const targetPos = board.getSquare(3, 'f');
        const target = new Piece(PLAYER_BLACK, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(3, 'f');
        const laser = new Piece(PLAYER_WHITE, LASER, WEST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const ninetyDegPawnPos = board.getSquare(3, 'd');
        const ninetyDegPawn = new Piece(PLAYER_WHITE, PAWN_90_DEGREES, NORTH);
        board.setPiece(
          ninetyDegPawnPos.rank,
          ninetyDegPawnPos.file,
          ninetyDegPawn,
        );
        const targetPos = board.getSquare(5, 'd');
        const target = new Piece(PLAYER_BLACK, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'f');
        const laser = new Piece(PLAYER_WHITE, LASER, WEST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const ninetyDegPawnPos = board.getSquare(5, 'd');
        const ninetyDegPawn = new Piece(PLAYER_WHITE, PAWN_90_DEGREES, EAST);
        board.setPiece(
          ninetyDegPawnPos.rank,
          ninetyDegPawnPos.file,
          ninetyDegPawn,
        );
        const targetPos = board.getSquare(3, 'd');
        const target = new Piece(PLAYER_BLACK, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const threewayPawnPos = board.getSquare(5, 'f');
        const threewayPawn = new Piece(PLAYER_WHITE, PAWN_THREEWAY, WEST);
        board.setPiece(
          threewayPawnPos.rank,
          threewayPawnPos.file,
          threewayPawn,
        );

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const threewayPawnPos = board.getSquare(5, 'f');
        const threewayPawn = new Piece(PLAYER_WHITE, PAWN_THREEWAY, NORTH);
        board.setPiece(
          threewayPawnPos.rank,
          threewayPawnPos.file,
          threewayPawn,
        );
        const targetPos = board.getSquare(7, 'f');
        const target = new Piece(PLAYER_BLACK, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const threewayPawnPos = board.getSquare(5, 'f');
        const threewayPawn = new Piece(PLAYER_WHITE, PAWN_THREEWAY, SOUTH);
        board.setPiece(
          threewayPawnPos.rank,
          threewayPawnPos.file,
          threewayPawn,
        );
        const targetPos = board.getSquare(3, 'f');
        const target = new Piece(PLAYER_BLACK, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const threewayPawn1Pos = board.getSquare(5, 'f');
        const threewayPawn1 = new Piece(PLAYER_WHITE, PAWN_THREEWAY, NORTH);
        board.setPiece(
          threewayPawn1Pos.rank,
          threewayPawn1Pos.file,
          threewayPawn1,
        );
        const threewayPawn2Pos = board.getSquare(7, 'f');
        const threewayPawn2 = new Piece(PLAYER_WHITE, PAWN_THREEWAY, SOUTH);
        board.setPiece(
          threewayPawn2Pos.rank,
          threewayPawn2Pos.file,
          threewayPawn2,
        );
        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(4, 'e');
        const laser = new Piece(PLAYER_WHITE, LASER, NORTH);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const knightPos = board.getSquare(6, 'e');
        const knight = new Piece(PLAYER_WHITE, KNIGHT, NORTH);
        board.setPiece(knightPos.rank, knightPos.file, knight);

        const target1Pos = board.getSquare(6, 'g');
        const target1 = new Piece(PLAYER_BLACK, KING);
        board.setPiece(target1Pos.rank, target1Pos.file, target1);
        const target2Pos = board.getSquare(6, 'c');
        const target2 = new Piece(PLAYER_BLACK, KING);
        board.setPiece(target2Pos.rank, target2Pos.file, target2);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(6, 'e');
        const laser = new Piece(PLAYER_WHITE, LASER, SOUTH);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const knightPos = board.getSquare(4, 'e');
        const knight = new Piece(PLAYER_WHITE, KNIGHT, NORTH);
        board.setPiece(knightPos.rank, knightPos.file, knight);

        const target1Pos = board.getSquare(4, 'g');
        const target1 = new Piece(PLAYER_BLACK, KING);
        board.setPiece(target1Pos.rank, target1Pos.file, target1);
        const target2Pos = board.getSquare(4, 'c');
        const target2 = new Piece(PLAYER_BLACK, KING);
        board.setPiece(target2Pos.rank, target2Pos.file, target2);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const knightPos = board.getSquare(5, 'f');
        const knight = new Piece(PLAYER_WHITE, KNIGHT, NORTH);
        board.setPiece(knightPos.rank, knightPos.file, knight);

        const shot = laser.fire(board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(knightPos);
        const segments = shot.segments;
        expect(segments.length).toBe(3);
        verifySegment(segments[0], 5, 'd', EAST, START);
        verifySegment(segments[1], 5, 'e', EAST, STRAIGHT);
        verifySegment(segments[2], 5, 'f', EAST, DESTROY);
      });

      test('knight facing north should be shot from east', () => {
        const laserPos = board.getSquare(5, 'f');
        const laser = new Piece(PLAYER_WHITE, LASER, WEST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const knightPos = board.getSquare(5, 'd');
        const knight = new Piece(PLAYER_WHITE, KNIGHT, NORTH);
        board.setPiece(knightPos.rank, knightPos.file, knight);

        const shot = laser.fire(board);

        expect(shot.destroyedSquares.length).toBe(1);
        expect(shot.destroyedSquares[0]).toBe(knightPos);
        const segments = shot.segments;
        expect(segments.length).toBe(3);
        verifySegment(segments[0], 5, 'f', WEST, START);
        verifySegment(segments[1], 5, 'e', WEST, STRAIGHT);
        verifySegment(segments[2], 5, 'd', WEST, DESTROY);
      });

      test('knight facing east should split shots from west', () => {
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const knightPos = board.getSquare(5, 'f');
        const knight = new Piece(PLAYER_WHITE, KNIGHT, EAST);
        board.setPiece(knightPos.rank, knightPos.file, knight);

        const target1Pos = board.getSquare(3, 'f');
        const target1 = new Piece(PLAYER_BLACK, KING);
        board.setPiece(target1Pos.rank, target1Pos.file, target1);
        const target2Pos = board.getSquare(7, 'f');
        const target2 = new Piece(PLAYER_BLACK, KING);
        board.setPiece(target2Pos.rank, target2Pos.file, target2);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const knightPos = board.getSquare(5, 'f');
        const knight = new Piece(PLAYER_WHITE, KNIGHT, EAST);
        board.setPiece(knightPos.rank, knightPos.file, knight);

        const shieldPawn1Pos = board.getSquare(3, 'f');
        const shieldPawn1 = new Piece(PLAYER_BLACK, PAWN_THREEWAY, NORTH);
        board.setPiece(shieldPawn1Pos.rank, shieldPawn1Pos.file, shieldPawn1);
        const shieldPawn2Pos = board.getSquare(7, 'f');
        const shieldPawn2 = new Piece(PLAYER_BLACK, PAWN_THREEWAY, SOUTH);
        board.setPiece(shieldPawn2Pos.rank, shieldPawn2Pos.file, shieldPawn2);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const bishopPos = board.getSquare(5, 'f');
        const bishop = new Piece(PLAYER_WHITE, BISHOP, WEST);
        board.setPiece(bishopPos.rank, bishopPos.file, bishop);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const bishopPos = board.getSquare(5, 'f');
        const bishop = new Piece(PLAYER_WHITE, BISHOP, NORTH);
        board.setPiece(bishopPos.rank, bishopPos.file, bishop);
        const targetPos = board.getSquare(3, 'f');
        const target = new Piece(PLAYER_BLACK, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const bishopPos = board.getSquare(5, 'f');
        const bishop = new Piece(PLAYER_WHITE, BISHOP, SOUTH);
        board.setPiece(bishopPos.rank, bishopPos.file, bishop);
        const targetPos = board.getSquare(7, 'f');
        const target = new Piece(PLAYER_BLACK, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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
      [NORTH, EAST, SOUTH, WEST].forEach((rookOrientation) => {
        test('should not be destroyed by laser', () => {
          const laserPos = board.getSquare(5, 'd');
          const laser = new Piece(PLAYER_WHITE, LASER, EAST);
          board.setPiece(laserPos.rank, laserPos.file, laser);
          const rookPos = board.getSquare(5, 'f');
          const rook = new Piece(PLAYER_WHITE, ROOK, rookOrientation);
          board.setPiece(rookPos.rank, rookPos.file, rook);

          const shot = laser.fire(board);

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
      [NORTH, EAST, SOUTH, WEST].forEach((targetLaserOrientation) => {
        test('should be destroyed from every direction', () => {
          const sourceLaserPos = board.getSquare(5, 'd');
          const sourceLaser = new Piece(PLAYER_WHITE, LASER, EAST);
          board.setPiece(sourceLaserPos.rank, sourceLaserPos.file, sourceLaser);
          const targetLaserPos = board.getSquare(5, 'f');
          const targetLaser = new Piece(
            PLAYER_WHITE,
            LASER,
            targetLaserOrientation,
          );
          board.setPiece(targetLaserPos.rank, targetLaserPos.file, targetLaser);

          const shot = sourceLaser.fire(board);

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
        const laserPos = board.getSquare(5, 'd');
        const laser = new Piece(PLAYER_WHITE, LASER, EAST);
        board.setPiece(laserPos.rank, laserPos.file, laser);
        const queenPos = board.getSquare(5, 'f');
        const queen = new Piece(PLAYER_WHITE, QUEEN, WEST);
        board.setPiece(queenPos.rank, queenPos.file, queen);
        const targetPos = board.getSquare(5, 'h');
        const target = new Piece(PLAYER_WHITE, KING, NORTH);
        board.setPiece(targetPos.rank, targetPos.file, target);

        const shot = laser.fire(board);

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

      [NORTH, EAST, SOUTH].forEach((queenOrientation) => {
        test(`should be destroyed when facing ${queenOrientation}`, () => {
          const laserPos = board.getSquare(5, 'd');
          const laser = new Piece(PLAYER_WHITE, LASER, EAST);
          board.setPiece(laserPos.rank, laserPos.file, laser);
          const queenPos = board.getSquare(5, 'f');
          const queen = new Piece(PLAYER_WHITE, QUEEN, queenOrientation);
          board.setPiece(queenPos.rank, queenPos.file, queen);

          const shot = laser.fire(board);

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
      [NORTH, EAST, SOUTH, WEST].forEach((kingOrientation) => {
        test('should be destroyed from every direction', () => {
          const laserPos = board.getSquare(5, 'd');
          const laser = new Piece(PLAYER_WHITE, LASER, EAST);
          board.setPiece(laserPos.rank, laserPos.file, laser);
          const kingPos = board.getSquare(5, 'f');
          const king = new Piece(PLAYER_WHITE, KING, kingOrientation);
          board.setPiece(kingPos.rank, kingPos.file, king);

          const shot = laser.fire(board);

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
      expect(segment.square.getFileAsLetter()).toEqual(file);
    } else {
      expect(segment.square.file).toEqual(file);
    }
    expect(segment.orientation).toBe(orientation);
    expect(segment.type).toBe(type);
  }
});
