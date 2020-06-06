import {
  create as createBoard,
  getSquare as getSquareFromBoard,
  setPiece as setPieceOnBoard,
} from '../../../engine/Board';
import {
  create as createPiece,
  possibleMovesIgnoringCheck,
} from '../../../engine/Piece';
import { KNIGHT, QUEEN } from '../../../engine/PieceType';
import { PLAYER_WHITE, PLAYER_BLACK } from '../../../engine/Player';
import { setPiece as setPieceOnSquare } from '../../../engine/Square';
import checkMove from '../../../testutil/checkMove';

describe('queen moves', () => {
  let board;
  let moves;

  beforeEach(() => {
    board = createBoard();
    moves = [];
  });

  test('should move in all directions', () => {
    const from = getSquareFromBoard(board, 5, 'e');
    const queen = createPiece(PLAYER_WHITE, QUEEN);
    setPieceOnSquare(from, queen);

    // Set up some pieces that block the queen's movement.

    // north: 3 moves
    setPieceOnBoard(board, 8, 'e', createPiece(PLAYER_BLACK, KNIGHT));
    // north-east: 2 moves
    setPieceOnBoard(board, 8, 'h', createPiece(PLAYER_WHITE, KNIGHT));
    // east: no obstacle, 4 moves
    // south-east: 0 moves
    setPieceOnBoard(board, 4, 'f', createPiece(PLAYER_WHITE, KNIGHT));
    // south: no obstacle, 4 moves
    // south-west: 1 move
    setPieceOnBoard(board, 4, 'd', createPiece(PLAYER_BLACK, KNIGHT));
    // west: 3 moves
    setPieceOnBoard(board, 5, 'a', createPiece(PLAYER_WHITE, KNIGHT));
    // north-east: no obstacle, 4 moves

    possibleMovesIgnoringCheck(queen, board, moves);

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
