import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {KNIGHT, BISHOP} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import checkMove from '../../../testutil/checkMove';

describe('bishop moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should move diagonal', () => {
    const from = board.getSquare(5, 'e');
    const bishop = new Piece(PLAYER_WHITE, BISHOP);
    from.setPiece(bishop);

    // Set up some pieces that block the bishop's movement.

    // north-east: 2 moves
    board.setPiece(8, 'h', new Piece(PLAYER_WHITE, KNIGHT));
    // south-east: 0 moves
    board.setPiece(4, 'f', new Piece(PLAYER_WHITE, KNIGHT));
    // south-west: 1 move
    board.setPiece(4, 'd', new Piece(PLAYER_BLACK, KNIGHT));
    // north-east: no obstacle, 4 moves

    bishop.possibleMovesIgnoringCheck(board, moves);

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
