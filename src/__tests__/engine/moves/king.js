import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {PAWN, KING} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import checkMove from '../../../testutil/checkMove';

describe('king moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should move one square in each direction', () => {
    const from = board.getSquare(1, 'c');
    const king = new Piece(PLAYER_WHITE, KING);
    from.setPiece(king);

    // Set up some pieces that block the king's movement.

    // block
    board.setPiece(2, 4, new Piece(PLAYER_WHITE, PAWN));
    // capture
    board.setPiece(2, 2, new Piece(PLAYER_BLACK, PAWN));

    king.possibleMoves(board, moves);

    expect(moves.length).toEqual(4);
    checkMove(moves[0], from, 2, 'c');
    // blocked: 2, 4
    checkMove(moves[1], from, 1, 'd');
    checkMove(moves[2], from, 1, 'b');
    checkMove(moves[3], from, 2, 'b');
  });
});
