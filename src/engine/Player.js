import Color, {WHITE, BLACK} from './Color';

export default class Player {
  constructor(boardIoLabel, color) {
    if (typeof boardIoLabel !== 'string' || boardIoLabel.length !== 1) {
      throw new Error(
        `Illegal argument for boardIoLabel: ${typeof boardIoLabel}: ${boardIoLabel}`,
      );
    }
    if (color.constructor !== Color) {
      throw new Error(`Illegal argument for color: ${JSON.stringify(color)}`);
    }
    this.boardIoLabel = boardIoLabel;
    this.color = color;
  }

  enemy() {
    if (this === PLAYER_WHITE) {
      return PLAYER_BLACK;
    } else if (this === PLAYER_BLACK) {
      return PLAYER_WHITE;
    } else {
      throw new Error(`Can't provide enemy for ${this}.`);
    }
  }
}

export const PLAYER_WHITE = new Player('0', WHITE);
export const PLAYER_BLACK = new Player('1', BLACK);
