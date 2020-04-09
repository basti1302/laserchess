import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {LASER, PAWN} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import {NORTH, EAST, SOUTH, WEST} from '../../../engine/Orientation';

import fireLaser from '../../../engine/laser/fireLaser';
import {START, STRAIGHT, DESTROY} from '../../../engine/laser/SegmentType';

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
    const pawn = new Piece(PLAYER_WHITE, PAWN, NORTH);
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
    const pawn = new Piece(PLAYER_BLACK, PAWN, NORTH);
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
