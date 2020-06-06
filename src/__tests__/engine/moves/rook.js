import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
} from '../../../engine/Board';
import {
  create as createPiece,
  possibleMovesIgnoringCheck,
} from '../../../engine/Piece';
import { KNIGHT, ROOK } from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';
import checkMove from '../../../testutil/checkMove';

describe('rook moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should move vertically and horizontally', () => {
    const from = getSquareFromBoard(board, 5, 'e');
    const rook = createPiece(PLAYER_WHITE, ROOK);
    setPieceOnSquare(from, rook);

    // Set up some pieces that block the rook's movement.

    // north: 3 moves
    setPieceOnBoard(board, 8, 'e', createPiece(PLAYER_BLACK, KNIGHT));
    // east: no obstacle, 4 moves
    // south: no obstacle, 4 moves
    // west: 3 moves
    setPieceOnBoard(board, 5, 1, createPiece(PLAYER_WHITE, KNIGHT));

    possibleMovesIgnoringCheck(rook, board, moves);

    expect(moves.length).toEqual(14);
    checkMove(moves[0], from, 6, 'e');
    checkMove(moves[1], from, 7, 'e');
    checkMove(moves[2], from, 8, 'e');
    checkMove(moves[3], from, 5, 'f');
    checkMove(moves[4], from, 5, 'g');
    checkMove(moves[5], from, 5, 'h');
    checkMove(moves[6], from, 5, 'i');
    checkMove(moves[7], from, 4, 'e');
    checkMove(moves[8], from, 3, 'e');
    checkMove(moves[9], from, 2, 'e');
    checkMove(moves[10], from, 1, 'e');
    checkMove(moves[11], from, 5, 'd');
    checkMove(moves[12], from, 5, 'c');
    checkMove(moves[13], from, 5, 'b');
  });
});
