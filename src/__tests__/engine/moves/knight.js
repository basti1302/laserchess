import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
} from '../../../engine/Board';
import {
  create as createPiece,
  possibleMovesIgnoringCheck,
} from '../../../engine/Piece';
import { BISHOP, KNIGHT } from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';
import checkMove from '../../../testutil/checkMove';

describe('knight moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should move, well, as the knight moves', () => {
    const from = getSquareFromBoard(board, 5, 'b');
    const knight = createPiece(PLAYER_WHITE, KNIGHT);
    setPieceOnSquare(from, knight);

    // Set up some pieces that block the knight's movement.

    // block
    setPieceOnBoard(board, 6, 'd', createPiece(PLAYER_WHITE, BISHOP));
    // capture
    setPieceOnBoard(board, 4, 'd', createPiece(PLAYER_BLACK, BISHOP));

    possibleMovesIgnoringCheck(knight, board, moves);

    expect(moves.length).toEqual(5);
    checkMove(moves[0], from, 7, 'a');
    checkMove(moves[1], from, 7, 'c');
    checkMove(moves[2], from, 4, 'd');
    checkMove(moves[3], from, 3, 'c');
    checkMove(moves[4], from, 3, 'a');
  });
});
