import { WHITE, BLACK } from './Color';

function create(boardIoLabel, color) {
  if (typeof boardIoLabel !== 'string' || boardIoLabel.length !== 1) {
    throw new Error(
      `Illegal argument for boardIoLabel: ${typeof boardIoLabel}: ${boardIoLabel}`,
    );
  }
  if (!color) {
    throw new Error('Missing mandatory argument: color.');
  }
  return {
    boardIoLabel,
    color,
  };
}

export function enemy(player) {
  if (is(player, PLAYER_WHITE)) {
    return PLAYER_BLACK;
  } else if (is(player, PLAYER_BLACK)) {
    return PLAYER_WHITE;
  } else {
    throw new Error(`Can't provide enemy for ${player}.`);
  }
}

export function is(player, other) {
  return player.boardIoLabel === other.boardIoLabel;
}

export const PLAYER_WHITE = create('0', WHITE);
export const PLAYER_BLACK = create('1', BLACK);
