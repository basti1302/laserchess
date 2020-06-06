import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
} from '../../../engine/Board';
import {
  create as createPiece,
  possibleMovesIgnoringCheck,
} from '../../../engine/Piece';
import { KNIGHT, BISHOP } from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';
import checkMove from '../../../testutil/checkMove';

describe('bishop moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should move diagonal', () => {
    const from = getSquareFromBoard(board, 5, 'e');
    const bishop = createPiece(PLAYER_WHITE, BISHOP);
    setPieceOnSquare(from, bishop);

    // Set up some pieces that block the bishop's movement.

    // north-east: 2 moves
    setPieceOnBoard(board, 8, 'h', createPiece(PLAYER_WHITE, KNIGHT));
    // south-east: 0 moves
    setPieceOnBoard(board, 4, 'f', createPiece(PLAYER_WHITE, KNIGHT));
    // south-west: 1 move
    setPieceOnBoard(board, 4, 'd', createPiece(PLAYER_BLACK, KNIGHT));
    // north-east: no obstacle, 4 moves

    possibleMovesIgnoringCheck(bishop, board, moves);

    expect(moves.length).toEqual(7);
    checkMove(moves[0], from, 6, 'f');
    checkMove(moves[1], from, 7, 'g');
    checkMove(moves[2], from, 4, 'd');
    checkMove(moves[3], from, 6, 'd');
    checkMove(moves[4], from, 7, 'c');
    checkMove(moves[5], from, 8, 'b');
    checkMove(moves[6], from, 9, 'a');
  });
});
