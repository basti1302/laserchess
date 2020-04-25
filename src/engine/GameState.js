export default class GameState {
  constructor(label) {
    this.label = label;
  }
}

export const BOTH_KINGS_LOST = new GameState('both-kings-lost');
export const CHECKMATE = new GameState('checkmate');
export const IN_PROGRESS = new GameState('in-progress');
export const KING_LOST = new GameState('king-lost');
export const KING_SUICIDE = new GameState('king-suicide');
export const STALEMATE = new GameState('stalemate');
