import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {PAWN, KNIGHT} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import checkMove from '../../../testutil/checkMove';

describe('knight moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should move, well, as the knight moves', () => {
    const from = board.getSquare(5, 'b');
    const knight = new Piece(PLAYER_WHITE, KNIGHT);
    from.setPiece(knight);

    // Set up some pieces that block the knight's movement.

    // block
    board.setPiece(6, 'd', new Piece(PLAYER_WHITE, PAWN));
    // capture
    board.setPiece(4, 'd', new Piece(PLAYER_BLACK, PAWN));

    knight.possibleMovesIgnoringCheck(board, moves);

    expect(moves.length).toEqual(5);
    checkMove(moves[0], from, 7, 'a');
    checkMove(moves[1], from, 7, 'c');
    checkMove(moves[2], from, 4, 'd');
    checkMove(moves[3], from, 3, 'c');
    checkMove(moves[4], from, 3, 'a');
  });
});
