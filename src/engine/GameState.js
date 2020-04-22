export default class GameState {
  constructor(label) {
    this.label = label;
  }
}

export const IN_PROGRESS = new GameState('in-progress');
export const CHECKMATE = new GameState('checkmate');
export const STALEMATE = new GameState('stalemate');
export const KING_LOST = new GameState('king-lost');
export const KING_SUICIDE = new GameState('king-suicide');
