import Board from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {LASER, KNIGHT, PAWN_90_DEGREES} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';

import moveTo, {
  CAPTURE_MODE_MUST,
  CAPTURE_MODE_MUST_NOT,
} from '../../../engine/moves/moveTo';

describe('moveTo util', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should not move without a source piece', () => {
    // the board is empty, so 1-a has no piece
    moveTo(board, moves, board.getSquare(1, 'a'), board.getSquare(2, 'b'));
    expect(moves.length).toEqual(0);
  });

  test('should not move off board', () => {
    const from = board.getSquare(1, 'a');
    from.setPiece(new Piece(PLAYER_WHITE, LASER));
    const to = board.getSquare(0, 'a');
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(0);
  });

  test('should not move off board 2', () => {
    const from = board.getSquare(1, 'a');
    from.setPiece(new Piece(PLAYER_WHITE, LASER));
    const to = board.getSquare(9, 'j');
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(0);
  });

  test('should move to empty square', () => {
    const from = board.getSquare(1, 'a');
    from.setPiece(new Piece(PLAYER_WHITE, LASER));
    const to = board.getSquare(2, 'b');
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(1);
    expect(moves[0].from).toBe(from);
    expect(moves[0].to).toBe(to);
  });

  test('should not move to an square occupied by a friendly piece', () => {
    const from = board.getSquare(1, 'a');
    const to = board.getSquare(2, 'b');
    from.setPiece(new Piece(PLAYER_WHITE, LASER));
    to.setPiece(new Piece(PLAYER_WHITE, KNIGHT));
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(0);
  });

  test('should capture', () => {
    const from = board.getSquare(1, 'a');
    const to = board.getSquare(2, 'b');
    from.setPiece(new Piece(PLAYER_WHITE, LASER));
    to.setPiece(new Piece(PLAYER_BLACK, KNIGHT));
    moveTo(board, moves, from, to);
    expect(moves.length).toEqual(1);
    expect(moves[0].from).toBe(from);
    expect(moves[0].to).toBe(to);
  });

  test('pawn should not capture straight', () => {
    const from = board.getSquare(2, 'a');
    const to = board.getSquare(3, 'a');
    from.setPiece(new Piece(PLAYER_WHITE, PAWN_90_DEGREES));
    to.setPiece(new Piece(PLAYER_BLACK, LASER));
    moveTo(board, moves, from, to, CAPTURE_MODE_MUST_NOT);
    expect(moves.length).toEqual(0);
  });
});
