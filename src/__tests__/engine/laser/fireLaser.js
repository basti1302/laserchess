import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {
  KING,
  KNIGHT,
  LASER,
  PAWN_SHIELD,
  PAWN_90_DEGREES,
  PAWN_THREEWAY,
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
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should not create segments without a source piece', () => {
    const shot = fireLaser(board, board.getSquare(1, 'a'), NORTH);
    expect(moves.length).toEqual(0);
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

      expect(shot.destroyedSquare).toBeUndefined();
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

      expect(shot.destroyedSquare).toBeUndefined();
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

      expect(shot.destroyedSquare).toBeUndefined();
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

      expect(shot.destroyedSquare).toBeUndefined();
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

      expect(shot.destroyedSquare).toBeUndefined();
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
      const pawnPos = board.getSquare(7, 'c');
      const pawn = new Piece(PLAYER_WHITE, KNIGHT, NORTH);
      board.setPiece(pawnPos.rank, pawnPos.file, pawn);

      const shot = laser.fire(board);

      expect(shot.destroyedSquare).toBe(pawnPos);
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
      const pawnPos = board.getSquare(5, 'g');
      const pawn = new Piece(PLAYER_BLACK, KNIGHT, NORTH);
      board.setPiece(pawnPos.rank, pawnPos.file, pawn);

      const shot = laser.fire(board);

      expect(shot.destroyedSquare).toBe(pawnPos);
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

        expect(shot.destroyedSquare).toBeUndefined();
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

        expect(shot.destroyedSquare).toBeUndefined();
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

        expect(shot.destroyedSquare).toBeUndefined();
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

        expect(shot.destroyedSquare).toBeUndefined();
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

        expect(shot.destroyedSquare).toBe(targetPos);
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

        expect(shot.destroyedSquare).toBe(targetPos);
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

        expect(shot.destroyedSquare).toBe(targetPos);
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

        expect(shot.destroyedSquare).toBe(laserPos);
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

        expect(shot.destroyedSquare).toBe(targetPos);
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

        expect(shot.destroyedSquare).toBe(targetPos);
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

        expect(shot.destroyedSquare).toBeUndefined();
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
