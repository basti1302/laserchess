import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {QUEEN} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import {
  NORTH,
  NORTH_EAST,
  EAST,
  SOUTH_EAST,
  SOUTH,
  SOUTH_WEST,
  WEST,
  NORTH_WEST,
} from '../../../engine/moves/Direction';

import movesStraightLine from '../../../engine/moves/movesStraightLine';

describe('straight line moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should not move without a source piece', () => {
    movesStraightLine(board, moves, board.getSquare(1, 'a'), NORTH);
    expect(moves.length).toEqual(0);
  });

  test('should move north', () => {
    const from = board.getSquare(1, 'c');
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(3);
    }
  });

  test('should move north-east', () => {
    const from = board.getSquare(1, 'a');
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH_EAST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(i + 2);
    }
  });

  test('should move east', () => {
    const from = board.getSquare(4, 'a');
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, EAST);
    expect(moves.length).toEqual(files - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(4);
      expect(moves[i].to.file).toEqual(i + 2);
    }
  });

  test('should move south-east', () => {
    const from = board.getSquare(ranks, 'a');
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, SOUTH_EAST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(ranks - i - 1);
      expect(moves[i].to.file).toEqual(i + 2);
    }
  });

  test('should move south', () => {
    const from = board.getSquare(ranks, 'c');
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, SOUTH);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(ranks - i - 1);
      expect(moves[i].to.file).toEqual(3);
    }
  });

  test('should move south-west', () => {
    const from = board.getSquare(ranks, files);
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, SOUTH_WEST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(ranks - i - 1);
      expect(moves[i].to.file).toEqual(files - i - 1);
    }
  });

  test('should move west', () => {
    const from = board.getSquare(4, files);
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, WEST);
    expect(moves.length).toEqual(files - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(4);
      expect(moves[i].to.file).toEqual(files - i - 1);
    }
  });

  test('should move north-west', () => {
    const from = board.getSquare(1, files);
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH_WEST);
    expect(moves.length).toEqual(ranks - 1);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(files - i - 1);
    }
  });

  test('should be blocked by friendly piece', () => {
    const from = board.getSquare(1, 'c');
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    board.setPiece(5, 'c', new Piece(PLAYER_WHITE, QUEEN));
    movesStraightLine(board, moves, from, NORTH);
    expect(moves.length).toEqual(3);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(3);
    }
  });

  test('should be stopped by enemy piece', () => {
    const from = board.getSquare(1, 'c');
    from.setPiece(new Piece(PLAYER_WHITE, QUEEN));
    board.setPiece(5, 'c', new Piece(PLAYER_BLACK, QUEEN));
    movesStraightLine(board, moves, from, NORTH);
    expect(moves.length).toEqual(4);
    for (let i = 0; i < moves.length; i++) {
      expect(moves[i].from).toBe(from);
      expect(moves[i].to.rank).toEqual(i + 2);
      expect(moves[i].to.file).toEqual(3);
    }
  });
});
