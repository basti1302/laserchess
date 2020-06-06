import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
} from '../../../engine/Board';
import {
  create as createPiece,
  possibleMovesIgnoringCheck,
} from '../../../engine/Piece';
import { KNIGHT, LASER } from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';
import checkMove from '../../../testutil/checkMove';

describe('laser moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should move one square in each direction', () => {
    const from = getSquareFromBoard(board, 1, 'c');
    const laser = createPiece(PLAYER_WHITE, LASER);
    setPieceOnSquare(from, laser);

    // Set up some pieces that block the laser's movement.

    // block
    setPieceOnBoard(board, 2, 4, createPiece(PLAYER_WHITE, KNIGHT));
    // capture
    setPieceOnBoard(board, 2, 2, createPiece(PLAYER_BLACK, KNIGHT));

    possibleMovesIgnoringCheck(laser, board, moves);

    expect(moves.length).toEqual(4);
    checkMove(moves[0], from, 2, 'c');
    // blocked: 2, 4
    checkMove(moves[1], from, 1, 'd');
    checkMove(moves[2], from, 1, 'b');
    checkMove(moves[3], from, 2, 'b');
  });
});
