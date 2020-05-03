import {immerable} from 'immer';

import Player, {PLAYER_WHITE, PLAYER_BLACK} from './Player';
import PieceType, {LASER} from './PieceType';
import Orientation, {NORTH, SOUTH} from './Orientation';
import fireLaser from './laser/fireLaser';

export default class Piece {
  [immerable] = true;

  constructor(player, type, orientation) {
    if (player.constructor !== Player) {
      throw new Error(`Illegal argument for player: ${JSON.stringify(player)}`);
    }
    if (!player.is(PLAYER_WHITE) && !player.is(PLAYER_BLACK)) {
      throw new Error(`Illegal argument for player: ${JSON.stringify(player)}`);
    }
    if (type.constructor !== PieceType) {
      throw new Error(`Illegal argument for type: ${JSON.stringify(type)}`);
    }
    if (orientation && orientation.constructor !== Orientation) {
      throw new Error(
        `Illegal argument for orientation: ${JSON.stringify(orientation)}`,
      );
    }
    this.player = player;
    this.type = type;
    if (orientation) {
      this.orientation = orientation;
    } else {
      if (player.is(PLAYER_WHITE)) {
        this.orientation = NORTH;
      } else if (player.is(PLAYER_BLACK)) {
        this.orientation = SOUTH;
      }
    }
    this.rank = null;
    this.file = null;
    this.hasMoved = false;
  }

  setPosition(rank, file) {
    this.rank = rank;
    this.file = file;
  }

  clearPosition() {
    this.rank = null;
    this.file = null;
  }

  getPosition() {
    if (this.rank && this.file) {
      return {
        rank: this.rank,
        file: this.file,
      };
    } else {
      return null;
    }
  }

  getSquare(board) {
    return board.getSquare(this.rank, this.file);
  }

  possibleMovesIgnoringCheck(board, moves, ignoreCastling = false) {
    this.type.possibleMoves(board, moves, this, ignoreCastling);
  }

  possibleMoves(board, moves) {
    this.possibleMovesIgnoringCheck(board, moves);
    board.pruneMovesThatLeadToCheckFor(moves, this.player);
  }

  rotateLeft() {
    this.orientation = this.orientation.rotateLeft();
  }

  rotateRight() {
    this.orientation = this.orientation.rotateRight();
  }

  fire(board) {
    if (!this.type.is(LASER)) {
      throw new Error(`Only lasers can fire, this is a ${this.type}.`);
    }
    return fireLaser(board, this.getSquare(board), this.orientation);
  }

  clone() {
    const clonedPiece = new Piece(this.player, this.type);
    clonedPiece.rank = this.rank;
    clonedPiece.file = this.file;
    clonedPiece.orientation = this.orientation;
    clonedPiece.hasMoved = this.hasMoved;
    return clonedPiece;
  }
}
