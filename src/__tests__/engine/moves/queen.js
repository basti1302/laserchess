import Board, {ranks, files} from '../../../engine/Board';
import Piece from '../../../engine/Piece';
import {PAWN, QUEEN} from '../../../engine/PieceType';
import {PLAYER_WHITE, PLAYER_BLACK} from '../../../engine/Player';
import checkMove from '../../../testutil/checkMove';

describe('queen moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = new Board();
    moves = [];
  });

  test('should move in all directions', () => {
    const from = board.getSquare(5, 'e');
    const queen = new Piece(PLAYER_WHITE, QUEEN);
    from.setPiece(queen);

    // Set up some pieces that block the queen's movement.

    // north: 3 moves
    board.setPiece(8, 'e', new Piece(PLAYER_BLACK, PAWN));
    // north-east: 2 moves
    board.setPiece(8, 'h', new Piece(PLAYER_WHITE, PAWN));
    // east: no obstacle, 4 moves
    // south-east: 0 moves
    board.setPiece(4, 'f', new Piece(PLAYER_WHITE, PAWN));
    // south: no obstacle, 4 moves
    // south-west: 1 move
    board.setPiece(4, 'd', new Piece(PLAYER_BLACK, PAWN));
    // west: 3 moves
    board.setPiece(5, 'a', new Piece(PLAYER_WHITE, PAWN));
    // north-east: no obstacle, 4 moves

    queen.possibleMovesIgnoringCheck(board, moves);

    expect(moves.length).toEqual(21);
    checkMove(moves[0], from, 6, 'e');
    checkMove(moves[1], from, 7, 'e');
    checkMove(moves[2], from, 8, 'e');
    checkMove(moves[3], from, 6, 'f');
    checkMove(moves[4], from, 7, 'g');
    checkMove(moves[5], from, 5, 'f');
    checkMove(moves[6], from, 5, 'g');
    checkMove(moves[7], from, 5, 'h');
    checkMove(moves[8], from, 5, 'i');
    checkMove(moves[9], from, 4, 'e');
    checkMove(moves[10], from, 3, 'e');
    checkMove(moves[11], from, 2, 'e');
    checkMove(moves[12], from, 1, 'e');
    checkMove(moves[13], from, 4, 'd');
    checkMove(moves[14], from, 5, 'd');
    checkMove(moves[15], from, 5, 'c');
    checkMove(moves[16], from, 5, 'b');
    checkMove(moves[17], from, 6, 'd');
    checkMove(moves[18], from, 7, 'c');
    checkMove(moves[19], from, 8, 'b');
    checkMove(moves[20], from, 9, 'a');
  });
});
