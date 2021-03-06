import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
  ranks,
  files,
} from '../../../engine/Board';
import { create as createPiece } from '../../../engine/Piece';
import { QUEEN } from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';
import {
  NORTH,
  NORTH_EAST,
  EAST,
  SOUTH_EAST,
  SOUTH,
  SOUTH_WEST,
  WEST,
  NORTH_WEST,
} from '../../../engine/moves/directions';

import movesStraightLine from '../../../engine/moves/movesStraightLine';

describe('straight line moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should not move without a source piece', () => {
    movesStraightLine(board, moves, getSquareFromBoard(board, 1, 'a'), NORTH);
    expect(moves.length).toEqual(0);
  });

  test('should move north', () => {
    const from = getSquareFromBoard(board, 1, 'c');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(3);
    }
  });

  test('should move north-east', () => {
    const from = getSquareFromBoard(board, 1, 'a');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH_EAST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(i + 2);
    }
  });

  test('should move east', () => {
    const from = getSquareFromBoard(board, 4, 'a');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, EAST);
    expect(moves.length).toEqual(files - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(4);
      expect(moves[i].to.file).toEqual(i + 2);
    }
  });

  test('should move south-east', () => {
    const from = getSquareFromBoard(board, ranks, 'a');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, SOUTH_EAST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(ranks - i - 1);
      expect(moves[i].to.file).toEqual(i + 2);
    }
  });

  test('should move south', () => {
    const from = getSquareFromBoard(board, ranks, 'c');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, SOUTH);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(ranks - i - 1);
      expect(moves[i].to.file).toEqual(3);
    }
  });

  test('should move south-west', () => {
    const from = getSquareFromBoard(board, ranks, files);
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, SOUTH_WEST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(ranks - i - 1);
      expect(moves[i].to.file).toEqual(files - i - 1);
    }
  });

  test('should move west', () => {
    const from = getSquareFromBoard(board, 4, files);
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, WEST);
    expect(moves.length).toEqual(files - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(4);
      expect(moves[i].to.file).toEqual(files - i - 1);
    }
  });

  test('should move north-west', () => {
    const from = getSquareFromBoard(board, 1, files);
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH_WEST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(files - i - 1);
    }
  });

  test('should be blocked by friendly piece', () => {
    const from = getSquareFromBoard(board, 1, 'c');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    setPieceOnBoard(board, 5, 'c', createPiece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH);
    expect(moves.length).toEqual(3);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(3);
    }
  });

  test('should be stopped by enemy piece', () => {
    const from = getSquareFromBoard(board, 1, 'c');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, QUEEN));
    setPieceOnBoard(board, 5, 'c', createPiece(PLAYER_BLACK, QUEEN));
    movesStraightLine(board, moves, from, NORTH);
    expect(moves.length).toEqual(4);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(3);
    }
  });
});
