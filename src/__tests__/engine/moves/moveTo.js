import {
  create as createBoard,
  getSquare as getSquareFromBoard,
} from '../../../engine/Board';
import { create as createPiece } from '../../../engine/Piece';
import { LASER, KNIGHT, PAWN_90_DEGREES } from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';

import moveTo, { CAPTURE_MODE_MUST_NOT } from '../../../engine/moves/moveTo';

describe('moveTo util', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should not move without a source piece', () => {
    // the board is empty, so 1-a has no piece
    moveTo(
      board,
      moves,
      getSquareFromBoard(board, 1, 'a'),
      getSquareFromBoard(board, 2, 'b'),
    );
    expect(moves.length).toEqual(0);
  });

  test('should not move off board', () => {
    const from = getSquareFromBoard(board, 1, 'a');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, LASER));
    const to = getSquareFromBoard(board, 0, 'a');
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(0);
  });

  test('should not move off board 2', () => {
    const from = getSquareFromBoard(board, 1, 'a');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, LASER));
    const to = getSquareFromBoard(board, 9, 'j');
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(0);
  });

  test('should move to empty square', () => {
    const from = getSquareFromBoard(board, 1, 'a');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, LASER));
    const to = getSquareFromBoard(board, 2, 'b');
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(1);
    expect(moves[0].from).toBe(from);
    expect(moves[0].to).toBe(to);
  });

  test('should not move to an square occupied by a friendly piece', () => {
    const from = getSquareFromBoard(board, 1, 'a');
    const to = getSquareFromBoard(board, 2, 'b');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, LASER));
    setPieceOnSquare(to, createPiece(PLAYER_WHITE, KNIGHT));
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(0);
  });

  test('should capture', () => {
    const from = getSquareFromBoard(board, 1, 'a');
    const to = getSquareFromBoard(board, 2, 'b');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, LASER));
    setPieceOnSquare(to, createPiece(PLAYER_BLACK, KNIGHT));
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(1);
    expect(moves[0].from).toBe(from);
    expect(moves[0].to).toBe(to);
  });

  test('pawn should not capture straight', () => {
    const from = getSquareFromBoard(board, 2, 'a');
    const to = getSquareFromBoard(board, 3, 'a');
    setPieceOnSquare(from, createPiece(PLAYER_WHITE, PAWN_90_DEGREES));
    setPieceOnSquare(to, createPiece(PLAYER_BLACK, LASER));
    moveTo(board, moves, from, to, CAPTURE_MODE_MUST_NOT);
    expect(moves.length).toEqual(0);
  });
});
